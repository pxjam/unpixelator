export class Unpixelator {
	defaults = {
		maxPixelSize: 20,
		framesDelay: 200,
		stepDivisor: 2,
		initialOpacity: 1
	}
	isRendered = false

	#scaledDownCanvas
	#scaledDownCtx

	constructor(el, options = {}) {
		this.el = el
		this.options = { ...this.defaults, ...options }
		this.mount()
	}

	mount = () => {
		this.img = this.el.querySelector('[data-unpixelator-img]')
		this.canvas = this.el.querySelector('[data-unpixelator-canvas]')
		this.ctx = this.canvas.getContext('2d')

		this.#scaledDownCanvas = document.createElement('canvas')
		this.#scaledDownCtx = this.#scaledDownCanvas.getContext('2d')

		this.#waitForImg(this.#handleImgLoad)
	}

	#stepsToReachOne = (num, divisor) => {
		return Math.ceil(Math.log(num) / Math.log(divisor))
	}

	#waitForImg = (callback) => {
		if (this.img.complete) {
			callback()
		} else {
			this.img.addEventListener('load', callback)
		}
	}

	#adaptCanvasToImg = () => {
		this.canvas.width = this.img.width
		this.canvas.height = this.img.height

		this.ctx.mozImageSmoothingEnabled = false
		this.ctx.webkitImageSmoothingEnabled = false
		this.ctx.imageSmoothingEnabled = false
	}

	#handleImgLoad = () => {
		this.#adaptCanvasToImg()

		this.#fadeIn().then(() => {
			this.isRendered = true
		})
	}

	#render = (pixelSize = 1, opacity = 1) => {
		if (pixelSize < 1) pixelSize = 1

		let w = this.canvas.width / pixelSize
		let h = this.canvas.height / pixelSize

		this.#scaledDownCanvas.width = w
		this.#scaledDownCanvas.height = h

		this.#scaledDownCtx.clearRect(0, 0, this.#scaledDownCanvas.width, this.#scaledDownCanvas.height)
		this.#scaledDownCtx.drawImage(this.img, 0, 0, w, h)

		this.ctx.globalAlpha = opacity

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.#scaledDownCanvas, 0, 0, w, h, 0, 0, this.canvas.width, this.canvas.height)
	}

	async #sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	#fadeIn = async () => {
		let pixelSize = this.options.maxPixelSize
		let opacity = this.options.initialOpacity
		let stepsCount = this.#stepsToReachOne(pixelSize, this.options.stepDivisor) + 1

		for (let i = 0; i < stepsCount; i++) {
			this.#render(pixelSize, opacity)
			await this.#sleep(this.options.framesDelay)

			pixelSize /= this.options.stepDivisor
			opacity += 1 / stepsCount
		}
	}
}
