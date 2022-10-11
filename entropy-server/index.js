import { User } from './src/entities/User'
import { fnArg } from 'lib/praxis/remote/Controller'
import { WSController } from 'lib/praxis/shims/WSController'
import { Receiver } from 'lib/praxis/remote/Receiver'
import { WSReceiver } from 'lib/praxis/shims/BrowserReceiver'
// import { hotReload } from 'lib/praxis/dev/reload'
import path from 'path'
import { fileURLToPath } from 'url'
import { hash } from 'lib/praxis/database/utils'
// hotReload(__dirname)
// hotReload('C:\\work\\entropy-aot\\lib')

const __filename = fileURLToPath(import.meta.url)

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename)

export let db
let ws = new WSController()
const receiver = new Receiver(path.resolve(__dirname, './src/api'), WSReceiver, 1337)
async function start() {
	await ws.connect('ws://localhost:3000/')
	db = ws.controller.Remote
	let email = 'david.bell@chthonicsoftware.com'
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
