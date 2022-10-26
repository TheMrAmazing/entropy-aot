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
export function isPrimitive(o) {
    const type = typeof o;
    return (
        type === "undefined" ||
        o === null ||
        type === "boolean" ||
        type === "number" ||
        type === "string" ||
        o instanceof Date ||
        o instanceof RegExp ||
        o instanceof Blob ||
        o instanceof File ||
        o instanceof FileList ||
        o instanceof ArrayBuffer ||
        o instanceof ImageData ||
        o instanceof ImageBitmap ||
        o instanceof Array ||
        o instanceof Map ||
        o instanceof Set
    )
}

export function shouldBeCloneable(o) {
	return (
        o?.constructor === ({}).constructor ||
		isPrimitive(o)
	)
}

function isCloneable(obj) {
    try {
        postMessage(obj, "*");
    } catch (error) {
        if (error?.code === 25) return false; // DATA_CLONE_ERR
    }
    return true;
}
