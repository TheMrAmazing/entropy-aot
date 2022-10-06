import { Controller } from '../remote/Controller'

export class WSController {
    wss: WebSocket
    controller: Controller
    connected: boolean = false
    constructor() {
    }

    connect(url:string) {
        return new Promise((resolve, reject) => {
            try {
                this.wss = new WebSocket(url)
                this.wss.onopen = () => {
                    this.controller = new Controller()
                    this.controller.Messenger = {
                        postMessage: (message: any) => {
                            this.wss.send(JSON.stringify(message))
                        }
                    }
                    this.wss.onmessage = (e) => {
                        this.controller.OnMessage(JSON.parse(e.data))
        
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