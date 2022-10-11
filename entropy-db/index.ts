import { Receiver } from 'lib/praxis/remote/Receiver'
import { WSReceiver } from 'lib/praxis/shims/WSReceiver'
import {hotReload} from 'lib/praxis/dev/reload'
import path from 'path'
import './src/transformerTest'

hotReload(__dirname)
hotReload('C:\\work\\entropy-aot\\lib')
const receiver = new Receiver(path.resolve(__dirname,'./src/Database'), WSReceiver, 3000)

// setInterval(() => {
//     db.log()
// }, 5000)
