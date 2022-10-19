import { Controller } from '../Controller'
export class WSController {
	/**@type {WebSocket}*/ wss
	controller
	connected = false
	constructor() { }
	reconnect(url, resolve) {
		if(!this.reconnecting) {
			console.log('reconnecting')
			this.reconnecting = true
			setTimeout(async () => {
				this.reconnecting = false
				resolve(await this.connect(url))
			}, 1000)
		}
	}
	connect(url) {
		return new Promise((resolve, reject) => {
			this.wss = new WebSocket(url)
			this.wss.onerror = async () => {
				this.reconnect(url, resolve)
			}
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
			this.wss.onclose = () => {
				this.connect(url)
			}
		})
	}
}
