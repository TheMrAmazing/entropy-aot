import { attributesModule, classModule } from './snabbdom'
import { propsModule } from './snabbdom'
import { styleModule } from './snabbdom'
import { eventListenersModule } from './snabbdom'
import { init } from './snabbdom'
export const patch = init([
	attributesModule,
	classModule,
	propsModule,
	styleModule,
	eventListenersModule, // attaches event listeners
])
