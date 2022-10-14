import { EntropyEntity } from './Entity'
var ItemStatus;
(function (ItemStatus) {
	ItemStatus['Pending'] = 'pending'
	ItemStatus['Published'] = 'published'
	ItemStatus['Approved'] = 'approved'
})(ItemStatus || (ItemStatus = {}))
export class DevItem extends EntropyEntity {
	location
	name
	status = ItemStatus.Pending
	developer
	developerId
	storeItem
	storeItemId
	config
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
