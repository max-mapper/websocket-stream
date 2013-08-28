var test = require('tape')
var websocket = require('./')
var WebSocketServer = require('ws').Server
var http = require('http')

test('echo server', function(t) {
  var server = http.createServer()
  var wss = new WebSocketServer({server: server})
  var port = process.env.PORT || 4042

  wss.on('connection', function(ws) {
    var stream = websocket(ws)
    stream.pipe(stream); // echo
  })

  server.listen(port, function() {
    var client = websocket('ws://localhost:' + port)

    client.on('data', function(data) {
      t.equal(data, 'hello world')
      client.end()
      server.close(function() {
        t.end()
      })
    })

    client.write('hello world')
  });

});
