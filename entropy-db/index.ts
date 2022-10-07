import { Receiver } from 'lib/praxis/remote/Receiver'
import { WSReceiver } from 'lib/praxis/shims/WSReceiver'
import {db} from './src/Database'
import {hotReload} from 'lib/praxis/dev/reload'
import './src/transformerTest'

hotReload(__dirname)
hotReload('C:\\work\\entropy-aot\\lib')
const receiver = new Receiver(db, WSReceiver, 3000)

setInterval(() => {
    db.log()
}, 5000)
