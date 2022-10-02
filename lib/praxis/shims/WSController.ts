import { serialize, deserialize } from 'v8'
import { Controller } from '../remote/Controller'
import {WebSocket}from 'ws'

export class WSController {
    wss: WebSocket
    controller: Controller
    constructor() {
        this.controller = new Controller()
        this.wss = new WebSocket('ws://localhost:3000/')
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