import {Controller} from '../Controller.js'
import {WSController} from '../shims/WSController.js'
import {Receiver} from '../Receiver.js'
import {WSReceiver} from '../shims/WSReceiver.js'
import {test, check, partnerProcessForEach, beforeEach} from '../../testing/helpers.js'

partnerProcessForEach(() => {
	const receiver = new Receiver('./test/testdb.js', WSReceiver, parseInt(process.env.port))
})

beforeEach(async () => {
	let ws = new WSController()
	globalThis.db = () => {
		return ws.controller.remote
	}
	await ws.connect(`ws://localhost:${process.env.port}/`)
		// @ts-ignore
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
		globalThis.db().users.push(admin)
})

// test('get string', async() => {
// 	check(await globalThis.db().users[0].email, 'test1')
// })

// test('get number', async() => {
// 	check(await globalThis.db().users[0].myNum, 23)
// })

// test('get boolean', async() => {
// 	check(await globalThis.db().users[0].verified, true)
// })

test('get object', async() => {
	// console.log(await globalThis.db().users[0].roles[0])
	check(await globalThis.db().users[0].roles[0], {
		name: 'role1',
		innerNum: 25,
		lastname: 'lastRole',
		innerArray: {$ref: '#users/0/roles/0/innerArray'},
		innerObject: {$ref: '#users/0/roles/0/innerObject'},
		innerBool: false
	 })
})

// test('get undefined', async() => {
// 	check(await globalThis.db().users[0].roles[2].innerUndefinedProp, undefined)
// })

// test('get array of strings', async() => {
// 	check(await globalThis.db().users[0].roles[1].innerStringArray, ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman'])
// })

// test('get array of numbers', async() => {
// 	check(await globalThis.db().users[0].roles[0].innerArray, [1, 2, 3, 4])
// })

// test('get array of booleans', async() => {
// 	check(await globalThis.db().users[0].roles[2].innerBoolArray, [true, false, true, true, false, true, false, false, false, false])
// })

// test('get array of objects', async() => {
// 	check(await globalThis.db().users[0].roles, [
// 		{$ref: '#users/0/roles/0'},
// 		{$ref: '#users/0/roles/1'},
// 		{$ref: '#users/0/roles/2'},
// 	])
// })

// test('get array of undefined', async() => {
// 	check(await globalThis.db().users[0].roles[2].innerUndefinedArray, [undefined, undefined, undefined, undefined, undefined])
// })

test('set string', async() => {
	globalThis.db().users[0].email = 'I am a new email'
	console.log(await globalThis.db().users[0].email)
	check(await globalThis.db().users[0].email, 'I am a new email')
})

test('set number', async() => {
	globalThis.db().users[0].myNum = 9001
	console.log(await globalThis.db().users[0].myNum)
	check(await globalThis.db().users[0].myNum, 9001)
})

test('set boolean', async() => {
	globalThis.db().users[0].verified = false
	check(await globalThis.db().users[0].verified, false)
})

test('set object', async() => {
	globalThis.db().users[0].roles[1] = {
		foo: 'bar',
		baz: 42,
		loopy: {don: 't see me'}
	}
	check(await globalThis.db().users[0].roles[1], {
		foo: 'bar',
		baz: 42,
		loopy: {$ref: '#users/0/roles/0/loopy'}
	})
})

test('set undefined', async() => {
	globalThis.db().users[0].password = undefined
	check(await globalThis.db().users[0].password, undefined)
})