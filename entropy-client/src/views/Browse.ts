import { h } from 'lib/snabbdom'
import Header from '../components/Header'
import show from '../js/CanvasCycle/ShowScene'
import {get} from '../js/utils'
import { Component } from 'lib/Component'

const zeroPad = (num, places) => String(num).padStart(places, '0')
export default class Browse extends Component {
    show: boolean
    header: Header
    image: any
    
    constructor() {
        super()
        this.show = false
        this.header = new Header()
        requestAnimationFrame(async () => {
            let num = (Date.now() % 35) + 1
            let paddedNum = zeroPad(num, 3)
            let url = '/assets/image_'  + paddedNum + '.json'
            this.image = await get(url)
            this.show = true
            show(bmap, this.image)
        })
    }

    render() {
        this.show ? requestAnimationFrame(() => {
            show(bmap, this.image)
        }) : undefined
        return body([
                // div('.overlay.glow'),
                // div('.overlay.scanlines'),
                this.header.h(),
                main([
                    canvas('#bmap')
                ]),
                footer([h('terminal-input')])
            ])
    }
    
}