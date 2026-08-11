import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

class SmoothScroll {
	constructor() {
		this.lenis = null

		this.init()
	}

	onScroll = () => {
		ScrollTrigger.update()
	}

	onTick = time => {
		this.lenis?.raf(time * 1000)
	}

	init() {
		this.lenis = new Lenis({
			anchors: true,
			autoToggle: true,
		})

		this.lenis.on('scroll', this.onScroll)
		gsap.ticker.add(this.onTick)
		gsap.ticker.lagSmoothing(0)
	}

	destroy() {
		gsap.ticker.remove(this.onTick)
		this.lenis?.off('scroll', this.onScroll)
		this.lenis?.destroy()
	}
}

export default SmoothScroll
