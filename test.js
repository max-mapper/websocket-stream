var test = require('tape')
var websocket = require('./')
var echo = require("./echo-server")
var http = require("http")
var WebSocketServer = require('ws').Server

test('echo server', function(t) {

  echo.start(function() {
    var client = websocket(echo.url, echo.options)

    client.on('error', console.error)

    client.on('data', function(data) {
      t.ok(Buffer.isBuffer(data), 'is a buffer')
      t.equal(data.toString(), 'hello world')
      client.end()
      echo.stop(function() {
        t.end()
      })
    })

    client.write('hello world')
  });

});

test('emitting not connected errors', function(t) {

  echo.start(function() {
    var client = websocket(echo.url, echo.options)

    client.on('error', function() {
      echo.stop(function() {
        t.true(true, 'should emit error')
        t.end()
      })
    })

    client.once('data', function(data) {
      client.end()
      client.write('abcde')
    })

    client.write('hello world')
  });

});

test('passes options to websocket constructor', function(t) {
  t.plan(3)

  opts = {
    verifyClient: function verifyClient(info) {
      t.equal(info.req.headers['x-custom-header'], 'Custom Value')
      return true
    }
  }
  echo.start(opts, function() {
    var options = {headers: {'x-custom-header': 'Custom Value'}}
    var client = websocket(echo.url, options)

    client.on('error', console.error)

    client.on('data', function(data) {
      t.ok(Buffer.isBuffer(data), 'is a buffer')
      t.equal(data.toString(), 'hello world')
      client.end()
      echo.stop(function() {})
    })

    client.write('hello world')
  });

});


test('destroy', function(t) {
  t.plan(1)

  echo.start(function() {
    var client = websocket(echo.url, echo.options)

    client.on('close', function() {
      echo.stop(function() {
        t.pass('destroyed')
      })
    })

    setTimeout(function() {
      client.destroy();
    }, 200);
  });

});

test('destroy client pipe should close server pipe', function(t) {
  t.plan(1);

  var clientDestroy = function() {
    var client = websocket(echo.url, echo.options)
    client.on('data', function(o) {
      client.destroy()
    })
    client.write(new Buffer('hello'))
  }

  var opts = {};
  var server = http.createServer()
  opts.server = server
  var wss = new WebSocketServer(opts)
  wss.on('connection', function(ws) {
    var stream = websocket(ws)
    stream.on('close', function() {
      server.close(function() {
        t.pass('close is called');
      })
    })
    stream.pipe(stream)
  });
  server.listen(echo.port, clientDestroy)
});


test('error on socket should forward it to pipe', function(t) {
  t.plan(1);

  var clientConnect = function() {
    websocket(echo.url, echo.options)
  }

  var opts = {};
  var server = http.createServer()
  opts.server = server
  var wss = new WebSocketServer(opts)
  wss.on('connection', function(ws) {
    var stream = websocket(ws)
    stream.on('error', function() {
      server.close(function() {
        t.pass('error is called');
      })
    })
    stream.socket.emit('error', 'Fake error');
  });
  server.listen(echo.port, clientConnect)
});
