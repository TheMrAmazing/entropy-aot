import { WSController } from '../../remote/shims/BrowserController.js'
let ws = new WSController()
/**@type {import('../../api').API}*/ let api
let state = {
	sess: undefined,
	user: undefined,
	domain: undefined
}
async function start() {
	await ws.connect('ws://localhost:1337')
	api = ws.controller.Remote
	api.fileChangeEvent((e) => {
		console.log(e)
	})
}
start()
export { state, api }
