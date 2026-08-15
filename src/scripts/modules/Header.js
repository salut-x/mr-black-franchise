import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const selectors = {
	header: '[data-js-header]',
	themed: '[data-header-theme]',
}

const themes = ['light', 'dark', 'none']

function initHeader() {
	const headerElement = document.querySelector(selectors.header)

	if (!headerElement) {
		return
	}

	const themedElements = [...document.querySelectorAll(selectors.themed)]

	let currentTheme = themes[0]

	const updateTheme = () => {
		const line = headerElement.offsetHeight / 2
		const active = themedElements.findLast(element => {
			const { top, bottom } = element.getBoundingClientRect()

			return top <= line && bottom > line
		})

		currentTheme = active?.dataset.headerTheme ?? currentTheme

		themes.forEach(name => {
			headerElement.classList.toggle(`header--${name}`, name === currentTheme)
		})
	}

	updateTheme()

	ScrollTrigger.create({
		start: 0,
		end: 'max',
		onUpdate: updateTheme,
	})

	ScrollTrigger.addEventListener('refresh', updateTheme)
}

export default initHeader
