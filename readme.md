# websocket-stream

    npm install websocket-stream

use HTML5 [websockets](https://developer.mozilla.org/en-US/docs/WebSockets) the node way -- with streams

# in the browser

you can use [browserify](http://github.com/substack/node-browserify) to package this module for browser use. there is a also pre-made + minified version you can download and use right away called `websocket-stream-min.js`

```javascript
var websocket = require('websocket-stream')
var ws = websocket('ws://realtimecats.com')
ws.pipe(somewhereAwesome)
```

`ws` is a stream and speaks stream events: `data`, `error` and `end`. that means you can pipe output to anything that accepts streams. you can also pipe data into streams (such as a webcam feed or audio data)

# on the server

using the [`ws`](http://npmjs.org/ws) module you can make a websocket server and use this module to get websocket streams on the server:

```javascript
var WebSocketServer = require('ws').Server
var websocket = require('websocket-stream')
var wss = new WebSocketServer({server: someHTTPServer})
wss.on('connection', function(ws) {
  var stream = websocket(ws)
  fs.createReadStream('bigdata.json').pipe(stream)
})
```

## extras

you can pass in a custom protocol to the constructor as the second argument

`require('websocket-stream').WebsocketStream` is the raw constructor

## binary sockets

To send binary data just write a [Buffer](nodejs.org/api/buffer.html) or [TypedArray](https://developer.mozilla.org/en-US/docs/JavaScript/Typed_arrays) to the stream.
On the other end you will receive [Buffer](nodejs.org/api/buffer.html) instances if it's the server and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/JavaScript/Typed_arrays/ArrayBuffer) instances if it's the client.

## license

BSD LICENSE
