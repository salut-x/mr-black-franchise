import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const selectors = {
	headings: 'h1, h2',
	skip: 'dialog, .formats, .key-terms, .faq',
	preloader: '[data-preloader]',
}

const preloaderTimeout = 4000

const whenPreloaderDone = () => {
	const preloader = document.querySelector(selectors.preloader)

	if (!preloader || preloader.classList.contains('is-complete')) {
		return Promise.resolve()
	}

	return new Promise(resolve => {
		const observer = new MutationObserver(() => {
			if (!preloader.classList.contains('is-complete')) {
				return
			}

			observer.disconnect()
			resolve()
		})

		observer.observe(preloader, {
			attributes: true,
			attributeFilter: ['class'],
		})

		window.setTimeout(() => {
			observer.disconnect()
			resolve()
		}, preloaderTimeout)
	})
}

const revealHeading = heading =>
	SplitText.create(heading, {
		type: 'lines',
		mask: 'lines',
		linesClass: 'reveal-line',
		autoSplit: true,
		onSplit: self => {
			gsap.set(heading, { autoAlpha: 1 })

			return gsap.from(self.lines, {
				yPercent: 140,
				duration: 0.9,
				ease: 'power3.out',
				stagger: 0.09,
				scrollTrigger: {
					trigger: heading,
					start: 'top 85%',
				},
			})
		},
	})

const initTextReveal = async () => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return
	}

	const headings = Array.from(
		document.querySelectorAll(selectors.headings),
	).filter(heading => !heading.closest(selectors.skip))

	gsap.set(headings, { autoAlpha: 0 })

	await whenPreloaderDone()

	headings.forEach(revealHeading)
}

export default initTextReveal
