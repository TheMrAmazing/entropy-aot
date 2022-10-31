import {Controller} from '../Controller.js'
import {WSController} from '../shims/WSController.js'
import {Receiver} from '../Receiver.js'
import {WSReceiver} from '../shims/WSReceiver.js'

globalThis.functionSymbol = Symbol()

function test(/**@type {string}*/ name,/**@type {() => void}*/ func) {
	process.send({name, func: func.toString()})
}

test('Receiver', () => {
	const receiver = new Receiver('./test/testdb.js', WSReceiver, 3000)
})

test('Controller', () => {
	// @ts-ignore
	let ws = new WSController()
	function db() {
		return ws.controller.remote
	} 	
	async function start() {
		await ws.connect('ws://localhost:3000/')
		let admin = {
			email: 'test1',
			password: 'test2',
			roles: [{name: 'role1'}],
			verified: true
		}
		db().users.push(admin)
		console.log(await db().users)
	}
	start()
})