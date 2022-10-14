import { Controller } from '../Controller'
export class WSController {
	wss
	controller
	connected = false
	constructor() {
	}
	connect(url) {
		return new Promise((resolve, reject) => {
			try {
				this.wss = new WebSocket(url)
				this.wss.onopen = () => {
					this.controller = new Controller()
					this.controller.messenger = {
						postMessage: (message) => {
							this.wss.send(JSON.stringify(message))
						}
					}
					this.wss.onmessage = (e) => {
						this.controller.OnMessage(JSON.parse(e.data))
					}
					resolve(this.wss)
				}
			}
			catch (e) {
				console.log('reconnecting...')
				setTimeout(() => { this.connect(url) }, 500)
			}
		})
	}
}
