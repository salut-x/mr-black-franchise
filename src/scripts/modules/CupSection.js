import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CameraParallax from './CameraParallax.js'
import loadModelViewer from './modelViewer.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Стакан, пролетающий сверху вниз сквозь группу секций.
 * Все инстансы делят один /models/cup.glb: model-viewer кэширует GLTF по URL
 * и клонирует материалы на каждый инстанс, поэтому цвет и логотип задаются
 * независимо, а геометрия с текстурами грузятся и лежат в VRAM один раз.
 * Hero живёт отдельно (HeroModel.js) — у него свой параллакс и перевод логотипов.
 */
class CupSection {
	selectors = {
		model: '[data-js-cup-view]',
	}

	stateClasses = {
		landed: 'is-landed',
	}

	materialNames = {
		cup: ['Paper', 'Cup Edge'],
		logo: ['Cup Logo Material', 'Cup Back Logo Material'],
	}

	animation = {
		// Угол, на котором декаль развёрнута к камере при camera-orbit -20deg.
		// Замерен по площади тёмных пикселей логотипа: максимум на 346–354°,
		// центроид совпадает с центром кадра на 352°.
		logoRotation: 350,
		spin: 360,
		offscreenGap: 20,
		pinMaxWidth: 768,
	}

	// Полный оборот, серединой которого стакан выходит на логотип.
	get startRotation() {
		return this.animation.logoRotation - this.animation.spin / 2
	}

	get endRotation() {
		return this.animation.logoRotation + this.animation.spin / 2
	}

	constructor(rootElement) {
		this.rootElement = rootElement
		this.modelElement = rootElement.querySelector(this.selectors.model)
		this.isModelLoaded = false

		this.init()
	}

	onModelLoad = () => {
		if (this.isModelLoaded) {
			return
		}

		this.isModelLoaded = true
		this.applyCupColor()
		this.applyLogo()
		ScrollTrigger.refresh()
	}

	onWindowLoad = () => {
		ScrollTrigger.refresh()
	}

	onScrollTriggerUpdate = self => {
		const pinOffset = this.getPinOffset()

		this.rootElement.classList.toggle(
			this.stateClasses.landed,
			pinOffset !== null && this.rootElement.getBoundingClientRect().top <= 0,
		)
		this.render(
			pinOffset === null ? self.progress : this.getMobilePinProgress(),
		)
	}

	render(progress) {
		this.modelElement.style.setProperty(
			'--cup-offset-y',
			`${this.getOffsetAt(progress)}px`,
		)
		this.modelElement.setAttribute(
			'orientation',
			`0deg 0deg ${this.getRotationAt(progress)}deg`,
		)
	}

	getMaterial(materialName) {
		return this.modelElement.model?.getMaterialByName(materialName)
	}

	applyCupColor() {
		const { cupColor } = this.rootElement.dataset

		if (!cupColor) {
			return
		}

		const color = getComputedStyle(this.rootElement)
			.getPropertyValue(cupColor)
			.trim()

		if (!color) {
			return
		}

		this.materialNames.cup.forEach(materialName => {
			this.getMaterial(materialName)?.pbrMetallicRoughness.setBaseColorFactor(
				color,
			)
		})
	}

	/**
	 * В GLB зашита только hero-декаль, остальные варианты — отдельные webp по
	 * ~18 КБ. Кладём один и тот же логотип на переднюю и заднюю грань: стакан
	 * успевает провернуться на 360°, и обратная сторона иначе была бы пустой.
	 */
	async applyLogo() {
		const { cupLogo } = this.rootElement.dataset

		if (!cupLogo) {
			return
		}

		let texture

		try {
			texture = await this.modelElement.createTexture(cupLogo)
		} catch {
			// Декали нет — остаётся зашитая в GLB, секция не разваливается.
			return
		}

		if (!texture) {
			return
		}

		this.materialNames.logo.forEach(materialName => {
			const logoMaterial = this.getMaterial(materialName)

			logoMaterial?.setAlphaMode('BLEND')
			logoMaterial?.pbrMetallicRoughness.baseColorTexture?.setTexture(texture)
		})
	}

