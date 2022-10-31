///<reference path="../../entities/User.js" />
/**@typedef {import('../../entities/Domain').Domain} Domain*/

import { WSController } from '../../remote/shims/BrowserController.js'
let ws = new WSController()
/**@return {import('../../remote/types').RemoteRoot<import('../../api').API>}*/ function api() {
	return ws.controller.remote
}
let state = {
	// @ts-ignore
	/**@type {string}*/ sess: undefined,
	// @ts-ignore
	/**@type {User}*/ user: undefined,
	// @ts-ignore
	/**@type {Domain}*/ domain: undefined
}
async function start() {
	await ws.connect('ws://localhost:1337')
	api().fileChangeEvent((/**@type {string}*/ e) => {
		let file = e.slice(e.lastIndexOf('\\') + 1, e.lastIndexOf('.'))
		if(componentRegistry.get(file)) {
			setTimeout(() => componentRegistry.get(file)?.forEach(comp => comp.patch()), 200)
		}
	})
	let x = await api().me('test')
}

start()
export { state,  api}
