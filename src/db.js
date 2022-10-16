// import './test/transformerTest'
import { Receiver } from './remote/Receiver.js'
import { WSReceiver } from './remote/shims/WSReceiver.js'
import { hotReload } from './dev/reload'

hotReload(__dirname)
const receiver = new Receiver('../database/Database.js', WSReceiver, 3000)