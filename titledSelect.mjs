/*
The layout looks like this:

		label-left     number label-right
		[      cl-like-select-x         ]

There is some logic about when to show the
number + label (which are right aligned as a group).
*/


class Element extends HTMLElement {

	#div
	#labelLeft
	#labelNumber
	#labelRight
	#box
	#divB

	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.#create()
		this.shadowRoot.appendChild(this.#div)

		const css = document.createElement('style')
		css.textContent = CSS()
		this.shadowRoot.appendChild(css)
		this.#box.setAttribute("id",this.getAttribute("id"))	// hack because of select.mjs #makeDismissable() implementation
		this.#box.setAttribute("multiselect",this.getAttribute("multiselect"))
	}

	// forward most of them
	static get observedAttributes() { return ['labelleft', 'labelnumber', 'labelright', 
		'id', 'onselect', 'onselected', 'multiselect', 'textformultiselect', 'displaykeys',
		'fractions', 'resetbutton', 'displaykeyinheadbox'] }

	attributeChangedCallback(name, oldVal, newVal) {
		if(name === 'labelleft') { this.labelLeft = newVal; return }
		if(name === 'labelnumber') { this.labelNumber = newVal; return }
		if(name === 'labelright') { this.labelRight = newVal; return }

		this.#box.setAttribute(name,newVal)
	}

	get div() { return this.#div }
	get box() { return this.#box }
	set labelLeft(val) { this.#labelLeft.innerHTML = val }
	set labelNumber(val) { 
		this.#labelNumber.innerHTML = val
		this.#style()
	}
	set labelRight(val) {	this.#labelRight.innerHTML = val }
	set showLabels(val) { 
		if(val===true) {
			this.#labelRight.style.display = ""
			this.#labelNumber.style.display = ""
			this.#labelLeft.style.display = ""
			this.#divB.classList.add("bottomDistance")
		} else {
			this.#labelRight.style.display = "none"
			this.#labelNumber.style.display = "none"
			this.#labelLeft.style.display = "none"
			this.#divB.classList.remove("bottomDistance")
		} 
	}

	#create() {

		this.#div = document.createElement('div')
		
		this.#labelLeft = document.createElement('a')
		this.#labelLeft.classList.add("label")
		
		this.#divB = document.createElement('div')
		this.#divB.setAttribute("style","display:flex; justify-content: space-between; align-items:center;")
		this.#divB.classList.add("bottomDistance")

		const divC = document.createElement('div')
		divC.style.display = "flex"
		divC.style.alignItems = "center"

		this.#labelNumber = document.createElement('a')
		this.#labelRight = document.createElement('a')
		this.#labelRight.classList.add("labelRight")
		divC.appendChild(this.#labelNumber)
		divC.appendChild(this.#labelRight)

		this.#divB.appendChild(this.#labelLeft)
		this.#divB.appendChild(divC)
		
		this.#box = document.createElement('ecl-like-select-x')

		this.#box.setAttribute("dimension", this.getAttribute("dimension"))

		this.#div.appendChild(this.#divB)

		this.#div.appendChild(this.#box)
	}

	#style() {
		if(this.#labelNumber.innerHTML === "") {
			this.#labelNumber.classList.remove("count")
			this.#divB.classList.remove("bottomDistance")
		} else {
			this.#labelNumber.classList.add("count")
			this.#divB.classList.add("bottomDistance")
		}
	}

	set multiselect(val) { this.#box.setAttribute("multiselect",val) }

}


window.customElements.define('titled-select', Element)


function CSS() {
	return `.count {
		align-items: center;
		/*background-color: #0e47cb;*/
		/* gradient just to make blue circle smaller */
		background: radial-gradient(circle, #0e47cb 0%, #0e47cb 60%, #0e47cb00 65%, #0e47cb00 100%);
		border-radius: 50%;
		color: #fff;
		display: inline-flex;
		font: normal normal 400 0.8rem Arial,sans-serif;
		vertical-align: bottom;
		justify-content: center;
		padding: 0.75rem;
		position: relative;
		height: 0px;
		width: 0px;
		margin-right: 5px;
	}
	.label {
		color: #141517;
		font-weight: 600;
		line-height: 24px;
	}
	.labelRight {
		font-size: 14px;
	}
	.bottomDistance {
		margin-bottom: 5px;
	}

	`
}
