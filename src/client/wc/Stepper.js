import { theme } from '../js/theme.js'

class Step extends HTMLElement {
	titleSlot = document.createElement('slot')
	contentSlot = document.createElement('slot')
	constructor() {
		super()
		this.attachShadow({ mode: 'open', delegatesFocus: true })
		this.titleSlot.setAttribute('name', 'title')
		this.contentSlot.setAttribute('name', 'content')
		this.shadowRoot.appendChild(this.titleSlot)
		this.shadowRoot.appendChild(this.contentSlot)
	}
}

class Stepper extends HTMLFormElement {
	step = 0
	stepsSlot = document.createElement('slot')
	titles = []
	contents = []
	constructor() {
		super()
		let template = document.createElement('template')
		template.appendChild(this.stepsSlot)
		this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(template)
	}
	connectedCallback() {
		this.stepsSlot.addEventListener('slotchange', e => {
			//@ts-ignore
			let stepsNode = [...this.stepsSlot.assignedNodes()]
			stepsNode.forEach((node, index) => {
				if(node.nodeName == 'B-STEP') {
					let step = /**@type {Step}*/ (node)
					let title = step.titleSlot.assignedElements()[0]
					let titleSpan = document.createElement('span')
					titleSpan.setAttribute('class', 'stepper-step')
					titleSpan.appendChild(title)
					titleSpan.onclick = e => {
						this.step = index
						this.changeStep()
					}
					this.titles.push(titleSpan)
					let content = step.contentSlot.assignedElements()[0]			
					let contentDiv = document.createElement('div')
					contentDiv.setAttribute('class', 'stepper-content')
					contentDiv.appendChild(content)
					contentDiv.setAttribute('style', 'display: none')
					if (index != stepsNode.length - 1) {
						let nextButton = document.createElement('button')
						nextButton.onclick = e => {
							this.step++
							this.changeStep()
						}
						nextButton.textContent = 'Next'
						contentDiv.appendChild(nextButton)
					} else {
						let submitButton = document.createElement('button')
						submitButton.onclick = e => {
							e.preventDefault()
							this.submit()
						}
						submitButton.textContent = 'Submit'
						contentDiv.appendChild(submitButton)
					}
					this.contents.push(contentDiv)
				}
			})
			this.changeStep()
			if (this.titles.length > 0) {
				let template = document.createElement('div')
				template.innerHTML = /* html */ `
					<style>
						.stepper {

						}
						.stepper__head {
							overflow-x: hidden;
							white-space: nowrap;
						}
						.stepper__body {
							display: flex;
						}

						.stepper-step {
							cursor: pointer;
						}

						.stepper-step-active {
							cursor: default;
							color: var(--primary);
						}
						.stepper-step-completed {
							cursor: default;
							color: var(--secondary)
						}

						.stepper-step + .stepper-step::before {
							content: ">";
							padding: 0rem var(--w);
						}

						button {*/
							padding: 0px var(--w);
							text-transform: uppercase;
							cursor: pointer;
							background-color: var(--accent);
							font-weight: inherit;
							font-family: inherit;
							font-style: inherit;
							color: white;
							font-size: inherit;
							border: 0px none;
							outline: 0px;
							padding-left: var(--w);
							padding-right: var(--w);
							margin-top: var(--h);
							z-index: auto;
							line-height: inherit;
							-webkit-font-smoothing: none;
							-moz-font-smoothing: never;
							letter-spacing: inherit;
							font-family: var(--family);
						}
					</style>
					<div class="stepper">
						<div id="steps" class="stepper__head"></div>
						<div id="stepper-body" class="stepper__body"></div>
					</div>
				`
				this.shadowRoot.appendChild(template)
				this.titles.forEach(title => {
					this.shadowRoot.getElementById('steps').appendChild(title)
				})
				this.contents.forEach(content => {
					this.shadowRoot.getElementById('stepper-body').appendChild(content)
				})
			}
		})
	}
	static get observedAttributes() { 
		return ['step'] 
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(name == 'step') {
			this.step = newValue
			this.changeStep()
		}
	}

	changeStep() {
		this.contents.forEach((content, index) => {
			if (this.step == index) {
				content.style.display = 'block'
			} else {
				content.style.display = 'none'
			}
		})
		this.titles.forEach((title, index) => {
			if (this.step > index) {
				title.setAttribute('class', 'stepper-step stepper-step-completed')
			} else if (this.step == index) {
				title.setAttribute('class', 'stepper-step stepper-step-active')
			} else {
				title.setAttribute('class', 'stepper-step')
			}
		})
	}
}
customElements.define('b-step', Step)
customElements.define('b-stepper', Stepper)
