import {Component} from 'lib/Component'

export default class Widgets extends Component {
    constructor() {
        super()
    }

    render(slots) {
        return main([
                div('I am in Widgets')
            ])
    }
    
}