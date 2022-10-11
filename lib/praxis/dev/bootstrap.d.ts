/// <reference types="node" />
/// <reference types="node" />
import { Express } from 'express';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Server as WsServer } from 'socket.io';
export declare let tangleServer: TangleServer;
export declare class TangleServer {
    readonly server: HttpsServer | HttpServer;
    readonly app: Express;
    readonly io: WsServer;
    private constructor();
    static bootstrap(): Promise<TangleServer>;
}
