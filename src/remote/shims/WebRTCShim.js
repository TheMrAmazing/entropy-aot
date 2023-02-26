import { Shim } from './Shim.js'
/**@typedef {import('../types').ControllerMessage} ControllerMessage*/
/**@typedef {import('../types').ReceiverMessage} ReceiverMessage*/
/**@typedef {import('../Receiver.js').Receiver} Receiver*/
/**@typedef {import('../Controller.js').Controller} Controller*/

export class WebRTCShim extends Shim {
	constructor(connection) {
		super()
		this.connection = connection
		this.connection.onmessage = e => {
			if(this.remoter) {
				//@ts-ignore
				this.remoter.OnMessage(e.data)
			}
		}
	}

	postMessage(/**@type {ControllerMessage | ReceiverMessage}*/ message) {
		this.connection.send(message)
	}
}
process.std