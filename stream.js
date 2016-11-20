'use strict'

var through = require('through2')
var duplexify = require('duplexify')
var WS = require('ws')

module.exports = WebSocketStream

function WebSocketStream(target, protocols, options) {
  var stream, socket

  var isBrowser = process.title === 'browser'
  var isNative = !!global.WebSocket
  var socketWrite = isBrowser ? socketWriteBrowser : socketWriteNode
  var proxy = through.obj(socketWrite, socketEnd)

  if (protocols && !Array.isArray(protocols) && 'object' === typeof protocols) {
    // accept the "options" Object as the 2nd argument
    options = protocols
    protocols = null

    if (typeof options.protocol === 'string' || Array.isArray(options.protocol)) {
      protocols = options.protocol;
    }
  }

  if (!options) options = {}

  // browser only: sets the maximum socket buffer size before throttling
  var bufferSize = options.browserBufferSize || 1024 * 512

  // browser only: how long to wait when throttling
  var bufferTimeout = options.browserBufferTimeout || 1000

  // use existing WebSocket object that was passed in
  if (typeof target === 'object') {
    socket = target
  // otherwise make a new one
  } else {
    // special constructor treatment for native websockets in browsers, see
    // https://github.com/maxogden/websocket-stream/issues/82
    if (isNative && isBrowser) {
      socket = new WS(target, protocols)
    } else {
      socket = new WS(target, protocols, options)
    }

    socket.binaryType = 'arraybuffer'
  }

  // was already open when passed in
  if (socket.readyState === WS.OPEN) {
    stream = proxy
  } else {
    stream = duplexify.obj()
    socket.onopen = onopen
  }

  stream.socket = socket

  socket.onclose = onclose
  socket.onerror = onerror
  socket.onmessage = onmessage

  proxy.on('close', destroy)

  var coerceToBuffer = options.binary || options.binary === undefined

  function socketWriteNode(chunk, enc, next) {
    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = new Buffer(chunk, 'utf8')
    }
    socket.send(chunk, next)
  }

  function socketWriteBrowser(chunk, enc, next) {
    if (socket.bufferedAmount > bufferSize) {
      setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next)
      return
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = new Buffer(chunk, 'utf8')
    }

    try {
      socket.send(chunk)
    } catch(err) {
      return next(err)
    }

    next()
  }

  function socketEnd(done) {
    socket.close()
    done()
  }

  function onopen() {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
    stream.emit('connect')
  }

  function onclose() {
    stream.end()
    stream.destroy()
  }

  function onerror(err) {
    stream.destroy(err)
  }

  function onmessage(event) {
    var data = event.data
    if (data instanceof ArrayBuffer) data = new Buffer(new Uint8Array(data))
    else data = new Buffer(data)
    proxy.push(data)
  }

  function destroy() {
    socket.close()
  }

  return stream
}
