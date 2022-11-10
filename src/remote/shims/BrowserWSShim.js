import { Shim } from './Shim.js'
/**@typedef {import('../types').ControllerMessage} ControllerMessage*/
/**@typedef {import('../types').ReceiverMessage} ReceiverMessage*/
/**@typedef {import('../Receiver.js').Receiver} Receiver*/
/**@typedef {import('../Controller.js').Controller} Controller*/

export class BrowserWSShim extends Shim {
	constructor(/**@type {WebSocket}*/ ws) {
		super()
		this.ws = ws
		this.ws.onmessage = e => {
			if(this.remoter) {
				//@ts-ignore
				this.remoter.OnMessage(JSON.parse(e.data))
			}
		}
	}

	postMessage(/**@type {ControllerMessage | ReceiverMessage}*/ message) {
		this.ws.send(JSON.stringify(message))
	}
}