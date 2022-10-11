import { Receiver } from '../remote/Receiver';
import { WebSocketServer } from 'ws';
export declare class WSReceiver {
    wss: WebSocketServer;
    receiver: Receiver;
    constructor(receiver: Receiver, port: number);
}
