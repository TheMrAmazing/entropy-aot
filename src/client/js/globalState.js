///<reference path="../../entities/User.js" />
import { Controller } from '../../remote/Controller.js'
import { BrowserWSShim } from '../../remote/shims/BrowserWSShim.js'
import { ReconnectingWS } from '../../remote/shims/ReconnectingWS.js'

/**@typedef {import('../../entities/Domain').Domain} Domain*/
/**@typedef {import('../../api.js').API} API*/

const ws = new ReconnectingWS()
/**@type {import('../../remote/types').RemoteRoot<API>}*/ let api
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
	const controller = new Controller(new BrowserWSShim(await ws.connect('ws://localhost:1337')))
	api = controller.remote
	api.fileChangeEvent((/**@type {string}*/ e) => {
		let file = e.slice(e.lastIndexOf('\\') + 1, e.lastIndexOf('.'))
		if(componentRegistry.get(file)) {
			setTimeout(() => componentRegistry.get(file)?.forEach(comp => comp.patch()), 10)
		}
	})
	let x = await api.me('test')
}

start()
export { state,  api}
