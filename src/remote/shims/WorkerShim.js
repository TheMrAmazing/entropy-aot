import { Shim } from './Shim.js'
/**@typedef {import('../types').ControllerMessage} ControllerMessage*/
/**@typedef {import('../types').ReceiverMessage} ReceiverMessage*/
/**@typedef {import('../Receiver.js').Receiver} Receiver*/
/**@typedef {import('../Controller.js').Controller} Controller*/

export class WorkerShim extends Shim {
	constructor(/**@type {MessagePort}*/ port) {
		super()
		this.port = port
		this.port.onmessage = e => {
			if(this.remoter) {
				//@ts-ignore
				this.remoter.OnMessage(e.data)
			}
		}
	}

	postMessage(/**@type {ControllerMessage | ReceiverMessage}*/ message) {
		this.port.postMessage(message)
	}
}