import { WSController } from '@lib/praxis/WSController'


async function start() {
    let ws = new WSController()
    const db = ws.controller.Remote
    //writing to the database is done by attaching any piece of data to the Remote object
    db.test = {data: 'I am a new piece of data in the database'}
    //retrieving from the database is done by simply awaiting any piece of data on the Remote
    let res = await db.test                                      
    console.log(res)
}

start()