import { Component } from 'lib/Component'
import { state } from '../js/globalState'
import { post } from '../js/utils'

export default class DomainDialog extends Component {
    constructor() {
        super()
    }
    async submit(e) {
        e.preventDefault()
        // let vals = Object.entries(e.target)
        //     .filter(tar => tar[1].constructor.name == 'HTMLInputElement')
        //     .map(tar => tar[1].value)
        // state.domain = await post('/api/domain', { handle: vals[0]})
        state.user.domain = state.domain
        domainDialog.close()        
    }

    open() {
        domainDialog.showModal()
    }

    render() {
        return dialog('#domainDialog',[
                    h1('Set Handle'),
                    form('#handlForm', {on: {submit: this.submit}}, [
                        label('handle'), input(),
                        button({attrs:{formaction: true}}, 'submit')
                    ])
                ])
    }
    
}