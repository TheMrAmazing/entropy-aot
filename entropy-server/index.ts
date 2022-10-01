import { WSController } from '../lib/praxis/WSController'

let ws = new WSController()

async function start() {
    const db = ws.controller.Remote
    //writing to the database is done by attaching any piece of data to the Remote object
    // db.test = {data: 'I am a new piece of data in the database'}
    db.bellbell = {pugs: {gee: 'I am another string'}, thing: 'boo'}
    //retrieving from the database is done by simply awaiting any piece of data on the Remote
    let res = await db.bellbell
    let res2 = await res.pugs
    console.log(res)
    console.log(res2)
}

setTimeout(start, 5000)