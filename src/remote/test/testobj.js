class TestDB {
	users = []
	testFunc() {
		return {prop: 'I am a new object property'}
	}
	stringArg(/**@type {string}*/ arg) {
		if(typeof arg == 'string') {
			return true
		}
		return false
	}
	numberArg(/**@type {number}*/ arg) {
		if(typeof arg == 'number') {
			return true
		}
		return false
	}
	booleanArg(/**@type {boolean}*/ arg) {
		if(typeof arg == 'boolean') {
			return true
		}
		return false
	}
	objectArg(arg) {
		arg.gru = ['str1', 'str2', 'str3']
		return arg
	}
	undefinedArg(arg) {
		if(typeof arg == 'undefined') {
			return true
		}
		return false
	}

	remoteArg(arg) {
		return arg.innerStringArray
	}

	arrayArg(arg) {
		if(arg[0].lastname == this.users[0].roles[0].lastname) {
			return true
		}
		return false
	}

	cyclicalArg(arg) {
		return arg.loopy.bon.fez.don
	}

	callback(cb) {
		setTimeout(() => {cb('I am some text')}, 1000)
	}

	callbackObj(cb) {
		setTimeout(() => {cb({
			foo: 'bar',
			baz: 42,
			loopy: {
				don: 't see me',
				bon: {
					boo: 'another one'
				}
			}
		})}, 1000)
	}
}

let db = new TestDB()

let admin = {
	email: 'test1',
	myNum: 23,
	password: 'test2',
	currentDate: new Date(),
	roles: [{
		name: 'role1',
		innerNum: 25,
		lastname: 'lastRole',
		innerArray: [1, 2, 3, 4],
		innerObject: {
			prop1: 'inside prop1',
			prop2: 'inside prop2'
		},
		innerBool: false
	 }, {
		name: 'role2',
		innerStringArray: ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman']
	}, {
		name: 'role3',
		innerBoolArray: [true, false, true, true, false, true, false, false, false, false],
		innerUndefinedArray: [undefined, undefined, undefined, undefined, undefined],
		innerUndefinedProp: undefined
	}],
	verified: true
}
let val = {
	foo: 'bar',
	baz: 42,
	loopy: {
		don: 't see me',
		bon: {
			boo: 'another one'
		}
	}
}
val.loopy.bon.fez = val.loopy
//@ts-ignore
admin.roles.push(val)

db.users = []
//@ts-ignore
db.users.push(admin)
export default db
