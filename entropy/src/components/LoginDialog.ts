import {Component} from '@lib/Component'
import RegisterDialog from './RegisterDialog'
import state from '../js/globalState'
import { post } from '../js/utils'
import {h} from '@lib/snabbdom'

export default class LoginDialog extends Component {
    registerDialog: RegisterDialog
    
    constructor() {
        super()
        this.registerDialog = new RegisterDialog()
    }
    async submit(e) {
        e.preventDefault()
        let vals = Object.entries(e.target)
            // .filter(tar => tar[1].constructor.name == 'HTMLInputElement')
            // .map(tar => tar[1].value)
        state.user = await post('/api/login', { email: vals[0], password: vals[1]})
        state.domain = state.user.domain
        loginDialog.close()
    }

    async open(e) {
        loginDialog.showModal()
        return new Promise((resolve, reject) => {
            loginDialog.addEventListener('close', ()=> {
                resolve(loginDialog.returnValue)
            })
        })
    }

    render() {
        return dialog('#loginDialog',[
            form({attrs: {method: 'dialog'}, on: {submit: e=> this.submit(e)}}, [
                h1('Login'),
                label('username'), input({attrs: {value: 'david.bell@chthonicsoftware.com'}}),
                label('password'), input({attrs: {value: 'test'}}),
                h('text-input'),
                div([
                    button({attrs:{type: 'submit'}}, 'submit'),
                    button({on:{click: this.registerDialog.open}}, 'register'),
                ])
            ]),
            this.registerDialog.h()
        ])
    }
    
}