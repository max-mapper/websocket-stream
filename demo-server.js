var WebSocketServer = require('ws').Server
var http = require('http')
var ecstatic = require('ecstatic')(__dirname)
var server = http.createServer(ecstatic)
server.listen(8080)
var wss = new WebSocketServer({server: server})
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id)
  })
})