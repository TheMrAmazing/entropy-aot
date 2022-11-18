import { Component } from './Component.js'
import Browse from '../views/Browse.js'
import Channel from '../views/Channel/Channel.js'
import Developer from '../views/Developer.js'
import Live from '../views/Channel/Live.js'
import Settings from '../views/Channel/Settings.js'
import Widgets from '../views/Channel/Widgets.js'

const Routes = [
	{
		path: '',
		component: () => { return new Browse() }
	},
	{
		path: 'developer',
		component: () => { return new Developer() },
		meta: {
			requiresAuth: true
		}
	},
	{
		path: 'channel',
		component: () => { return new Channel() },
		slot: () => new Live(),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: 'channel/settings',
		component: () => new Channel(),
		slot: () => new Settings()
	},
	{
		path: 'channel/widgets',
		component: () => new Channel(),
		slot: () => new Widgets()
	},
]

export class Router extends Component {
	/**@type {string}*/	baseURL
	routes
	/**@type {string}*/	lastURL = ''
	/**@type {string[]}*/ route
	component
	slot

	constructor(routes) {
		super()
		this.routes = routes
		this.loadInitialRoute()
		this.lastURL = ''
		window.onpopstate = e => {
			this.gotoPath()
			this.patch()
		}
	}

	loadRoute(/**@type {string[]}*/ ...urlSegments) {
		const url = `/${urlSegments.join('/')}`
		if (url != this.lastURL) {
			history.pushState({}, '', this.baseURL + url)
		}
		this.lastURL = url
		this.changeRoute(...urlSegments)
	}

	changeRoute(/**@type {string[]}*/ ...urlSegments) {
		const matchedRoute = this.matchUrlToRoute(urlSegments)
		if (typeof matchedRoute.component == 'function') {
			matchedRoute.component = matchedRoute.component()
		}
		if (typeof matchedRoute.slot == 'function') {
			matchedRoute.slot = matchedRoute.slot()
		}
		this.route = urlSegments
		this.component = matchedRoute.component
		this.slot = matchedRoute.slot
	}

	push(/**@type {string[]}*/ ...urlSegments) {
		this.loadRoute(...urlSegments)
		this.patch()
	}
	/**@param {string[]} urlSegments*/
	matchUrlToRoute(urlSegments) {
		const matchedRoute = this.routes.find(route => {
			const routePathSegments = route.path.split('/')
			if (routePathSegments.length !== urlSegments.length) {
				return false
			}
			return routePathSegments
				.every((routePathSegment, i) => routePathSegment === urlSegments[i])
		})
		return matchedRoute
	}
	gotoPath() {
		const pathnameSplit = window.location.pathname.split('/')
		const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''
		return this.changeRoute(...pathSegments)
	}
	loadInitialRoute() {
		this.baseURL = window.location.origin
		return this.gotoPath()
	}

	render() {
		return this.component.h({ router: this.slot })
	}
}
const router = new Router(Routes)
export { router }
