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
hotReload(__dirname)
export let ws = new WSController()
/**@returns {import('./remote/types').RemoteRoot<Database>}*/
export function db() {
	return ws.controller.remote
} 
const receiver = new Receiver('../api.js', WSReceiver, 1337)
async function start() {
	await ws.connect('ws://localhost:3000/')
	let email = 'david.bell@chthonicsoftware.com'
	// let user = await db().users.find(fnArg({ email }, val => val.email == email))
	// if (user) {
	// 	console.log('admin already created')
	// }
	// else {
		let admin = new User()
		admin.email = 'test2'
		admin.password = hash('test')
		admin.image = 'https://i.redd.it/v0caqchbtn741.jpg'
		admin.name = 'boo'
		admin.globalRoles = []
		admin.verified = true
		db().users.push(admin)
		// let x = api.login('david.bell@chthonicsoftware.com', 'test')
		db().users[0] = db().users[2]
		console.log(await db().users[0])
		// }
}
start()
startFileServer()
