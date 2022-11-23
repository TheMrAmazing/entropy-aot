import { WebSocketServer } from 'ws'
import { Receiver } from './remote/Receiver.js'
import { WSShim } from './remote/shims/WSShim.js'
// import './testing/transformerTest.js'

globalThis.functionSymbol = Symbol()

const port = 3000
const wss = new WebSocketServer({ port })
wss.on('connection', ws => {
	new Receiver(() => require('./database/Database.js').default, new WSShim(ws))
})
console.log('Listening on port: ' + port)