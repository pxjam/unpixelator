import { Unpixelator } from './unpixelator.js'

const options = {
	framesDelay: 150,
	maxPixelSize: 64,
	stepDivisor: 2,
	initialOpacity: 0.2
}

const els = document.querySelectorAll('[data-unpixelator]')
els.forEach((el) => {
	new Unpixelator(el, options)
})
