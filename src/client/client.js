import '../lib/snabbdom/hyperscript-helpers.js'
import { patch } from '../lib/snabbdom/patch.js'
import './wc/TextInput.js'
import './wc/Terminal.js'
import { createAsciiBorderStyleSheet } from './js/border.js'
import { theme, borders } from './js/theme.js'
import { router } from './components/Router.js'
import { state } from './js/globalState.js'
import { get } from './js/utils.js'
import { Component } from './components/Component.js'

globalThis.Component = Component

requestAnimationFrame(() => {
	createAsciiBorderStyleSheet({
		width: theme.font.w,
		height: theme.font.h,
		family: 'Borders',
		borders: borders
	}).then(styleEl => {
		document.head.appendChild(styleEl)
	})
})
let user = await get('/api/users/me')
if (user && user.status == undefined) {
	state.user = user
	state.domain = user.domain
}
const container = document.body
const vnode = router.h()
patch(container, vnode)
