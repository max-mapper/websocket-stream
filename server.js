
var inherits = require('inherits')
var WebSocketServer = require('ws').Server
var stream = require('./stream')

module.exports = Server

function Server(opts, cb) {
  if (!(this instanceof Server)) {
    return new Server(opts, cb)
  }

  WebSocketServer.call(this, opts)

  var proxied = false
  this.on('newListener', function(event) {
    if (!proxied && event === 'stream') {
      proxied = true
      this.on('connection', function(conn) {
        this.emit('stream', stream(conn, opts))
      })
    }
  })

  if (cb) {
    this.on('stream', cb)
  }
}

inherits(Server, WebSocketServer)

