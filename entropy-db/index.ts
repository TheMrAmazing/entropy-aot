import { Receiver } from 'lib/praxis/remote/Receiver'
import { WSReceiver } from 'lib/praxis/shims/WSReceiver'
import {db} from './src/Database'
import {hotReload} from 'lib/praxis/dev/reload'

hotReload(__dirname)
hotReload('C:\\work\\entropy-aot\\lib')
const receiver = new Receiver(db, WSReceiver, 3000)
function test() {
    setInterval(() => {
        db.log()
    }, 5000)
}
console.log(test.toString())
