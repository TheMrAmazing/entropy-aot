import { Receiver } from './remote/Receiver.js'
import { WSReceiver } from './remote/shims/WSReceiver.js'
// import { hotReload } from './dev/reload'
import {Database} from './database/Database.js'
import { hash } from './database/utils.js'
import { User } from './entities/User.js'

globalThis.functionSymbol = Symbol()

const receiver = new Receiver('../database/Database.js', WSReceiver, 3000)