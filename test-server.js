var http = require('http')
var websocket = require('./')
var echo = require('./echo-server.js')

echo.start(function(){
  console.log('echo server is running')
})

function forBare (opts) {
  var server = http.createServer()

  websocket.createServer({
    server: server,
    binary: opts.binary
  }, sendString)

  server.listen(opts.port)

  function sendString (stream) {
    stream.write('hello world')
  }
}

forBare({
  port: 8344,
  binary: false
})

forBare({
  port: 8345
})
