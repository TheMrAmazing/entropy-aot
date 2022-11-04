import { deepStrictEqual } from 'assert'

export function test(/**@type {string}*/ name,/**@type {() => void}*/ func) {
	process.send({
		type: 0, //test
		name,
		func: func.toString()
	})
}

export function partnerProcessForEach(/**@type {() => void}*/ func) {
	process.send({
		type: 1, //createProcessBeforeEach
		func: func.toString()
	})
}

export function beforeEach(/**@type {() => void}*/ func) {
	process.send({
		type: 2, //beforeEach
		func: func.toString()
	})
}

export function check(val1, val2) {
	try {
		deepStrictEqual(val1, val2)
		process.send({
			result: true, //success
	
		})
	} catch (e) {
		console.error(e)
		process.send({
			result: false// fail
		})
	}
}

export function done() {
	process.send({
		result: true, //success
	})
}
