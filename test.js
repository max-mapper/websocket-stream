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
