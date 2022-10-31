import * as path from 'node:path'
import * as crypto from 'crypto'
import { db } from '../database/Database'
import { readFileSync } from 'fs'
import { createServer as createHttpServer } from 'http'
function test() {
	function inner() {
		let db = () => { console.log(db) }
		db()
	}
	const arrrow1 = () => {
		let db = {}
		db.test = {}
	}
	const arrrow2 = (db) => {
		db.test = {}
	}
	const arrrow3 = () => {
		db.log()
	}
	let test2 = {}
	test2.db.test4(db)
	function test3(db, moo) {
		db = {}
	}
	class Tester {
		//attempt a class property
		db
		constructor(db) {
			this.db = db
		}
	}
	test3(db, 'foo')
	crypto.randomUUID()
	path.delimiter
	readFileSync('placeholder')
	createHttpServer(() => {
	})
}
console.log(test.toString())
console.log(crypto.randomUUID())
console.log(path.delimiter)
