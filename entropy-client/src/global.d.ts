export * from  'lib/hyperscript-helpers'
import {VNode} from 'lib//snabbdom/vnode'
import { Children, Properties} from 'lib/hyperscript-helpers'

declare global {
    //==================================DOM Helper Functions==================================
    type HyperScriptHelperFnArgs =
    | []
    | [textOrSelector: string]
    | [children: Children]
    | [properties: Properties]
    | [selector: string, children: Children]
    | [selector: string, text: string]
    | [selector: string, properties: Properties]
    | [properties: Properties, children: Children]
    | [properties: Properties, text: string]
    | [selector: string, properties: Properties, text: string]
    | [selector: string, properties: Properties, children: Children]
    
    function div(...args:HyperScriptHelperFnArgs): VNode
    function a(...args:HyperScriptHelperFnArgs): VNode
    function abbr(...args:HyperScriptHelperFnArgs): VNode
    function address(...args:HyperScriptHelperFnArgs): VNode
    function area(...args:HyperScriptHelperFnArgs): VNode
    function article(...args:HyperScriptHelperFnArgs): VNode
    function aside(...args:HyperScriptHelperFnArgs): VNode
    function audio(...args:HyperScriptHelperFnArgs): VNode
    function b(...args:HyperScriptHelperFnArgs): VNode
    function base(...args:HyperScriptHelperFnArgs): VNode
    function bdi(...args:HyperScriptHelperFnArgs): VNode
    function bdo(...args:HyperScriptHelperFnArgs): VNode
    function blockquote(...args:HyperScriptHelperFnArgs): VNode
    function body(...args:HyperScriptHelperFnArgs): VNode
    function br(...args:HyperScriptHelperFnArgs): VNode
    function button(...args:HyperScriptHelperFnArgs): VNode
    function canvas(...args:HyperScriptHelperFnArgs): VNode
    function caption(...args:HyperScriptHelperFnArgs): VNode
    function cite(...args:HyperScriptHelperFnArgs): VNode
    function code(...args:HyperScriptHelperFnArgs): VNode
    function col(...args:HyperScriptHelperFnArgs): VNode
    function colgroup(...args:HyperScriptHelperFnArgs): VNode
    function dd(...args:HyperScriptHelperFnArgs): VNode
    function del(...args:HyperScriptHelperFnArgs): VNode
    function details(...args:HyperScriptHelperFnArgs): VNode
    function dfn(...args:HyperScriptHelperFnArgs): VNode
    function dialog(...args:HyperScriptHelperFnArgs): VNode
    function dir(...args:HyperScriptHelperFnArgs): VNode
    function div(...args:HyperScriptHelperFnArgs): VNode
    function dl(...args:HyperScriptHelperFnArgs): VNode
    function dt(...args:HyperScriptHelperFnArgs): VNode
    function em(...args:HyperScriptHelperFnArgs): VNode
    function embed(...args:HyperScriptHelperFnArgs): VNode
    function fieldset(...args:HyperScriptHelperFnArgs): VNode
    function figcaption(...args:HyperScriptHelperFnArgs): VNode
    function figure(...args:HyperScriptHelperFnArgs): VNode
    function footer(...args:HyperScriptHelperFnArgs): VNode
    function form(...args:HyperScriptHelperFnArgs): VNode
    function h1(...args:HyperScriptHelperFnArgs): VNode
    function h2(...args:HyperScriptHelperFnArgs): VNode
    function h3(...args:HyperScriptHelperFnArgs): VNode
    function h4(...args:HyperScriptHelperFnArgs): VNode
    function h5(...args:HyperScriptHelperFnArgs): VNode
    function h6(...args:HyperScriptHelperFnArgs): VNode
    function head(...args:HyperScriptHelperFnArgs): VNode
    function header(...args:HyperScriptHelperFnArgs): VNode
    function hgroup(...args:HyperScriptHelperFnArgs): VNode
    function hr(...args:HyperScriptHelperFnArgs): VNode
    function html(...args:HyperScriptHelperFnArgs): VNode
    function i(...args:HyperScriptHelperFnArgs): VNode
    function iframe(...args:HyperScriptHelperFnArgs): VNode
    function img(...args:HyperScriptHelperFnArgs): VNode
    function input(...args:HyperScriptHelperFnArgs): VNode
    function ins(...args:HyperScriptHelperFnArgs): VNode
    function kbd(...args:HyperScriptHelperFnArgs): VNode
    function keygen(...args:HyperScriptHelperFnArgs): VNode
    function label(...args:HyperScriptHelperFnArgs): VNode
    function legend(...args:HyperScriptHelperFnArgs): VNode
    function li(...args:HyperScriptHelperFnArgs): VNode
    function link(...args:HyperScriptHelperFnArgs): VNode
    function main(...args:HyperScriptHelperFnArgs): VNode
    function map(...args:HyperScriptHelperFnArgs): VNode
    function mark(...args:HyperScriptHelperFnArgs): VNode
    function menu(...args:HyperScriptHelperFnArgs): VNode
    function meta(...args:HyperScriptHelperFnArgs): VNode
    function nav(...args:HyperScriptHelperFnArgs): VNode
    function noscript(...args:HyperScriptHelperFnArgs): VNode
    function object(...args:HyperScriptHelperFnArgs): VNode
    function ol(...args:HyperScriptHelperFnArgs): VNode
    function optgroup(...args:HyperScriptHelperFnArgs): VNode
    function option(...args:HyperScriptHelperFnArgs): VNode
    function p(...args:HyperScriptHelperFnArgs): VNode
    function param(...args:HyperScriptHelperFnArgs): VNode
    function pre(...args:HyperScriptHelperFnArgs): VNode
    function progress(...args:HyperScriptHelperFnArgs): VNode
    function q(...args:HyperScriptHelperFnArgs): VNode
    function rp(...args:HyperScriptHelperFnArgs): VNode
    function rt(...args:HyperScriptHelperFnArgs): VNode
    function ruby(...args:HyperScriptHelperFnArgs): VNode
    function s(...args:HyperScriptHelperFnArgs): VNode
    function samp(...args:HyperScriptHelperFnArgs): VNode
    function script(...args:HyperScriptHelperFnArgs): VNode
    function section(...args:HyperScriptHelperFnArgs): VNode
    function select(...args:HyperScriptHelperFnArgs): VNode
    function small(...args:HyperScriptHelperFnArgs): VNode
    function source(...args:HyperScriptHelperFnArgs): VNode
    function span(...args:HyperScriptHelperFnArgs): VNode
    function strong(...args:HyperScriptHelperFnArgs): VNode
    function style(...args:HyperScriptHelperFnArgs): VNode
    function sub(...args:HyperScriptHelperFnArgs): VNode
    function summary(...args:HyperScriptHelperFnArgs): VNode
    function sup(...args:HyperScriptHelperFnArgs): VNode
    function table(...args:HyperScriptHelperFnArgs): VNode
    function tbody(...args:HyperScriptHelperFnArgs): VNode
    function td(...args:HyperScriptHelperFnArgs): VNode
    function textarea(...args:HyperScriptHelperFnArgs): VNode
    function tfoot(...args:HyperScriptHelperFnArgs): VNode
    function th(...args:HyperScriptHelperFnArgs): VNode
    function thead(...args:HyperScriptHelperFnArgs): VNode
    function time(...args:HyperScriptHelperFnArgs): VNode
    function title(...args:HyperScriptHelperFnArgs): VNode
    function tr(...args:HyperScriptHelperFnArgs): VNode
    function u(...args:HyperScriptHelperFnArgs): VNode
    function ul(...args:HyperScriptHelperFnArgs): VNode
    function video(...args:HyperScriptHelperFnArgs): VNode
    
    const channelDialog: HTMLDialogElement
    const registerDialog: HTMLDialogElement
    const loginDialog: HTMLDialogElement
    const domainDialog: HTMLDialogElement
    const newProjectDialog: HTMLDialogElement

    const bmap: HTMLCanvasElement
    const avatarMenu: HTMLMenuElement

}