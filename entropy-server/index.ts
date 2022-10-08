import { User } from './src/entities/User'
import { fnArg } from 'lib/praxis/remote/Controller'
import { WSController } from 'lib/praxis/shims/WSController'
import { Database } from '../entropy-db/src/Database'
import { Receiver } from 'lib/praxis/remote/Receiver'
import { WSReceiver } from 'lib/praxis/shims/BrowserReceiver'
import { hotReload } from 'lib/praxis/dev/reload'
import path from 'path'

hotReload(__dirname)

export let db: Database
let ws = new WSController()

const receiver = new Receiver(path.resolve(__dirname, './src/api'), WSReceiver, 1337)

async function start() {
    await ws.connect('ws://localhost:3000/')
    db = ws.controller.Remote
    let email = 'david.bell@chthonicsoftware.com'
    if(await db.users.find(fnArg({email}, val => val.email == email))) {
        console.log('admin already created')
    } else {
        let admin = new User()
        admin.email = 'david.bell@chthonicsoftware.com'
        admin.password ='test'
        admin.image = 'https://i.redd.it/v0caqchbtn741.jpg'
        admin.name = 'test'
        admin.globalRoles = []
        admin.verified = true
        db.users.push(admin)
    }
}
start()
