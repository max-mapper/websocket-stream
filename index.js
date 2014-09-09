var through = require('through2')
var duplexify = require('duplexify')
var WS = require('ws')

module.exports = WebSocketStream

function WebSocketStream(target, options) {
  if (!options) options = {}
  var stream, socket
  var proxy = through(socketWrite, socketEnd)
  
  // use existing WebSocket object that was passed in
  if (typeof target === 'object') {
    socket = target
  // otherwise make a new one
  } else {
    socket = new WS(target, options)
    socket.binaryType = 'arraybuffer'
  }
    
  // was already open when passed in
  if (socket.readyState === 1) {
    stream = proxy
  } else {
    stream = duplexify()
    socket.addEventListener("open", onready)
  } 

  socket.addEventListener("close", onclose)
  socket.addEventListener("error", onerror)
  socket.addEventListener("message", onmessage)
    
  function socketWrite(chunk, enc, next) {
    socket.send(chunk)
    next()
  }
  
  function socketEnd(done) {
    socket.close()
    done()
  }
  
  function onready() {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
  }
  
  function onclose() {
    stream.destroy()
  }
  
  function onerror(err) {
    stream.destroy(err)
  }
  
  function onmessage(event) {
    var data = event.data
    if (data instanceof ArrayBuffer) data = new Buffer(new Uint8Array(data))
    proxy.push(data)
  }
  
  return stream
}
