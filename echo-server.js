
var WebSocketServer = require('ws').Server
var http = require('http')
var websocket = require('./')
var server = null

var port = module.exports.port = 4042

module.exports.start = function(cb) {
  if (server) {
    cb(new Error("already started"));
    return;
  }

  server = http.createServer()
  var wss = new WebSocketServer({server: server})

  wss.on('connection', function(ws) {
    var stream = websocket(ws)
    stream.pipe(stream) // echo
  })

  server.listen(port, cb)
}

module.exports.stop = function(cb) {
  if (!server) {
    cb(new Error("not started"))
    return
  }

  server.close(cb)
  server = null
}
