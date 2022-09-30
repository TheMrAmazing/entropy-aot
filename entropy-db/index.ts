import { Receiver } from '@lib/praxis/Receiver'
import { WSReceiver } from '@lib/praxis/WSReceiver'
import {db} from './src/Database'

const receiver = new Receiver(db, WSReceiver, 3000)