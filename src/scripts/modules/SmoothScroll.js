import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

class SmoothScroll {
	media = {
		reduceMotion: '(prefers-reduced-motion: reduce)',
		touch: '(pointer: coarse)',
	}

	constructor() {
		this.lenis = null
		this.isDestroyed = false

		this.init()
	}

	onScroll = () => {
		ScrollTrigger.update()
	}

	onTick = time => {
		this.lenis?.raf(time * 1000)
	}

	async init() {
		if (
			window.matchMedia(this.media.touch).matches ||
			window.matchMedia(this.media.reduceMotion).matches
		) {
			return
		}

		const { default: Lenis } = await import('lenis')

		if (this.isDestroyed) {
			return
		}

		this.lenis = new Lenis({
			anchors: true,
			autoToggle: true,
		})

		this.lenis.on('scroll', this.onScroll)
		gsap.ticker.add(this.onTick)
	}

	destroy() {
		this.isDestroyed = true
		gsap.ticker.remove(this.onTick)
		this.lenis?.off('scroll', this.onScroll)
		this.lenis?.destroy()
	}
}

export default SmoothScroll
