import {Controller, fnArg} from '../Controller.js'
import {WSController} from '../shims/WSController.js'
import {Receiver} from '../Receiver.js'
import {WSReceiver} from '../shims/WSReceiver.js'
import {test, check, partnerProcessForEach, beforeEach} from '../../testing/helpers.js'

partnerProcessForEach(() => {
	const receiver = new Receiver('./test/testobj.js', WSReceiver, parseInt(process.env.port))
})

beforeEach(async () => {
	let ws = new WSController()
	globalThis.db = () => {
		return ws.controller.remote
	}
	await ws.connect(`ws://localhost:${process.env.port}/`)
})

// ==========================================================
// should remote args be allowed to be nested?
// ==========================================================

test('get string', async() => {
	check(await globalThis.db().users[0].email, 'test1')
})

test('get number', async() => {
	check(await globalThis.db().users[0].myNum, 23)
})

test('get boolean', async() => {
	check(await globalThis.db().users[0].verified, true)
})

test('get object', async() => {
	check(await globalThis.db().users[0].roles[0], {
		name: 'role1',
		innerNum: 25,
		lastname: 'lastRole',
		innerArray: [1, 2, 3, 4],
		innerObject: {
			prop1: 'inside prop1',
			prop2: 'inside prop2'
		},
		innerBool: false
	 })
})

test('get undefined', async () => {
	check(await globalThis.db().users[0].roles[2].innerUndefinedProp, undefined)
})

test('get cyclical', async () => {
	let val = {
		foo: 'bar',
		baz: 42,
		loopy: {
			don: 't see me',
			bon: {
				boo: 'another one'
			}
		}
	}
	val.loopy.bon.fez = val.loopy
	check(await globalThis.db().users[0].roles[3], val)
})

test('get array of strings', async() => {
	check(await globalThis.db().users[0].roles[1].innerStringArray, ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman'])
})

test('get array of numbers', async() => {
	check(await globalThis.db().users[0].roles[0].innerArray, [1, 2, 3, 4])
})

test('get array of booleans', async() => {
	check(await globalThis.db().users[0].roles[2].innerBoolArray, [true, false, true, true, false, true, false, false, false, false])
})

test('get array of objects', async() => {
	let val = {
		foo: 'bar',
		baz: 42,
		loopy: {
			don: 't see me',
			bon: {
				boo: 'another one'
			}
		}
	}
	val.loopy.bon.fez = val.loopy
	check(await globalThis.db().users[0].roles, [{
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
	}, val],)
})

test('get array of undefined', async() => {
	check(await globalThis.db().users[0].roles[2].innerUndefinedArray, [undefined, undefined, undefined, undefined, undefined])
})

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
	// console.log(await globalThis.db().users[0].roles[1])
	check(await globalThis.db().users[0].roles[1], {
		foo: 'bar',
		baz: 42,
		loopy: {don: 't see me'}
	})
})

test('set undefined', async() => {
	globalThis.db().users[0].password = undefined
	check(await globalThis.db().users[0].password, undefined)
})

test('set cyclical', async() => {
	let val = {
		foo: 'bar',
		baz: 42,
		loopy: {
			don: 't see me',
			bon: {
				boo: 'another one'
			}
		}
	}
	val.loopy.bon.fez = val.loopy
	globalThis.db().users[0].roles[1] = val
	let y = await globalThis.db().users[0].roles[1]
	let x = await globalThis.db().users[0].roles[1]
	check(x, val)
})

test('set remote', async() => {
	globalThis.db().users[0].roles[0].innerObject = globalThis.db().users[0].roles[1]
	let x = await globalThis.db().users[0].roles[0].innerObject.innerStringArray
	check(x, ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman'])
})

test('apply', async() => {
	let x = await globalThis.db().testFunc()
	check(x, {prop: 'I am a new object property'})
})

test('apply string arg', async() => {
	let x = await globalThis.db().stringArg('I am a string')
	check(x, true)
})

test('apply number arg', async() => {
	let x = await globalThis.db().numberArg(42)
	check(x, true)
})

test('apply boolean arg', async() => {
	let x = await globalThis.db().booleanArg(true)
	check(x, true)
})

test('apply object arg', async() => {
	let x = await globalThis.db().objectArg({
		groo: 'test string',
		gru: 9001,
		grough: {
			bathist: 'brackets'
		},
		greu: [{boo: 'test'}, {boo1: 'test1'}, {boo2: 'test2'}]
	})
	check(x,{
		groo: 'test string',
		gru: ['str1', 'str2', 'str3'],
		grough: {
			bathist: 'brackets'
		},
		greu: [{boo: 'test'}, {boo1: 'test1'}, {boo2: 'test2'}]
	})
})

test('apply undefined arg', async() => {
	let x = await globalThis.db().undefinedArg(undefined)
	check(x, true)
})

test('apply remote arg', async() => {
	let x = await globalThis.db().remoteArg(globalThis.db().users[0].roles[1])
	check(x, ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman'])
})

test('apply array arg', async() => {
	let x = await globalThis.db().arrayArg([{
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
	}])
	check(x, true)
})

test('apply function arg', async() => {
	let name = 'role3'
	let x = await globalThis.db().users[0].roles.find(fnArg({name}, role => {
		return (role.name == name)
	} ))
	check(x, {
		name: 'role3',
		innerBoolArray: [true, false, true, true, false, true, false, false, false, false],
		innerUndefinedArray: [undefined, undefined, undefined, undefined, undefined],
		innerUndefinedProp: undefined
	})
})

test('apply cyclical arg', async() => {
	let val = {
		foo: 'bar',
		baz: 42,
		loopy: {
			don: 't see me',
			bon: {
				boo: 'another one'
			}
		}
	}
	val.loopy.bon.fez = val.loopy
	let x = await globalThis.db().cyclicalArg(val)
	check(x, 't see me')
})

test('callback', async() => {
	globalThis.db().callback((/**@type {string}*/ arg) => {
		check(arg, 'I am some text')
	})
})

test('callback object', async() => {
	globalThis.db().callbackObj((arg) => {
		check(arg, {
			foo: 'bar',
			baz: 42,
			loopy: {
				don: 't see me',
				bon: {
					boo: 'another one'
				}
			}
		})
	})
})