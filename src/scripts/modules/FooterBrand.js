import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

class FooterBrand {
	selectors = {
		fill: '[data-js-footer-wordmark-fill]',
		legal: '[data-js-footer-legal]',
		wordmark: '[data-js-footer-wordmark]',
	}

	animation = {
		scrub: 0.05,
		legalScrub: true,
		ease: 'none',
		desktopBottomOffset: 51,
		tabletBottomOffset: 53,
	}

	constructor(rootElement) {
		this.rootElement = rootElement
		this.fillElement = this.rootElement.querySelector(this.selectors.fill)
		this.legalElement = this.rootElement.querySelector(this.selectors.legal)
		this.wordmarkElement = this.rootElement.querySelector(this.selectors.wordmark)
		this.media = gsap.matchMedia()

		this.init()
	}

	init() {
		if (!this.fillElement || !this.legalElement || !this.wordmarkElement) {
			return
		}

		this.media.add(
			{
				isAnimated: '(min-width: 768px)',
				desktop: '(min-width: 1024px)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				const { isAnimated, desktop, reduceMotion } = context.conditions

				if (!isAnimated || reduceMotion) {
					gsap.set(this.wordmarkElement, { height: '100%' })
					gsap.set(this.legalElement, { y: 0 })
					return
				}

				const bottomOffset = desktop
					? this.animation.desktopBottomOffset
					: this.animation.tabletBottomOffset
				const targetHeight = desktop ? '100%' : 202

				gsap.fromTo(
					this.wordmarkElement,
					{
						height: 0,
						transformOrigin: 'top center',
					},
					{
						height: targetHeight,
						duration: 1,
						ease: this.animation.ease,
						scrollTrigger: {
							trigger: this.fillElement,
							start: `top bottom-=${bottomOffset}px`,
							end: `bottom bottom-=${bottomOffset}px`,
							scrub: this.animation.scrub,
							invalidateOnRefresh: true,
						},
					},
				)

				gsap.fromTo(
					this.legalElement,
					{
						y: () => -this.fillElement.offsetHeight,
					},
					{
						y: 0,
						duration: 1,
						ease: this.animation.ease,
						scrollTrigger: {
							trigger: this.fillElement,
							start: `top bottom-=${bottomOffset}px`,
							end: `bottom bottom-=${bottomOffset}px`,
							scrub: this.animation.legalScrub,
							invalidateOnRefresh: true,
						},
					},
				)
			},
		)
	}

	destroy() {
		this.media.revert()
	}
}

class FooterBrandCollection {
	selectors = {
		root: '[data-js-footer]',
	}

	constructor() {
		this.footerBrands = []

		this.init()
	}

	onWindowResize = () => {
		ScrollTrigger.refresh()
	}

	init() {
		this.footerBrands = Array.from(
			document.querySelectorAll(this.selectors.root),
			rootElement => new FooterBrand(rootElement),
		)

		window.addEventListener('resize', this.onWindowResize)
	}

	destroy() {
		window.removeEventListener('resize', this.onWindowResize)
		this.footerBrands.forEach(footerBrand => footerBrand.destroy())
	}
}

export default FooterBrandCollection
