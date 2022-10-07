import ts from 'typescript'
import * as crypto from 'crypto'
import {db} from './Database'
import { readFileSync, writeFile } from 'fs'
import { createServer as createHttpServer, Server as HttpServer } from 'http'

function test() {
    function inner() {
        let db = () => {console.log(db)}
        db()
    }
    const arrrow1 = () => {
        let db = {} as any
        db.test = {}
    }
    const arrrow2 = (db) => {
        db.test = {}
    }
    const arrrow3 = () => {
        db.log()
    }
    let test2 = {} as any
    test2.db.test4(db)
    function test3 (db: any, moo: string) {
        db = {}
    }
    class Tester {
        db: string
        constructor(db: string) {
            this.db = db
        }
    }
    test3(db, 'foo')
    crypto.randomUUID()
    ts.NewLineKind
    readFileSync('placeholder')
    createHttpServer(() => {

    })
}
console.log(test.toString())
console.log(crypto.randomUUID())
console.log(ts.version)