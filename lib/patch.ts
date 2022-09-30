import { attributesModule, classModule } from './snabbdom'
import { propsModule } from './snabbdom'
import { styleModule } from './snabbdom'
import { eventListenersModule } from './snabbdom'
import { init } from './snabbdom'
export const patch = init([
	attributesModule,
	classModule, // makes it easy to toggle classes
	propsModule, // for setting properties on DOM elements
	styleModule, // handles styling on elements with support for animations
	eventListenersModule, // attaches event listeners
])