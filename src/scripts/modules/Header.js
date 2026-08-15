import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const selectors = {
	header: '[data-js-header]',
	themed: '[data-header-theme], [data-header-theme-mobile]',
}

const themes = ['light', 'dark', 'none']

function initHeader() {
	const headerElement = document.querySelector(selectors.header)

	if (!headerElement) {
		return
	}

	const themedElements = [...document.querySelectorAll(selectors.themed)]
	const mobileViewport = window.matchMedia('(width < 1024px)')

	let currentTheme = themes[0]

	const updateTheme = () => {
		const line = headerElement.offsetHeight / 2
		const active = themedElements.findLast(element => {
			const theme = mobileViewport.matches
				? element.dataset.headerThemeMobile ?? element.dataset.headerTheme
				: element.dataset.headerTheme

			if (!theme) {
				return false
			}

			const { top, bottom } = element.getBoundingClientRect()

			return top <= line && bottom > line
		})

		currentTheme = active
			? mobileViewport.matches
				? active.dataset.headerThemeMobile ?? active.dataset.headerTheme
				: active.dataset.headerTheme
			: currentTheme

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
	mobileViewport.addEventListener('change', updateTheme)
}

export default initHeader
