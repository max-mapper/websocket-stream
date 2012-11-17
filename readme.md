# websocket-stream

    npm install websocket-stream

use HTML5 [websockets](https://developer.mozilla.org/en-US/docs/WebSockets) the node way -- with streams

    var websocket = require('websocket-stream')
    var ws = websocket('ws://realtimecats.com')
    ws.pipe(somewhereAwesome)

`ws` is a stream and speaks stream events: `data`, `error` and `end`. that means you can pipe output to anything that accepts streams. you can also pipe data into streams (such as a webcam feed or audio data)

BSD LICENSE