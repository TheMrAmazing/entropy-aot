import {Component} from 'lib/Component'
import Header from '../components/Header'
import NewProjectDialog from '../components/NewProjectDialog'

export default class Developer extends Component {
    header: Header
    newProjectDialog: NewProjectDialog
    constructor() {
        super()
        this.header = new Header()
        this.newProjectDialog = new NewProjectDialog()
    }

    render() {
        return body([
                    this.header.h(),
                    main([
                        this.newProjectDialog.h()
                    ]),
                    footer([button({style: {marginRight: 'var(--w)'}, on: {click: async (e) => {
                        let val = await this.newProjectDialog.open(e)
                        console.log(val)
                        this.patch()                        
                    }}},'New')])
                ])
    }
    
}