	getOffscreenOffset() {
		const modelHeight = this.modelElement.getBoundingClientRect().height

		return (window.innerHeight + modelHeight) / 2 + this.animation.offscreenGap
	}

	getPinOffset() {
		const { cupPinTop, cupPinMaxWidth } = this.rootElement.dataset
		const pinTop = Number(cupPinTop)
		const pinMaxWidth = Number(cupPinMaxWidth) || this.animation.pinMaxWidth

		if (!pinTop || window.innerWidth >= pinMaxWidth) {
			return null
		}

		const modelHeight = this.modelElement.getBoundingClientRect().height

		return pinTop + modelHeight / 2 - window.innerHeight / 2
	}

	getMobilePinProgress() {
		const sectionTop = this.rootElement.getBoundingClientRect().top

		return gsap.utils.clamp(0, 1, 1 - sectionTop / window.innerHeight)
	}

	/**
	 * Границы фаз в прогрессе триггера: влёт занимает первый экран прокрутки,
	 * вылет — последний, между ними стакан висит по центру вьюпорта сколько бы
	 * ни длилась секция. На секции ростом с экран обе границы сходятся в 0.5 —
	 * получается сквозной пролёт, как у CTA.
	 */
	getFlightRange() {
		const viewportRatio =
			window.innerHeight / (this.rootElement.offsetHeight + window.innerHeight)

		return {
			enterEnd: Math.min(viewportRatio, 0.5),
			exitStart: Math.max(1 - viewportRatio, 0.5),
		}
	}

	getOffsetAt(progress) {
		const offscreen = this.getOffscreenOffset()
		const pin = this.getPinOffset()

		if (pin !== null) {
			return gsap.utils.interpolate(-offscreen, pin, progress)
		}

		const { enterEnd, exitStart } = this.getFlightRange()

		if (progress <= enterEnd) {
			return gsap.utils.interpolate(-offscreen, 0, progress / enterEnd)
		}

		if (progress >= exitStart) {
			return gsap.utils.interpolate(
				0,
				offscreen,
				(progress - exitStart) / (1 - exitStart),
			)
		}

		return 0
	}

	getRotationAt(progress) {
		return gsap.utils.interpolate(
			this.startRotation,
			this.endRotation,
			progress,
		)
	}

	initScrollAnimation() {
		if (this.scrollTrigger) {
			return
		}

		this.render(0)

		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.rootElement,
			start: 'top bottom',
			end: 'bottom top',
			onUpdate: this.onScrollTriggerUpdate,
			onRefresh: this.onScrollTriggerUpdate,
			onLeave: this.onScrollTriggerUpdate,
			onLeaveBack: this.onScrollTriggerUpdate,
		})
	}

	async init() {
		if (!this.modelElement) {
			return
		}

		this.modelElement.addEventListener('load', this.onModelLoad)
		window.addEventListener('load', this.onWindowLoad, { once: true })
		this.initScrollAnimation()
		await loadModelViewer()

		this.cameraParallax = new CameraParallax(this.modelElement, [
			this.rootElement,
		])

		if (this.modelElement.loaded) {
			this.onModelLoad()
		}
	}

	destroy() {
		this.modelElement?.removeEventListener('load', this.onModelLoad)
		window.removeEventListener('load', this.onWindowLoad)
		this.cameraParallax?.destroy()
		this.rootElement.classList.remove(this.stateClasses.landed)
		this.scrollTrigger?.kill()
	}
}

class CupSectionCollection {
	selectors = {
		root: '[data-js-cup-section]',
	}

	constructor() {
		this.cupSections = []

		this.init()
	}

	init() {
		this.cupSections = Array.from(
			document.querySelectorAll(this.selectors.root),
			rootElement => new CupSection(rootElement),
		)
	}

	destroy() {
		this.cupSections.forEach(cupSection => cupSection.destroy())
	}
}

export default CupSectionCollection
