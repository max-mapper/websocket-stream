var http = require('http')
var websocket = require('./')
var server = null

var port = module.exports.port = 8343
var url = module.exports.url = 'ws://localhost:' + module.exports.port

module.exports.start = function(opts, cb) {
  if (server) {
    cb(new Error('already started'));
    return;
  }

  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  server = http.createServer()
  opts.server = server

  var wss = new websocket.Server(opts)

  wss.on('stream', function(stream) {
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
