import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CameraParallax from './CameraParallax.js'
import loadModelViewer from './modelViewer.js'

gsap.registerPlugin(ScrollTrigger)

class HeroModel {
	selectors = {
		features: '[data-js-hero-model-features]',
		formats: '[data-js-hero-model-formats]',
		interaction: '[data-js-hero-model-interaction]',
		model: '[data-js-hero-model-view]',
	}

	materialNames = {
		cup: ['Paper', 'Cup Edge'],
		backLogo: 'Cup Back Logo Material',
		frontLogo: 'Cup Logo Material',
	}

	animation = {
		scrollRotation: 180,
		exitScrollRotation: 360,
		scrollScrub: true,
		// Съезд занимает хвост выходного диапазона: чем меньше значение,
		// тем дольше стакан уезжает вниз.
		exitOffsetStart: 0.35,
		offscreenGap: 20,
		flatMaxWidth: 768,
		modelFrameDuration: 1000 / 30,
	}

	constructor(rootElement) {
		this.rootElement = rootElement
		this.modelElement = this.rootElement.querySelector(this.selectors.model)
		this.featuresElement = this.rootElement.querySelector(
			this.selectors.features,
		)
		this.formatsElement = this.rootElement.querySelector(
			this.selectors.formats,
		)
		this.interactionElements = Array.from(
			this.rootElement.querySelectorAll(this.selectors.interaction),
		)
		this.isModelLoaded = false
		this.cupMaterials = []
		this.lastExitOffsetY = null
		this.lastModelUpdateTime = 0
		this.modelUpdateTimer = null
		this.pendingModelState = null
		this.lastModelState = {
			backLogoOpacity: null,
			color: null,
			frontLogoOpacity: null,
			rotation: null,
		}
		this.scrollAnimation = {
			backLogoOpacity: 0,
			color: '',
			exitOffsetY: 0,
			frontLogoOpacity: 1,
			rotation: 0,
		}
		this.init()
	}

	onModelLoad = () => {
		if (this.isModelLoaded) {
			return
		}

		this.isModelLoaded = true
		this.initLogoMaterials()
		this.setInitialCupColor()
		this.initScrollAnimation()
		this.initExitScrollAnimation()
	}

	onScrollAnimationUpdate = () => {
		const exitOffsetY =
			Math.round(this.scrollAnimation.exitOffsetY * 100) / 100

		if (exitOffsetY !== this.lastExitOffsetY) {
			this.lastExitOffsetY = exitOffsetY
			this.modelElement.style.setProperty(
				'--hero-model-exit-y',
				`${exitOffsetY}px`,
			)
		}

		this.pendingModelState = {
			backLogoOpacity:
				Math.round(this.scrollAnimation.backLogoOpacity * 1000) / 1000,
			color: this.scrollAnimation.color,
			frontLogoOpacity:
				Math.round(this.scrollAnimation.frontLogoOpacity * 1000) / 1000,
			rotation: Math.round(this.scrollAnimation.rotation * 100) / 100,
		}
		this.requestModelUpdate()
	}

	requestModelUpdate() {
		const elapsed = performance.now() - this.lastModelUpdateTime
		const remaining = this.animation.modelFrameDuration - elapsed

		if (remaining <= 0) {
			this.applyModelState()
			return
		}

		if (this.modelUpdateTimer) {
			return
		}

		this.modelUpdateTimer = window.setTimeout(() => {
			this.modelUpdateTimer = null
			this.applyModelState()
		}, remaining)
	}

	applyModelState() {
		if (!this.pendingModelState) {
			return
		}

		const {
			backLogoOpacity,
			color,
			frontLogoOpacity,
			rotation,
		} = this.pendingModelState

		this.lastModelUpdateTime = performance.now()

		if (rotation !== this.lastModelState.rotation) {
			this.lastModelState.rotation = rotation
			this.modelElement.setAttribute(
				'orientation',
				`0deg 0deg ${rotation}deg`,
			)
		}

		if (color && color !== this.lastModelState.color) {
			this.lastModelState.color = color
			this.setCupColor(color)
		}

		if (frontLogoOpacity !== this.lastModelState.frontLogoOpacity) {
			this.lastModelState.frontLogoOpacity = frontLogoOpacity
			this.setLogoOpacity(
				this.frontLogoMaterial,
				this.frontLogoColor,
				frontLogoOpacity,
			)
		}

		if (backLogoOpacity !== this.lastModelState.backLogoOpacity) {
			this.lastModelState.backLogoOpacity = backLogoOpacity
			this.setLogoOpacity(
				this.backLogoMaterial,
				this.backLogoColor,
				backLogoOpacity,
			)
		}
	}

	getOffscreenOffset() {
		const modelHeight = this.modelElement.getBoundingClientRect().height

		return (window.innerHeight + modelHeight) / 2 + this.animation.offscreenGap
	}

	getColor(propertyName) {
		return getComputedStyle(this.rootElement)
			.getPropertyValue(propertyName)
			.trim()
	}

	getCupMaterials() {
		return this.cupMaterials
	}

	setCupColor(color) {
		if (!color) {
			return
		}

		this.getCupMaterials().forEach(cupMaterial => {
			cupMaterial?.pbrMetallicRoughness.setBaseColorFactor(color)
		})
	}

	setLogoOpacity(logoMaterial, baseColor, opacity) {
		if (!logoMaterial || !baseColor) {
			return
		}

		const color = [baseColor[0], baseColor[1], baseColor[2], opacity]
		logoMaterial.pbrMetallicRoughness.setBaseColorFactor(color)
	}

