import { Receiver } from './remote/Receiver.js'
import { WSReceiver } from './remote/shims/WSReceiver.js'

globalThis.functionSymbol = Symbol()
const receiver = new Receiver('../database/Database.js', WSReceiver, 3000)