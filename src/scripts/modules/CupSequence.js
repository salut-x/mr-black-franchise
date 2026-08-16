import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Кадр секвенции по прогрессу скролла hero -> features. Заменяет hero-модель
 * до 768px: там у стакана нет ни вылета вниз, ни параллакса за курсором,
 * поэтому пререндер покрывает всю анимацию целиком.
 */
class CupSequence {
	selectors = {
		features: '[data-js-hero-model-features]',
	}

	constructor(canvasElement) {
		this.canvasElement = canvasElement
		this.context = canvasElement.getContext('2d')
		this.frameUrls = JSON.parse(canvasElement.dataset.frames || '[]')
		this.frames = new Array(this.frameUrls.length)
		this.lastFrameIndex = -1

		this.init()
	}

	onScrollTriggerUpdate = self => {
		this.render(self.progress)
	}

	loadFrame(index) {
		return new Promise(resolve => {
			const image = new Image()

			image.decoding = 'async'
			image.onload = image.onerror = () => {
				this.frames[index] = image
				resolve(image)
			}
			image.src = this.frameUrls[index]
		})
	}

	/** Ближайший загруженный кадр, чтобы холст не мигал пустотой. */
	getDrawableFrame(index) {
		for (let offset = 0; offset < this.frames.length; offset += 1) {
			const frame =
				this.frames[index - offset] ?? this.frames[index + offset]

			if (frame?.complete) {
				return frame
			}
		}

		return null
	}

	render(progress) {
		const index = gsap.utils.clamp(
			0,
			this.frames.length - 1,
			Math.round(progress * (this.frames.length - 1)),
		)

		if (index === this.lastFrameIndex) {
			return
		}

		const frame = this.getDrawableFrame(index)

		if (!frame) {
			return
		}

		this.lastFrameIndex = index
		this.context.clearRect(
			0,
			0,
			this.canvasElement.width,
			this.canvasElement.height,
		)
		this.context.drawImage(
			frame,
			0,
			0,
			this.canvasElement.width,
			this.canvasElement.height,
		)
	}

	/** Остальные кадры — только после первой отрисовки, мимо критического пути. */
	loadRestFrames() {
		const load = () => {
			for (let index = 1; index < this.frameUrls.length; index += 1) {
				this.loadFrame(index)
			}
		}

		if (window.requestIdleCallback) {
			window.requestIdleCallback(load)
			return
		}

		window.setTimeout(load, 200)
	}

	initScrollAnimation() {
		const featuresElement = document.querySelector(this.selectors.features)

		if (!featuresElement) {
			return
		}

		this.scrollTrigger = ScrollTrigger.create({
			trigger: featuresElement,
			start: 'top bottom',
			end: 'top top',
			scrub: true,
			onUpdate: this.onScrollTriggerUpdate,
			onRefresh: this.onScrollTriggerUpdate,
		})
	}

	async init() {
		if (!this.frameUrls.length) {
			return
		}

		await this.loadFrame(0)
		this.render(0)
		this.initScrollAnimation()

		if (document.readyState === 'complete') {
			this.loadRestFrames()
			return
		}

		window.addEventListener('load', () => this.loadRestFrames(), {
			once: true,
		})
	}

	destroy() {
		this.scrollTrigger?.kill()
	}
}

class CupSequenceCollection {
	selectors = {
		canvas: '[data-js-cup-sequence]',
	}

	constructor() {
		this.sequences = []

		this.init()
	}

	init() {
		if (window.innerWidth >= 768) {
			return
		}

		this.sequences = Array.from(
			document.querySelectorAll(this.selectors.canvas),
			canvasElement => new CupSequence(canvasElement),
		)
	}

	destroy() {
		this.sequences.forEach(sequence => sequence.destroy())
	}
}

export default CupSequenceCollection
