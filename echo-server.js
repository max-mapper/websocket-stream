
var WebSocketServer = require('ws').Server
var http = require('http')
var websocket = require('./')
var server = null
var fake = require('./fake-server')

var port = module.exports.port = fake.port

module.exports.url = fake.url

module.exports.start = function(cb) {
  if (server) {
    cb(new Error('already started'));
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
    cb(new Error('not started'))
    return
  }

  server.close(cb)
  server = null
}

if (!module.parent) {
  module.exports.start(function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Echo server started on port ' + port);
  });
}
