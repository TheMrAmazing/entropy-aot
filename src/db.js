import { Receiver } from './remote/Receiver.js'
import { WSReceiver } from './remote/shims/WSReceiver.js'
// import { hotReload } from './dev/reload'
import {Database} from './database/Database.js'
import { hash } from './database/utils.js'
import { User } from './entities/User.js'

globalThis.functionSymbol = Symbol()
// hotReload(__dirname)
const receiver = new Receiver('../database/Database.js', WSReceiver, 3000)
// let db = new Database()
// let admin = new User()
// admin.email = 'david.bell@chthonicsoftware.com'
// admin.password = hash('test')
// admin.image = 'https://i.redd.it/v0caqchbtn741.jpg'
// admin.name = 'test'
// admin.globalRoles = []
// admin.verified = true
// db.users.push(admin)
// let email = 'david.bell@chthonicsoftware.com'
// let user = db.users.find(val => val.email == email)
// console.log(user.id)