import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

class Formats {
	selectors = {
		slide: '[data-js-formats-slide]',
	}

	animation = {
		clipPathHidden: 'inset(100% 0% 0% 0%)',
		clipPathVisible: 'inset(0% 0% 0% 0%)',
		ease: 'none',
		// Пин обновляется раньше триггеров ниже по странице, иначе они считают
		// свои позиции без его pin-spacer. Заодно включает сортировку триггеров.
		refreshPriority: 1,
		scrub: true,
	}

	constructor(rootElement) {
		this.rootElement = rootElement
		this.slideElements = Array.from(
			this.rootElement.querySelectorAll(this.selectors.slide),
		)
		this.media = gsap.matchMedia()

		this.init()
	}

	init() {
		if (this.slideElements.length < 2) {
			return
		}

		this.media.add('(prefers-reduced-motion: no-preference)', () => {
			const timeline = gsap.timeline()

			this.slideElements.slice(1).forEach((slideElement, index) => {
				timeline.fromTo(
					slideElement,
					{
						clipPath: this.animation.clipPathHidden,
					},
					{
						clipPath: this.animation.clipPathVisible,
						duration: 1,
						ease: this.animation.ease,
					},
					index,
				)
			})

			const scrollTrigger = ScrollTrigger.create({
				trigger: this.rootElement,
				start: 'top top',
				end: () =>
					`+=${(this.slideElements.length - 1) * this.rootElement.offsetHeight}`,
				pin: true,
				refreshPriority: this.animation.refreshPriority,
				scrub: this.animation.scrub,
				animation: timeline,
				invalidateOnRefresh: true,
			})

			return () => {
				scrollTrigger.kill()
				timeline.kill()
			}
		})
	}

	destroy() {
		this.media.revert()
	}
}

class FormatsCollection {
	selectors = {
		root: '[data-js-formats]',
	}

	constructor() {
		this.formats = []

		this.init()
	}

	init() {
		this.formats = Array.from(
			document.querySelectorAll(this.selectors.root),
			rootElement => new Formats(rootElement),
		)
	}

	destroy() {
		this.formats.forEach(formats => formats.destroy())
	}
}

export default FormatsCollection
