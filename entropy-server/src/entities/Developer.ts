import { Channel} from './Channel'
import { EntropyEntity } from './Entity'
import { DevItem } from './DevItem'
import { Owns, Unique } from './builtin/types'
import { Domain } from './Domain'
import {StoreItem} from './StoreItem'
import * as crypto from 'crypto'
interface CreateDeveloperOptions {
    apiKey: string
    channel: Channel
}

export class Developer extends EntropyEntity {
    apiKey: Unique<string> = crypto.randomUUID()
    domain?: Domain
    devItems: Owns<DevItem[]>
    storeItems: StoreItem[]

    // static createAndSave(options: CreateDeveloperOptions): Promise<Developer> {
    //     let dev = new Developer()
    //     dev.apiKey = options.apiKey
    //     return dev.save()
    // }
}

