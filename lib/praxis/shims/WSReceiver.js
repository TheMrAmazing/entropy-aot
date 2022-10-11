import { serialize, deserialize } from 'v8'
import { WebSocketServer } from 'ws'
export class WSReceiver {
	wss
	receiver
	constructor(receiver, port) {
		this.receiver = receiver
		this.wss = new WebSocketServer({ port })
		console.log('Listening on port: ' + port)
		this.wss.on('connection', ws => {
			ws.onmessage = e => {
				this.receiver.messenger = {
					postMessage: (message) => {
						ws.send(serialize(message))
					}
				}
				//@ts-ignore
				this.receiver.OnMessage(deserialize(new Uint8Array(e.data)))
			}
		})
		this.wss.on('close', e => {
			this.receiver.messenger = undefined
		})
	}
}
