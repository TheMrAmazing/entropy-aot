import {EntropyEntity} from './Entity.js'
import {Widget} from './Widget.js'
import {Domain} from './Domain.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
export class Channel extends EntropyEntity {
	/**@type {Object?}*/ activeLayout
	/**@type {Object[]?}*/ templateLayouts
	/**@type {Owns<Widget[]>}*/ widgets
	/**@type {Domain?}*/ domain
}
