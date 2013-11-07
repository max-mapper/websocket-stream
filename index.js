var stream = require('stream')
var util = require('util')
var isBuffer = require('isbuffer')
var WebSocketPoly = require('ws')

function WebsocketStream(server, options) {
  if (!(this instanceof WebsocketStream)) return new WebsocketStream(server, options)
  stream.Stream.call(this)
  this.options = options || {}
  this.readable = true
  this.writable = true
  this._buffer = []
 
  if (typeof server === "object") {
    this.ws = server
    this.ws.on('message', this.onMessage.bind(this))
    this.ws.on('error', this.onError.bind(this))
    this.ws.on('close', this.onClose.bind(this))
    this.ws.on('open', this.onOpen.bind(this))
    if (this.ws.readyState === 1) this._open = true
  } else {
    this.ws = new WebSocketPoly(server, this.options.protocol)
    this.ws.binaryType = this.options.binaryType || 'arraybuffer'
    this.ws.onmessage = this.onMessage.bind(this)
    this.ws.onerror = this.onError.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.ws.onopen = this.onOpen.bind(this)
  }

  var that = this
  this._sendCallback = function(err) {
    if (err) that.onError(err)
  }
}

util.inherits(WebsocketStream, stream.Stream)

module.exports = WebsocketStream
module.exports.WebsocketStream = WebsocketStream

WebsocketStream.prototype.onMessage = function(e, flags) {
  var data = e
  if (data.data) data = data.data
  
  // type must be a Typed Array (ArrayBufferView)
  var type = this.options.type
  if (type && data instanceof ArrayBuffer) data = new type(data)
  
  this.emit('data', data, flags)
}

WebsocketStream.prototype.onError = function(err) {
  this.emit('error', err)
}

WebsocketStream.prototype.onClose = function(err) {
  if (this._destroy) return
  this.emit('end')
  this.emit('close')
}

WebsocketStream.prototype.onOpen = function(err) {
  if (this._destroy) return
  this._open = true
  for (var i = 0; i < this._buffer.length; i++) {
    this._write(this._buffer[i])
  }
  this._buffer = undefined
  this.emit('open')
  this.emit('connect')
  if (this._end) this.ws.close()
}

WebsocketStream.prototype.write = function(data) {
  if (!this._open) {
    this._buffer.push(data)
  } else {
    this._write(data)
  }
}

WebsocketStream.prototype._write = function(data) {
  if (this.ws.readyState == 1)
    // we are connected
    typeof WebSocket != 'undefined' && this.ws instanceof WebSocket
      ? this.ws.send(data)
      : this.ws.send(data, { binary : isBuffer(data) })
  else
    this.emit('error', 'Not connected')
}

WebsocketStream.prototype.end = function(data) {
  if (data !== undefined) this.write(data)
  if (this._open) this.ws.close()
  this._end = true
}

WebsocketStream.prototype.destroy = function() {
  this._destroy = true
  this.ws.close()
}
