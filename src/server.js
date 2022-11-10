import { User } from './entities/User.js'
import { Controller, fnArg } from './remote/Controller.js'
import { ReconnectingWS } from './remote/shims/ReconnectingWS.js'
import { Receiver } from './remote/Receiver.js'
import { hash } from './database/utils.js'
import { startFileServer } from './static/static.js'
import { WSShim } from './remote/shims/WSShim.js'
import { BrowserWSShim } from './remote/shims/BrowserWSShim.js'
import { WebSocketServer } from 'ws'
import {WebSocket} from 'ws'
/**@typedef {import('./database/Database').Database} Database*/
const port = 1337
const wss = new WebSocketServer({ port })
wss.on('connection', ws => {
	//@ts-ignore
	new Receiver('../api.js', new BrowserWSShim(ws))
})
console.log('Listening on port: ' + port)

let ws = new ReconnectingWS(WebSocket)
export const connection = {db: undefined}

async function start() {
	let controller = new Controller(new WSShim(await ws.connect('ws://localhost:3000/')))
	/**@type {import('./remote/types').RemoteRoot<Database>}*/ const db = controller.remote
	connection.db = db
	let email = 'david.bell@chthonicsoftware.com'
	//@ts-ignore
	let user = await db.users.find(fnArg({ email }, val => val.email == email))
	if (user) {
		console.log('admin already created')
	}
	else {
		let admin = new User()
		admin.email = 'david.bell@chthonicsoftware.com'
		admin.password = hash('test')
		admin.image = 'https://i.redd.it/v0caqchbtn741.jpg'
		admin.name = 'test'
		admin.globalRoles = []
		admin.verified = true
		db.users.push(admin)
	}
}

start()
startFileServer()
