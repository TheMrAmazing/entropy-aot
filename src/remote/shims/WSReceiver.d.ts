import { Receiver } from '../Receiver';
import { WebSocketServer } from 'ws';
export declare class WSReceiver {
    wss: WebSocketServer;
    receiver: Receiver;
    constructor(receiver: Receiver, port: number);
}
