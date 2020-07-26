// Type definitions for websocket-stream 5.3
// Project: https://github.com/maxogden/websocket-stream#readme
// Original definitions by: Ben Burns <https://github.com/benjamincburns>

import * as WebSocket from 'ws';
import { Duplex } from 'stream';
import * as http from 'http';

declare namespace WebSocketStream {
  type WebSocketDuplex = Duplex & { socket: WebSocket };

  class Server extends WebSocket.Server {
    on(event: 'connection', cb: (this: WebSocket.Server, socket: WebSocket, request: http.IncomingMessage) => void): this;
    on(event: 'error', cb: (this: WebSocket.Server, error: Error) => void): this;
    on(event: 'headers', cb: (this: WebSocket.Server, headers: string[], request: http.IncomingMessage) => void): this;
    on(event: 'listening', cb: (this: WebSocket.Server) => void): this;
    on(event: 'stream', cb: (this: WebSocket, stream: WebSocketDuplex, request: http.IncomingMessage) => void): this;
    on(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;
  }

  function createServer(opts?: WebSocket.ServerOptions, callback?: () => void): Server;
}

declare function WebSocketStream(target: string | WebSocket, options?: WebSocket.ClientOptions): WebSocketStream.WebSocketDuplex;
declare function WebSocketStream(target: string | WebSocket, protocols?: string | string[], options?: WebSocket.ClientOptions): WebSocketStream.WebSocketDuplex;

export = WebSocketStream;
