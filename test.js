var test = require('tape')
var websocket = require('./')
var echo = require("./echo-server")

test('echo server', function(t) {

  echo.start(function() {
    var client = websocket(echo.url, echo.options)

    client.on('error', console.error)

    client.on('data', function(data) {
      t.equal(data, 'hello world')
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
  t.plan(2)

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
      t.equal(data, 'hello world')
      client.end()
      echo.stop(function() {})
    })

    client.write('hello world')
  });

});
