/**@typedef {import('../../entities/User').User} User*/
/**@typedef {import('../../entities/Domain').Domain} Domain*/
import { WSController } from '../../remote/shims/BrowserController.js'
let ws = new WSController()
/**@type {import('../../api').API}*/ let api
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
	api = ws.controller.Remote
	api.fileChangeEvent((/**@type {string}*/ e) => {
		let file = e.slice(e.lastIndexOf('\\') + 1, e.lastIndexOf('.'))
		if(componentRegistry.get(file)) {
			setTimeout(() => componentRegistry.get(file)?.patch(), 200)
		}
	})
}
start()
export { state, api }
