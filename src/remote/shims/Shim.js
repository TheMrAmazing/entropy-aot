/**@typedef {import('../Controller.js').Controller} Controller*/
/**@typedef {import('../Receiver.js').Receiver} Receiver*/

export class Shim {
	/**@type {Controller | Receiver}*/ remoter

	addRemoter(/**@type {Controller | Receiver}*/ remoter) {
		this.remoter = remoter
		this.remoter.messenger = this
	}
}