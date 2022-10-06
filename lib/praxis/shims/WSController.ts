import { serialize, deserialize } from 'v8'
import { Controller } from '../remote/Controller'
import {WebSocket}from 'ws'

export class WSController {
    wss: WebSocket
    controller: Controller
    connected: boolean = false
    constructor() {}

    connect(url:string) {
        return new Promise((resolve, reject) => {
            try {
                this.wss = new WebSocket(url)
                this.wss.onopen = () => {
                    this.controller = new Controller()
                    this.controller.messenger = {
                        postMessage: (message: any) => {
                            this.wss.send(serialize(message))
                        }
                    }
                    this.wss.onmessage = (e) => {
                        //@ts-ignore
                        this.controller.OnMessage(deserialize(new Uint8Array(e.data)))
        
                    }
                    resolve(this.wss)
                }
            } catch (e) {
                console.log('reconnecting...')
                setTimeout(() => {this.connect(url)}, 500)
            }
        })
    }
}