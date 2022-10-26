import {EntropyEntity} from './Entity.js'
import {Developer} from './Developer.js'
import { StoreItem } from './StoreItem.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
const ItemStatus = {
	Pending: 'pending',
	Published: 'published',
	Approved: 'approved'
}
export class DevItem extends EntropyEntity {
	/**@type {Unique<string>?}*/ location
	/**@type {string}*/ name
	/**@type {string}*/ status = ItemStatus.Pending
	/**@type {Developer}*/ developer
	/**@type {string}*/ developerId
	/**@type {Owns<StoreItem>?}*/ storeItem
	/**@type {string?}*/ storeItemId
	/**@type {Object?}*/ config
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
