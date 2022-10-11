import { EntropyEntity } from './Entity'
import { Developer } from './Developer'
import { DevItem } from './DevItem'
import { Widget } from './Widget'

export class StoreItem extends EntropyEntity {
    location?: string
    name: string
    description: string
    config?: Object
    developer: Developer
    developerId: string
    devItem: DevItem
    widgets: Widget[]

    constructor() {
        super()
    }
}