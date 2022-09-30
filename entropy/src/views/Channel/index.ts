import {Component} from '@lib/Component'
import Header from '../../components/Header'
import { router } from '../../Router'

export default class Channel extends Component {
    header: Header
    constructor() {
        super()
        this.header = new Header()
    }

    render(slots) {
        let selected = router.route[1]
        return body([
                // div('.overlay.glow'),
                // div('.overlay.scanlines'),
                this.header.h(),
                aside('.ascii-border-solid',[
                    nav([
                        li({class: {selected: (selected == undefined)}, on: {click: e => router.push('channel')}}, '«» Live'),
                        li({class: {selected: (selected == 'settings')}, on: {click: e => router.push('channel', 'settings')}}, ' * Settings'),
                        li({class: {selected: (selected == 'widgets')}, on: {click: e => router.push('channel', 'widgets')}}, '[] Widgets'),
                        li({class: {selected: (selected == 'revenue')}, on: {click: e => router.push('')}}, '$$ Revenue'),
                        li({class: {selected: (selected == 'account')}, on: {click: e => router.push('')}}, ' º Account'),
                    ])
                ]),
                slots.router.h()
            ])
    }
    
}