import { User } from './entities/User.js'
import { fnArg } from './remote/Controller.js'
import { WSController } from './remote/shims/WSController.js'
import { Receiver } from './remote/Receiver.js'
import { WSReceiver } from './remote//shims/BrowserReceiver.js'
import { hotReload } from './dev/reload'
import { hash } from './database/utils.js'
import { startFileServer } from './static/static.js'
import { Database } from './database/Database.js'

export let ws = new WSController()
/**@returns {import('./remote/types').RemoteRoot<Database>}*/

const receiver = new Receiver('../api.js', WSReceiver, 1337)
async function start() {
	await ws.connect('ws://localhost:3000/')
	const db = ws.controller.remote
	await db.users[0].roles[1].innerStringArray
	console.log(await db.users[0].roles[1].innerStringArray)
	console.log('after')
	// let email = 'david.bell@chthonicsoftware.com'
	//@ts-ignore
	// let x = new ws.controller.remote()
	// let user = await db().users.find(fnArg({ email }, val => val.email == email))
	// if (user) {
	// 	console.log('admin already created')
	// }
	// else {
	// 	let admin = new User()
	// 	admin.email = 'david.bell@chthonicsoftware.com'
	// 	admin.password = hash('test')
	// 	admin.image = 'https://i.redd.it/v0caqchbtn741.jpg'
	// 	admin.name = 'test'
	// 	admin.globalRoles = []
	// 	admin.verified = true
	// 	db().users.push(admin)
	// }
}

start()
startFileServer()
