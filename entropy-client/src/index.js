import 'lib/hyperscript-helpers'
import { patch } from 'lib/patch'
import './wc/TextInput'
import './wc/Terminal'
import { createAsciiBorderStyleSheet } from './js/border'
import { theme, borders } from './js/theme'
import { router } from './Router'
import { state } from './js/globalState'
import { get } from './js/utils'
import { Component } from 'lib/Component'

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
