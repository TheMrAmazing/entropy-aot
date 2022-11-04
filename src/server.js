import { User } from './entities/User.js'
import { fnArg } from './remote/Controller.js'
import { WSController } from './remote/shims/WSController.js'
import { Receiver } from './remote/Receiver.js'
import { WSReceiver } from './remote//shims/BrowserReceiver.js'
import { hotReload } from './dev/reload'
import { hash } from './database/utils.js'
import { startFileServer } from './static/static.js'
import { Database } from './database/Database.js'
import api from './api.js'

export let ws = new WSController()
/**@returns {import('./remote/types').RemoteRoot<Database>}*/
export function db() {
	return ws.controller.remote
} 
const receiver = new Receiver('../api.js', WSReceiver, 1337)
async function start() {
	await ws.connect('ws://localhost:3000/')
	if ()
}

start()
startFileServer()
