/**@typedef {import('../../types').PathType} PathType */
/**@typedef {import('../../types').Command} Command*/

export class Scope {
	/**@type {PathType}*/ path = []
	/**@type {Command['type']}*/ type
}