import { attributesModule } from './package/modules/attributes.js'
import { classModule } from './package/modules/class.js'
import { propsModule } from './package/modules/props.js'
import { styleModule } from './package/modules/style.js'
import { eventListenersModule } from './package/modules/eventlisteners.js'
import { init } from './package/init.js'
export const patch = init([
	attributesModule,
	classModule,
	propsModule,
	styleModule,
	eventListenersModule, // attaches event listeners
])
