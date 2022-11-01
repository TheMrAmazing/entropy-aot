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
	// let email = 'david.bell@chthonicsoftware.com'
	// let user = await db().users.find(fnArg({ email }, val => val.email == email))
	// if (user) {
	// 	console.log('admin already created')
	// }
	// else {
		let admin = {
			email: 'test1',
			myNum: 23,
			password: 'test2',
			roles: [{
				name: 'role1',
				innerNum: 25,
				lastname: 'lastRole',
				innerArray: [1, 2, 3, 4],
				innerObject: {
					prop1: 'inside prop1',
					prop2: 'inside prop2'
				},
				innerBool: false
			 }, {
				name: 'role2',
				innerStringArray: ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman']
			}, {
				name: 'role3',
				innerBoolArray: [true, false, true, true, false, true, false, false, false, false],
				innerUndefinedArray: [undefined, undefined, undefined, undefined, undefined],
				innerUndefinedProp: undefined
			}],
			verified: true
		}
		//@ts-ignore
		db().users.push(admin)
		//@ts-ignore
		db().users[0].email = 'I am a new email'
		//@ts-ignore
		console.log(await db().users[0].email)
}

start()
startFileServer()
