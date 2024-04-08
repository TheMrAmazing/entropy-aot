import { WebSocketServer } from 'ws'
import { Receiver } from './remote/Receiver.js'
import { WSShim } from './remote/shims/WSShim.js'
import { scopeBuilder } from './remote/secure/ScopeBuilder.js'
import { User } from './entities/User.js'

// let builder = scopeBuilder(/**@type {User}*/ ({}))
// console.log(builder.get.domain.channel())
// import './testing/transformerTest.js'

globalThis.functionSymbol = Symbol()

const port = 5000
const wss = new WebSocketServer({ port })
wss.on('connection', ws => {
	new Receiver(() => require('./database/Database.js').default, new WSShim(ws))
})
console.log('Listening on port: ' + port)

