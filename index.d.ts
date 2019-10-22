// Type definitions for websocket-stream 5.5
// Project: https://github.com/maxogden/websocket-stream#readme
// Original definitions by: Ben Burns <https://github.com/benjamincburns>

import * as WebSocket from 'ws';
import { Duplex } from 'stream';
import * as http from 'http';

declare namespace WebSocketStream {
  type WebSocketDuplex = Duplex & { socket: WebSocket };

  class Server extends WebSocket.Server {
    on(event: 'connection', cb: (this: WebSocket, socket: WebSocket, request: http.IncomingMessage) => void): this;
    on(event: 'error', cb: (this: WebSocket, error: Error) => void): this;
    on(event: 'headers', cb: (this: WebSocket, headers: string[], request: http.IncomingMessage) => void): this;
    on(event: 'listening', cb: (this: WebSocket) => void): this;
    on(event: 'stream', cb: (this: WebSocket, stream: WebSocketDuplex, request: http.IncomingMessage) => void): this;
    on(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;
  }

  function createServer(opts?: WebSocket.ServerOptions, callback?: () => void): Server;
}

interface ClientOptions extends WebSocket.ClientOptions {
  browserBufferSize?: number;
  browserBufferTimeout?: number;
  objectMode?: boolean;
  binary?: boolean;
}

declare function WebSocketStream(target: string | WebSocket, options?: ClientOptions): WebSocketStream.WebSocketDuplex;
declare function WebSocketStream(target: string | WebSocket, protocols?: string | string[], options?: ClientOptions): WebSocketStream.WebSocketDuplex;

export = WebSocketStream;
