export class RemoteObject {
	_objectId
	constructor(objectId) {
		this._objectId = objectId
	}
}
export class RemoteProperty extends RemoteObject {
	_path
	constructor(objectId, path) {
		super(objectId)
		this._path = path
	}
}
export function CanStructuredClone(o) {
	const type = typeof o
	return type === 'undefined' || o === null || type === 'boolean' || type === 'number' || type === 'string' || (o instanceof ArrayBuffer)
}
