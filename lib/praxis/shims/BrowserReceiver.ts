import { serialize, deserialize } from 'v8'
import { Receiver } from '../remote/Receiver'
import {WebSocketServer} from 'ws'

export class WSReceiver {
    wss: WebSocketServer
    receiver: Receiver
    constructor(receiver: Receiver, port: number) {
        this.receiver = receiver
        this.wss = new WebSocketServer({ port })
        console.log('Listening on port: ' + port)
        this.wss.on('connection', ws => {
            ws.onmessage = e => {
                this.receiver.Messenger = {
                    postMessage: (message: any) => {
                        ws.send(JSON.stringify(message))
                    }
                }
                //@ts-ignore
                this.receiver.OnMessage(JSON.parse(e.data))
            }
        })
        this.wss.on('close', e => {
            this.receiver.Messenger = undefined
        })
    }
}