var ws = require('websocket-stream')
var test = require('tape')

test('echo works', function(t) {
  var stream = ws('ws://localhost:8343')
  stream.on('data', function(o) {
    t.equal(o.toString(), 'hello', 'got hello back')
    stream.destroy()
    t.end()
  })
  stream.write(new Buffer('hello'))  
})
