var stream = require('stream')
var util = require('util')

function WebsocketStream(server) {
  var me = this
  stream.Stream.call(me)
  this.readable = true
  this.writable = true
  me.ws = new WebSocket(server)
  me.ws.onmessage = me.onMessage.bind(this)
  me.ws.onerror = me.onError.bind(this)
  me.ws.onclose = me.onClose.bind(this)
}

util.inherits(WebsocketStream, stream.Stream)

module.exports = function(server) {
  return new WebsocketStream(server)
}

module.exports.WebsocketStream = WebsocketStream

WebsocketStream.prototype.onMessage = function(e) {
  this.emit('metadata', e)
  this.emit('data', e.data)
}

WebsocketStream.prototype.onError = function(err) {
  this.emit('error', err)
}

WebsocketStream.prototype.onClose = function(err) {
  this.emit('end')
}

WebsocketStream.prototype.write = function(data) {
  return this.ws.send(data)
}

WebsocketStream.prototype.end = function() {
  this.emit('end')
}
