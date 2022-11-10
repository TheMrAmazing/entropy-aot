import { serialize, deserialize } from 'v8'
import WebSocket from 'ws'
import { Shim } from './Shim.js'
/**@typedef {import('../types').ControllerMessage} ControllerMessage*/
/**@typedef {import('../types').ReceiverMessage} ReceiverMessage*/
/**@typedef {import('../Receiver.js').Receiver} Receiver*/
/**@typedef {import('../Controller.js').Controller} Controller*/

export class WSShim extends Shim {
	constructor(/**@type {WebSocket}*/ ws) {
		super()
		this.ws = ws
		this.ws.onmessage = e => {
			if(this.remoter) {
				//@ts-ignore
				this.remoter.OnMessage(deserialize(new Uint8Array(e.data)))
			}
		}
	}

	postMessage(/**@type {ControllerMessage | ReceiverMessage}*/ message) {
		this.ws.send(serialize(message))
	}
}