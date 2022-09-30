import {patch} from './patch'

export abstract class Component {
    sel
    data
    children
    elm
    text
    key
    initialRender = true
    slots

    abstract render(slots?)

    h(slots?) {
        this.slots = slots
        const me = this.render(slots)
        if(this.initialRender) {
            this.children = me.children
            this.sel = me.sel
            this.data = me.data
            this.text = me.text
            this.elm = me.elm
            this.key = me.key
            this.initialRender = false
            return this
        } else {
            return me
        }
    }
    patch() {
        let newRender = this.render(this.slots)
        let me = patch(this, newRender)
        this.children = me.children
        this.sel = me.sel
        this.data = me.data
        this.text = me.text
        this.elm = me.elm
        this.key = me.key
    }
}