	setInitialCupColor() {
		const cupColor = this.getColor('--color-white')

		this.scrollAnimation.color = cupColor
		this.lastModelState.color = cupColor
		this.setCupColor(cupColor)
	}

	initLogoMaterials() {
		this.cupMaterials = this.materialNames.cup.map(
			materialName => this.modelElement.model?.getMaterialByName(materialName),
		)
		this.frontLogoMaterial = this.modelElement.model?.getMaterialByName(
			this.materialNames.frontLogo,
		)
		this.backLogoMaterial = this.modelElement.model?.getMaterialByName(
			this.materialNames.backLogo,
		)
		this.frontLogoColor = [
			...(this.frontLogoMaterial?.pbrMetallicRoughness.baseColorFactor || []),
		]
		this.backLogoColor = [
			...(this.backLogoMaterial?.pbrMetallicRoughness.baseColorFactor || []),
		]

		this.frontLogoMaterial?.setAlphaMode('BLEND')
		this.backLogoMaterial?.setAlphaMode('BLEND')
		this.setLogoOpacity(this.frontLogoMaterial, this.frontLogoColor, 1)
		this.setLogoOpacity(this.backLogoMaterial, this.backLogoColor, 0)
		this.lastModelState.frontLogoOpacity = 1
		this.lastModelState.backLogoOpacity = 0
	}

	initScrollAnimation() {
		if (!this.featuresElement || this.scrollTimeline) {
			return
		}

		const targetColor = this.getColor('--color-green')

		if (!targetColor) {
			return
		}

		this.scrollTimeline = gsap.timeline({
			onUpdate: this.onScrollAnimationUpdate,
			scrollTrigger: {
				trigger: this.featuresElement,
				start: 'top bottom',
				end: 'top top',
				scrub: this.animation.scrollScrub,
				invalidateOnRefresh: true,
			},
		})

		this.scrollTimeline.to(this.scrollAnimation, {
			color: targetColor,
			duration: 1,
			ease: 'none',
			rotation: this.animation.scrollRotation,
		}, 0)
			.to(this.scrollAnimation, {
				duration: 0.5,
				ease: 'none',
				frontLogoOpacity: 0,
			}, 0)
			.to(this.scrollAnimation, {
				backLogoOpacity: 1,
				duration: 0.5,
				ease: 'none',
			}, 0.5)

		ScrollTrigger.refresh()
	}

	initExitScrollAnimation() {
		if (!this.formatsElement || this.exitScrollMedia) {
			return
		}

		this.exitScrollMedia = gsap.matchMedia()
		this.exitScrollMedia.add('(min-width: 768px)', () => {
			this.exitScrollTimeline = gsap.timeline({
				onUpdate: this.onScrollAnimationUpdate,
				scrollTrigger: {
					trigger: this.featuresElement,
					start: 'top top',
					endTrigger: this.formatsElement,
					end: 'top top',
					scrub: this.animation.scrollScrub,
					invalidateOnRefresh: true,
				},
			})

			this.exitScrollTimeline.fromTo(
				this.scrollAnimation,
				{
					rotation: this.animation.scrollRotation,
				},
				{
					duration: 1,
					ease: 'none',
					immediateRender: false,
					rotation: this.animation.exitScrollRotation,
				},
				0,
			)
				// Стакан съезжает вниз навстречу поднимающейся кромке Formats:
				// та непрозрачна и лежит выше слоя модели, так что срезает его
				// ровно так же, как секции обрезают стаканы ниже по странице.
				.fromTo(
					this.scrollAnimation,
					{
						exitOffsetY: 0,
					},
					{
						duration: 1 - this.animation.exitOffsetStart,
						ease: 'none',
						exitOffsetY: () => this.getOffscreenOffset(),
						immediateRender: false,
					},
					this.animation.exitOffsetStart,
				)

			ScrollTrigger.refresh()

			return () => {
				this.exitScrollTimeline?.scrollTrigger?.kill()
				this.exitScrollTimeline?.kill()
				this.exitScrollTimeline = undefined
				this.scrollAnimation.exitOffsetY = 0
				this.modelElement.style.removeProperty('--hero-model-exit-y')
			}
		})
	}

	/** До 768px hero рисует CupSequence, а WebGL не поднимается вовсе. */
	isFlat() {
		return window.innerWidth < this.animation.flatMaxWidth
	}

	async init() {
		if (!this.modelElement || this.isFlat()) {
			return
		}

		this.modelElement.addEventListener('load', this.onModelLoad)
		await loadModelViewer()

		this.cameraParallax = new CameraParallax(
			this.modelElement,
			this.interactionElements,
		)
	}

	destroy() {
		window.clearTimeout(this.modelUpdateTimer)
		this.cameraParallax?.destroy()
		this.modelElement.removeEventListener('load', this.onModelLoad)
		this.scrollTimeline?.scrollTrigger?.kill()
		this.scrollTimeline?.kill()
		this.exitScrollMedia?.revert()
	}
}

class HeroModelCollection {
	selectors = {
		root: '[data-js-hero-model]',
	}

	constructor() {
		this.heroModels = []

		this.init()
	}

	init() {
		this.heroModels = Array.from(
			document.querySelectorAll(this.selectors.root),
			rootElement => new HeroModel(rootElement),
		)
	}

	destroy() {
		this.heroModels.forEach(heroModel => heroModel.destroy())
	}
}

export default HeroModelCollection
