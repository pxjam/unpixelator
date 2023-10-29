import { Unpixelator } from './unpixelator.js'

const options = {
	framesDelay: 150,
	maxPixelSize: 32,
	stepDivisor: 2,
	initialOpacity: 1
}

const els = document.querySelectorAll('[data-unpixelator]')
els.forEach((el) => {
	new Unpixelator(el, options)
})
