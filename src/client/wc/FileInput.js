class FileInput extends HTMLElement {
	fileArray = []
	binaryData = []
	/**@type {HTMLLabelElement}*/ fileNameLabel
	constructor() {
		super()
		this.attachShadow({ mode: 'open', delegatesFocus: true })
		this.shadowRoot.innerHTML = /* html */ `
		<style>
			.file-input {
				visibility: hidden;
				color: transparent;
				&::-ms-clear,
				&::-ms-reveal,
				&::-webkit-file-upload-button {
					display: none;
				}
			}
			.file-input-label {
				display: block;
			}
			.file-names {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: var(--background);
				background-color: var(--primary);
			}
			.base-input {
				display: grid;
				grid-template-areas: "prepend control append" "details-left details details-right";
				grid-template-columns: max-content auto max-content;
				grid-template-rows: auto auto;
				flex: 1 1 auto;
				margin-bottom: var(--h);
				grid-area: control;
			}
		</style>
		<div class="base-input__control">
			<label class="file-input-label">File</label>
			<label>
				<div id="file-input-label" class="file-names" >choose</div>
				<input id="file-input" placeholder="choose" multiple type="file" class="file-input">
			</label>
		</div>
			`
		let inputEl = /**@type {HTMLInputElement}*/ (this.shadowRoot.getElementById('file-input'))
		this.fileNameLabel = /**@type {HTMLLabelElement}*/ (this.shadowRoot.getElementById('file-input-label'))
		inputEl.onclick = event => {
			//@ts-ignore
			event.target.value = null
		}
		inputEl.onchange = event => {
			let target = /**@type {HTMLInputElement}*/ (event.target)
			let fileList = target.files
			if (fileList) {
				this.fileArray = []
				for (let i = 0; i < fileList.length; i++) {
					let file = fileList[i]
					let reader = new FileReader()
					let rawData = new ArrayBuffer(file.size)
					reader.onload = e => {
						rawData = /**@type {ArrayBuffer}*/ (e.target.result)
						this.binaryData.push({name: file.name, data: rawData})
					}
					reader.readAsArrayBuffer(file)
					this.fileArray.push(file)
				}

				this.writeFileNames()
			} else {
				console.log([])
			}
		}
	}
	writeFileNames() {
		let nameCSV = this.fileArray.map(file => file.name).join(', ')
		console.log(nameCSV)
		this.fileNameLabel.textContent = nameCSV
	}
}
customElements.define('file-input', FileInput)
