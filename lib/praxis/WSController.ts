import { serialize, deserialize } from 'v8'
import {w3cwebsocket as Client} from 'websocket'
import { Controller } from './Controller'

export class WSController {
    wss: Client
    controller: Controller
    constructor() {
        this.controller = new Controller()
        this.wss = new Client('ws://localhost:7071/')
        this.wss.onopen = () => {
            this.controller.Messenger = {
                postMessage: (message: any) => {
                    this.wss.send(serialize(message))
                }
            }
            this.wss.onmessage = (e) => {
                //@ts-ignore
                this.controller.OnMessage(deserialize(new Uint8Array(e.data)))

            }
        }
    }
}