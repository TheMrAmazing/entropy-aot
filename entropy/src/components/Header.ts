import { Component } from '@lib/Component'
import LoginDialog from './LoginDialog'
import state from '../js/globalState'
import DomainDialog from './DomainDialog'
import { post, get } from '../js/utils'
import {router} from '../Router'

export default class Header extends Component {
    loginDialog: LoginDialog
    domainDialog: DomainDialog
    hidden: boolean
    left: string
    top: string
    constructor() {
        super()
        this.loginDialog = new LoginDialog()
        this.domainDialog = new DomainDialog()
        this.hidden = true
        this.left = ''
        this.top = ''
        document.addEventListener('click', (e) => {
            if(avatarMenu) {
                if(!this.hidden) {
                    this.hidden = true
                    this.patch()
                }
            }
        })
    }

    async createDeveloper(e) {
        state.domain.developer = await post(`/api/${state.user.domain.handle}/developer`)
        this.patch()
    }

    // admin() {
    //     if (state.user.roles) {
    //         let roles = state.user.roles
    //         let adminRole = roles.filter((role) => role.name == 'Admin')
    //         if (adminRole) {
    //             this.$router.push('/admin')
    //         }
    //     }
    // }
    async logout() {
        await post('/api/logout')
        state.user = undefined
        state.domain = undefined
        this.patch()
    }
    async createChannel(e) {
        state.domain.channel = await post(`/api/${state.user.domain.handle}/channel`)
        this.patch()
    }

    render() {
        return header('.ascii-border-solid',[
                    div('.logo', [
                        span({style: {backgroundColor: '#1d5862', color: '#90adb2'}}, '«'),
                        span({style: {backgroundColor: '#5e9262', color: '#b1c9b3'}}, '»')
                    ]),
                    pre(`
█▀▀ █  █ ▀█▀ █▀▀▄ ▄▀▀▄ █▀▀▄ █   █
█▀▀ █▀▄█  █  █▄▄▀ █  █ █▄▄▀  ▀▄▀ 
█▄▄ █  █  █  █ ▀▄ ▀▄▄▀ █      █  `),
                    
                    state.user ? 
                    div([
                        img({attrs: {src: state.user.image}, on: {click: (e) => {
                            e.stopPropagation()
                            if(this.hidden) {
                                let boundingRect = avatarMenu.getBoundingClientRect()
                                let endingRight = e.clientX + boundingRect.width
                                let endingBottom = e.clientY + boundingRect.height
                                let overflowRight = endingRight - window.innerWidth
                                let overflowBottom = endingBottom - window.innerHeight
                                let nudgedClientX = overflowRight > 0 ? e.clientX - boundingRect.width : e.clientX
                                let nudgedClientY = overflowBottom > 0 ? e.clientY - boundingRect.height : e.clientY
                                this.left = `${8 * Math.floor(nudgedClientX / 8)}px`
                                this.top = `${16 * Math.floor(nudgedClientY / 16)}px`
                            }
                            this.hidden = !this.hidden
                            this.patch()
                        }}}),
                         menu('#avatarMenu', {class:{hidden: this.hidden}, style: {top: this.top, left: this.left}}, [
                            li({on: {click: e => router.push('')}}, 'Account Settings'),
                            state.domain?.channel ? li({on: {click: e => router.push('channel')}}, 'Channel Settings') :
                            li({on: {click: state.domain ? this.createChannel : this.domainDialog.open}}, 'Create Channel'),
                            state.domain?.developer ? li({on: {click: e => router.push('developer')}}, 'Developer Account') :
                            li({on: {click: state.domain ? this.createDeveloper : this.domainDialog.open}}, 'Create Developer Account'),
                            li({on: {click: e => this.logout()}}, 'Log Out'),
                            li('Admin')
                        ])
                    ]) : 
                    button({on: {click: async (e) => {
                        let val = await this.loginDialog.open(e)
                        console.log(val)
                        this.patch()                        
                    }}}, 'Login'),
                    this.loginDialog.h(),
                    this.domainDialog.h()
                ])
    }
    
}