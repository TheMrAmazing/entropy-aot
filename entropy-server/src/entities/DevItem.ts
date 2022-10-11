import { Owns, Unique } from './builtin/types'
import { Developer } from './Developer'
import { EntropyEntity } from './Entity'
import { StoreItem } from './StoreItem'

enum ItemStatus {
    Pending = 'pending',
    Published = 'published',
    Approved = 'approved'
}

export class DevItem extends EntropyEntity {
    location?: Unique<string>
    name: string
    status: ItemStatus = ItemStatus.Pending
    developer: Developer
    developerId: string
    storeItem?: Owns<StoreItem>
    storeItemId?: string
    config?: Object

    constructor() {
        super()
    }
    // async setlocation(file: string) {
    //     try{
    //         let filePath = '/temp.zip'
    //         let directoryName = this.id
    //         let destination = join(process.cwd(), 'uploads', directoryName)
    //         await rmForceRecursiveAsync(destination)
    //         mkdirSync(destination)
    //         writeFileSync(destination+filePath,Buffer.from(file, 'base64'))
    //         await extractZip(destination+filePath, {
    //             dir: destination,
    //         })
    //         let entropyConfigPath = join(destination, 'entropy.json')
    //         let entropyConfig = await loadConfig(entropyConfigPath)
    //         this.config = entropyConfig
    //         return `${directoryName}/index.html`
    //     } catch (e) {
    //         throw Error('File upload failed ')
    //     }
    // }
}

// async function loadConfig(path: string): Promise<any> {
//     if(path.endsWith('.json')) {
//         let config = (await import(path)).default
//         if(typeof config === 'object') {
//             if(config.hasOwnProperty('extends')) {
//                 if(typeof config.extends === 'string') {
//                     let directory = dirname(path)
//                     let extendsPath = join(directory, config.extends)
//                     let ext = await loadConfig(extendsPath)
//                     config = Object.assign(ext, config)
//                 } else {
//                     throw new EntropyError(400, {
//                         code: 'BAD_REQUEST',
//                         message: '"extends" property must be a relative path string'
//                     })
//                 }
//             }
//             return config
//         } else {
//             throw new EntropyError(400, {
//                 code: 'BAD_REQUEST',
//                 message: 'config root must be an object'
//             })
//         }
//     } else {
//         throw new EntropyError(400, {
//             code: 'BAD_REQUEST',
//             message: 'config path must point to a JSON'
//         })
//     }
// }