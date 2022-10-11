import { WSController } from 'lib/praxis/shims/BrowserController'
let ws = new WSController()
let api
let state = {
	sess: undefined,
	user: undefined,
	domain: undefined
}
async function start() {
	await ws.connect('ws://localhost:1337')
	api = ws.controller.Remote
}
start()
export { state, api }
