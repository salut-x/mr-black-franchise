import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const selectors = {
	image: '[data-js-package-image]',
}

const animation = {
	tabletScale: 240 / 135,
	desktopScale: 370 / 240,
	start: 'top 85%',
	end: 'top 55%',
	transformOrigin: '100% 100%',
}

const conditions = {
	tablet: '(width >= 768px) and (width < 1024px)',
	desktop: '(width >= 1024px)',
	motion: '(prefers-reduced-motion: no-preference)',
}

const media = gsap.matchMedia()

function initPackageImages() {
	const imageElements = gsap.utils.toArray(selectors.image)

	if (!imageElements.length) {
		return
	}

	media.add(conditions, context => {
		const { tablet, desktop, motion } = context.conditions

		if (!motion || (!tablet && !desktop)) {
			return
		}

		imageElements.forEach(imageElement => {
			gsap.fromTo(
				imageElement,
				{ scale: 1 },
				{
					scale: tablet ? animation.tabletScale : animation.desktopScale,
					ease: 'none',
					transformOrigin: animation.transformOrigin,
					scrollTrigger: {
						trigger: imageElement,
						start: animation.start,
						end: animation.end,
						scrub: true,
					},
				},
			)
		})
	})
}

export default initPackageImages
