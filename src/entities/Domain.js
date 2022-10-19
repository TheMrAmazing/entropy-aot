class Domain {
	handle
	roles
	constructor() {
		return new Proxy(this, {
			set: (object, key, value, proxy) => {
				object[key] = value;
				console.log('PROXY SET')
				return true
			}
		})
	}
}