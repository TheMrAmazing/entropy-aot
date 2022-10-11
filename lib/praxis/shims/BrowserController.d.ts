import { Controller } from '../remote/Controller';
export declare class WSController {
    wss: WebSocket;
    controller: Controller;
    connected: boolean;
    constructor();
    connect(url: string): Promise<unknown>;
}
