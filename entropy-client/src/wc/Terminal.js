import { theme } from '../js/theme'
class Terminal extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open', delegatesFocus: true })
		this.shadowRoot.innerHTML = /* html */ `
        <style>
        .control-char {
            color: var(--blessed-theme-colors-palette-0);
            opacity: 0.5;
            align-self: flex-end;
        }

        .control {
            color: var(--blessed-theme-colors-palette-0);
            background-color: transparent;
            resize: none;
            caret-color: transparent;
            width: 100%;

            font-weight: inherit;
            font-family: inherit;
            font-style: inherit;
            color: inherit;
            font-size: inherit;
            border: 0px none;
            outline: 0px;
            padding: 0px;
            margin: 0px;
            z-index: auto;
            background-color: transparent;
            line-height: inherit;
            -webkit-font-smoothing: none;
            -moz-font-smoothing: never;
            letter-spacing: inherit;
            font-family: var(--family);
            
            overflow-y: auto;
            overflow-x: hidden;
            color: var(--palette-0);
            font-size: var(--h);
            line-height: var(--h);
            letter-spacing: 0px;
            scroll-snap-type: both;
            scroll-snap-align: start;
        }
        .control-focus,
        .control-char-focus {
            color: var(--blessed-theme-colors-palette-0);
            opacity: 100%;
        }
        .input {
            width: calc(100% - 2 * var(--w));
            max-height: calc(5 * var(--h));
            overflow: hidden;
        }
        .container::placeholder {
            color: var(--blessed-theme-colors-palette-0);
            opacity: 50%;
        }
        .container {
            display: flex;
            flex-direction: row;
            width: 100%;
            overflow: hidden;

        }
        .caret {
            position: absolute;
            width: var(--w);
            height: var(--h);
            backdrop-filter: invert(100%);
            animation: blink 1s steps(5, start) infinite;
        }
        .measurer {
            max-width: calc(100% - 2 * var(--w));
            white-space: pre-wrap;
            position: fixed;
            overflow-x: hidden;
        }
        @keyframes blink {
            from { visibility: visible; }
            to { visibility: hidden; }
        }
        </style>
        <div id="container" class="container">
        <label id="control-char" class="control-char">$></label>
        <div id="input" class="input">
            <textarea
                id="textareaEl"
                :placeholder="placeholder"
                :disabled="disabled"
                rows="1"
                class="control"
            ></textarea>
            <div style="opacity: 0;" id="caretEl" class="caret"></div>
        </div>
    </div>
            `
		this.input_ = this.shadowRoot.getElementById('textareaEl')
		this.input_.addEventListener('input', e => this.onInput(e))
		this.input_.addEventListener('keyup', e => this.onKeyup(e))
		this.input_.addEventListener('focusin', e => {
			document.addEventListener('selectionchange', (e) => this.onSelectionChange())
			this.setCaretPos(e.target)
			this.controlChar.style.opacity = 1
		})
		this.input_.addEventListener('focusout', e => {
			document.removeEventListener('selectionchange', (e) => this.onSelectionChange())
			this.caretEl.style.opacity = '0%'
			this.controlChar.style.opacity = 0.5
		})
		this.x = '0px'
		this.ym = '-' + theme.font.h + 'px'
		this.y = '-' + theme.font.h + 'px'
		this.caret = false
		this.textareaEl = this.shadowRoot.getElementById('textareaEl')
		this.caretEl = this.shadowRoot.getElementById('caretEl')
		this.controlChar = this.shadowRoot.getElementById('control-char')
		this.addEventListener('click', () => { this.input_.focus() })
	}
	resize(textarea) {
		textarea.style.height = 'auto'
		textarea.style.height = textarea.scrollHeight + 'px'
		textarea.scrollTop = textarea.scrollHeight
	}
	// Called whenever the value is updated.
	onInput(e) {
		e.stopPropagation()
		let target = e.target
		this.resize(target)
		this.setCaretPos(target)
	}
	setCaretPos(textarea) {
		this.caretEl.style.opacity = '1'
		let pos = this.getCaretPosition(textarea)
		this.y = pos.y - textarea.scrollHeight + theme.font.h + 'px'
		this.x = (pos.x + 0) + 'px'
		if (this.caretEl) {
			this.caretEl.style.left = this.x
			this.caretEl.style.top = this.y
			this.caretEl.style.marginTop = this.ym
			this.caretEl.getAnimations().forEach(animation => {
				animation.cancel()
				animation.play()
			})
		}
	}
	onKeyup(e) {
		let target = e.target
		if (!e.shiftKey && e.code === 'Enter') {
			emit('enter', target.value.trimEnd())
			setTimeout(() => { this.resize(target) }, 0)
		}
		if (e.code == 'ArrowLeft'
            || e.code == 'ArrowRight'
            || e.code == 'ArrowDown'
            || e.code == 'ArrowUp') {
			this.setCaretPos(target)
		}
	}
	onSelectionChange() {
		if (this.caretEl.style.opacity == '1') {
			this.setCaretPos(this.textareaEl)
		}
	}
	// Form controls usually expose a "value"  property
	get value() { return this.input_.value }
	set value(v) { this.input_.value = v }
	createCopy(textArea) {
		var copy = document.createElement('div')
		copy.textContent = textArea.value
		var style = getComputedStyle(textArea);
		[
			'fontFamily',
			'fontSize',
			'fontWeight',
			'wordWrap',
			'whiteSpace',
			'borderLeftWidth',
			'borderTopWidth',
			'borderRightWidth',
			'borderBottomWidth',
		].forEach(function (key) {
			copy.style[key] = style[key]
		})
		copy.style.overflow = 'auto'
		copy.style.width = textArea.offsetWidth + 'px'
		copy.style.height = textArea.offsetHeight + 'px'
		copy.style.position = 'absolute'
		copy.style.left = textArea.offsetLeft + 'px'
		copy.style.top = textArea.offsetTop + 'px'
		this.shadowRoot.appendChild(copy)
		return copy
	}
	getCaretPosition(textArea) {
		var start = textArea.selectionStart
		var end = textArea.selectionEnd
		let measurer = document.createElement('div')
		measurer.textContent = textArea.value
		let input = this.shadowRoot.getElementById('input')
		if (measurer.firstChild) {
			measurer.setAttribute('class', 'measurer')
			input.appendChild(measurer)
			let selection = this.shadowRoot.getSelection()
			let range = document.createRange()
			selection.addRange(range)
			range.setStart(measurer.firstChild, start)
			range.setEnd(measurer.firstChild, end)
			let rect = range.getBoundingClientRect()
			input.removeChild(measurer)
			textArea.selectionStart = start
			textArea.selectionEnd = end
			textArea.focus()
			return {
				x: rect.left < (textArea.clientWidth + theme.font.w) ? rect.right : (textArea.clientWidth + theme.font.w),
				y: rect.top - textArea.scrollTop
			}
		}
		else {
			let rect = input.getClientRects()[0]
			return {
				x: rect.left,
				y: rect.top + theme.font.h
			}
		}
	}
}
customElements.define('terminal-input', Terminal)
