import { Component } from '@lib/Component'

export default class RegisterDialog extends Component {
    constructor() {
        super()
    }
    submit(e) {
        e.preventDefault()
        // console.log(Object.entries(e.target)
        //     .filter(tar => tar[1].constructor.name == 'HTMLInputElement')
        //     .map(tar => tar[1].value))
        registerDialog.close()
    }

    open(e) {
        registerDialog.showModal()
    }

    render() {
        return dialog('#registerDialog',[
                    h1('Register'),
                    form('#registerForm', {on: {submit: this.submit}}, [
                        label('email'), input(),
                        label('display name'), input(),
                        label('profile picture'), input(),
                        label('password'), input(),
                        button({attrs:{formaction: true}}, 'submit')
                    ])
                ])
    }
    
}