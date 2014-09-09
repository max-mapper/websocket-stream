# websocket-stream

[![NPM](https://nodei.co/npm/websocket-stream.png?global=true)](https://nodei.co/npm/websocket-stream/)

Use HTML5 [websockets](https://developer.mozilla.org/en-US/docs/WebSockets) using the Node Streams API. Works in Node or in Browsers.

### In the browser

You can use [browserify](http://github.com/substack/node-browserify) to package this module for browser use.

```javascript
var websocket = require('websocket-stream')
var ws = websocket('ws://realtimecats.com')
ws.pipe(somewhereAwesome)
```

In the example above `ws` is a duplex stream. That means you can pipe output to anything that accepts streams. You can also pipe data into streams (such as a webcam feed or audio data). 

### On the server

Using the [`ws`](http://npmjs.org/ws) module you can make a websocket server and use this module to get websocket streams on the server:

```javascript
var WebSocketServer = require('ws').Server
var websocket = require('websocket-stream')
var wss = new WebSocketServer({server: someHTTPServer})
wss.on('connection', function(ws) {
  var stream = websocket(ws)
  fs.createReadStream('bigdata.json').pipe(stream)
})
```

## run the tests

### server-side tests

```
npm test

```

### client side tests

first start the echo server by running `node test-server.js`

then run `npm start` and open `localhost:9966` in your browser and open the Dev Tools console to see test output

## license

BSD LICENSE
