import { Receiver } from 'lib/praxis/remote/Receiver'
import { WSReceiver } from 'lib/praxis/shims/WSReceiver'
import {db} from './src/Database'

const receiver = new Receiver(db, WSReceiver, 3000)