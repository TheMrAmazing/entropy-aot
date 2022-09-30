import {Component} from '@lib/Component'

export default class Settings extends Component {
    constructor() {
        super()
    }

    render(slots) {
        return main([
                div('I am in Settings')
            ])
    }
    
}