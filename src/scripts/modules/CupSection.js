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
		modelFrameDuration: 1000 / 30,
	}

	modelAttributes = {
		cameraOrbit: '-20deg 75deg auto',
		fieldOfView: '30deg',
		interactionPrompt: 'none',
		shadowIntensity: '0',
	}

	// Секции лежат ниже сгиба: чанк model-viewer тянем не раньше подхода к вьюпорту.
	viewerRootMargin = '100% 0px'

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
		this.modelPlaceholderElement = this.modelElement
		this.isModelLoaded = false
		this.metrics = null
		this.lastOffset = null
		this.lastRotation = null
		this.lastModelUpdateTime = 0
		this.pendingRotation = this.startRotation
		this.modelUpdateTimer = null

		this.init()
	}

	onModelLoad = () => {
		if (this.isModelLoaded) {
			return
		}

		this.isModelLoaded = true
		this.applyCupColor()
		this.applyLogo()
	}

	onWindowLoad = () => {
		ScrollTrigger.refresh()
	}

	onScrollTriggerUpdate = self => {
		if (!this.metrics) {
			this.updateMetrics()
		}

		const { pinOffset, landedProgress } = this.metrics

		this.rootElement.classList.toggle(
			this.stateClasses.landed,
			pinOffset !== null && self.progress >= landedProgress,
		)
		this.render(
			pinOffset === null
				? self.progress
				: this.getMobilePinProgress(self.progress),
		)
	}

	onScrollTriggerRefresh = self => {
		this.updateMetrics()
		this.onScrollTriggerUpdate(self)
	}

	render(progress) {
		const offset = Math.round(this.getOffsetAt(progress) * 100) / 100

		if (offset !== this.lastOffset) {
			this.lastOffset = offset
			this.modelElement.style.setProperty('--cup-offset-y', `${offset}px`)
		}

		this.requestModelRotation(this.getRotationAt(progress))
	}

	requestModelRotation(rotation) {
		this.pendingRotation = Math.round(rotation * 100) / 100

		const elapsed = performance.now() - this.lastModelUpdateTime
		const remaining = this.animation.modelFrameDuration - elapsed

		if (remaining <= 0) {
			this.applyModelRotation()
			return
		}

		if (this.modelUpdateTimer) {
			return
		}

		this.modelUpdateTimer = window.setTimeout(() => {
			this.modelUpdateTimer = null
			this.applyModelRotation()
		}, remaining)
	}

	applyModelRotation() {
		if (this.pendingRotation === this.lastRotation) {
			return
		}

		this.lastRotation = this.pendingRotation
		this.lastModelUpdateTime = performance.now()
		this.modelElement.setAttribute(
			'orientation',
			`0deg 0deg ${this.lastRotation}deg`,
		)
	}

	mountModel() {
		const modelSource = this.modelPlaceholderElement.dataset.modelSrc

		if (!modelSource) {
			return false
		}

		const modelElement = document.createElement('model-viewer')
		const modelAlt = this.modelPlaceholderElement.getAttribute('aria-label')
		const modelOrientation = this.modelPlaceholderElement.getAttribute(
			'orientation',
		)

		modelElement.className = this.modelPlaceholderElement.className
		modelElement.style.cssText = this.modelPlaceholderElement.style.cssText
		this.modelPlaceholderElement
			.getAttributeNames()
			.filter(attributeName => attributeName.startsWith('data-astro-'))
			.forEach(attributeName => {
				modelElement.setAttribute(
					attributeName,
					this.modelPlaceholderElement.getAttribute(attributeName) || '',
				)
			})
		modelElement.setAttribute('alt', modelAlt || '')
		modelElement.setAttribute('camera-orbit', this.modelAttributes.cameraOrbit)
		modelElement.setAttribute('field-of-view', this.modelAttributes.fieldOfView)
		modelElement.setAttribute(
			'interaction-prompt',
			this.modelAttributes.interactionPrompt,
		)
		modelElement.setAttribute(
			'orientation',
			modelOrientation || `0deg 0deg ${this.startRotation}deg`,
		)
		modelElement.setAttribute(
			'shadow-intensity',
			this.modelAttributes.shadowIntensity,
		)
		modelElement.setAttribute('loading', 'eager')
		modelElement.setAttribute('data-js-cup-view', '')
		modelElement.addEventListener('load', this.onModelLoad)

		this.modelPlaceholderElement.replaceWith(modelElement)
		this.modelElement = modelElement
		this.modelElement.setAttribute('src', modelSource)

		return true
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

	getPinOffset(modelHeight, viewportHeight) {
		const { cupPinTop, cupPinMaxWidth } = this.rootElement.dataset
		const pinTop = Number(cupPinTop)
		const pinMaxWidth = Number(cupPinMaxWidth) || this.animation.pinMaxWidth

		if (!pinTop || window.innerWidth >= pinMaxWidth) {
			return null
		}

		return pinTop + modelHeight / 2 - viewportHeight / 2
	}

	getMobilePinProgress(progress) {
		return gsap.utils.clamp(
			0,
			1,
			progress * this.metrics.mobileProgressScale,
		)
	}

	/**
	 * Границы фаз в прогрессе триггера: влёт занимает первый экран прокрутки,
	 * вылет — последний, между ними стакан висит по центру вьюпорта сколько бы
	 * ни длилась секция. На секции ростом с экран обе границы сходятся в 0.5 —
	 * получается сквозной пролёт, как у CTA.
	 */
	getFlightRange(viewportRatio) {
		return {
			enterEnd: Math.min(viewportRatio, 0.5),
			exitStart: Math.max(1 - viewportRatio, 0.5),
		}
	}

	getOffsetAt(progress) {
		const {
			enterEnd,
			exitStart,
			offscreenOffset,
			pinOffset,
		} = this.metrics

		if (pinOffset !== null) {
			return gsap.utils.interpolate(-offscreenOffset, pinOffset, progress)
		}

		if (progress <= enterEnd) {
			return gsap.utils.interpolate(-offscreenOffset, 0, progress / enterEnd)
		}

		if (progress >= exitStart) {
			return gsap.utils.interpolate(
				0,
				offscreenOffset,
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

	updateMetrics() {
		const viewportHeight = window.innerHeight
		const modelHeight = this.modelElement.getBoundingClientRect().height
		const sectionHeight = this.rootElement.offsetHeight
		const triggerDistance = sectionHeight + viewportHeight
		const viewportRatio = viewportHeight / triggerDistance
		const { enterEnd, exitStart } = this.getFlightRange(viewportRatio)

		this.metrics = {
			enterEnd,
			exitStart,
			landedProgress: viewportRatio,
			mobileProgressScale: triggerDistance / viewportHeight,
			offscreenOffset:
				(viewportHeight + modelHeight) / 2 + this.animation.offscreenGap,
			pinOffset: this.getPinOffset(modelHeight, viewportHeight),
		}
	}

	initScrollAnimation() {
		if (this.scrollTrigger) {
			return
		}

		this.updateMetrics()
		this.render(0)

		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.rootElement,
			start: 'top bottom',
			end: 'bottom top',
			onUpdate: this.onScrollTriggerUpdate,
			onRefresh: this.onScrollTriggerRefresh,
			onLeave: this.onScrollTriggerUpdate,
			onLeaveBack: this.onScrollTriggerUpdate,
		})
	}

	whenNearViewport() {
		return new Promise(resolve => {
			this.viewerObserver = new IntersectionObserver(
				entries => {
					if (!entries.some(entry => entry.isIntersecting)) {
						return
					}

					this.viewerObserver.disconnect()
					resolve()
				},
				{ rootMargin: this.viewerRootMargin },
			)

			this.viewerObserver.observe(this.rootElement)
		})
	}

	async init() {
		if (!this.modelElement) {
			return
		}

		window.addEventListener('load', this.onWindowLoad, { once: true })
		this.initScrollAnimation()
		await this.whenNearViewport()
		await loadModelViewer()

		if (!this.mountModel()) {
			return
		}

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
		this.viewerObserver?.disconnect()
		window.clearTimeout(this.modelUpdateTimer)
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
