import { Controller } from '../Controller';
import { WebSocket } from 'ws';
export declare class WSController {
    wss: WebSocket;
    controller: Controller;
    connected: boolean;
    constructor();
    connect(url: string): Promise<unknown>;
}
