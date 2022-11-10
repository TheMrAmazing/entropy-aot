export class ReconnectingWS {
	WSConstuctor
	/**@type {WebSocket}*/ wss
	/**@type {boolean}*/ reconnecting = false
	constructor(/**@type {any}*/ WSConstuctor = WebSocket) {
		this.WSConstuctor = WSConstuctor
	 }
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
			this.wss = new this.WSConstuctor(url)
			this.wss.onerror = async () => {
				this.reconnect(url, resolve)
			}
			this.wss.onopen = () => {
				resolve(this.wss)
			}
			this.wss.onclose = () => {
				this.connect(url)
			}
		})
	}
}
