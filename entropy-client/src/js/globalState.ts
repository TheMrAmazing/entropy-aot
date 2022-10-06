import { WSController } from 'lib/praxis/shims/BrowserController'
import { API } from '../../../entropy-server/src/api'
import {User, Domain} from '../../../entropy-server/src/entities'

let ws = new WSController()
let api: API

let state = {
    user: undefined as User | undefined,
    domain: undefined as Domain | undefined
}

async function start() {
    await ws.connect('ws://localhost:1337')
    api = ws.controller.Remote
}
start()

export {state, api}