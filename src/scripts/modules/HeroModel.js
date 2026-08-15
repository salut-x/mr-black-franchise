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
		this.isModelLoaded = true
		this.setInitialCupColor()
		this.initLogoMaterials()
		this.initScrollAnimation()
		this.initExitScrollAnimation()
	}

	onScrollAnimationUpdate = () => {
		this.modelElement.style.setProperty(
			'--hero-model-exit-y',
			`${this.scrollAnimation.exitOffsetY}px`,
		)
		this.modelElement.setAttribute(
			'orientation',
			`0deg 0deg ${this.scrollAnimation.rotation}deg`,
		)
		this.setCupColor(this.scrollAnimation.color)
		this.setLogoOpacity(
			this.frontLogoMaterial,
			this.scrollAnimation.frontLogoOpacity,
		)
		this.setLogoOpacity(
			this.backLogoMaterial,
			this.scrollAnimation.backLogoOpacity,
		)
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
		return this.materialNames.cup.map(
			materialName => this.modelElement.model?.getMaterialByName(materialName),
		)
	}

	setCupColor(color) {
		if (!color) {
			return
		}

		this.getCupMaterials().forEach(cupMaterial => {
			cupMaterial?.pbrMetallicRoughness.setBaseColorFactor(color)
		})
	}

	setLogoOpacity(logoMaterial, opacity) {
		if (!logoMaterial) {
			return
		}

		const color = [
			...logoMaterial.pbrMetallicRoughness.baseColorFactor,
		]

		color[3] = opacity
		logoMaterial.pbrMetallicRoughness.setBaseColorFactor(color)
	}

	setInitialCupColor() {
		const cupColor = this.getColor('--color-white')

		this.scrollAnimation.color = cupColor
		this.setCupColor(cupColor)
	}

	initLogoMaterials() {
		this.frontLogoMaterial = this.modelElement.model?.getMaterialByName(
			this.materialNames.frontLogo,
		)
		this.backLogoMaterial = this.modelElement.model?.getMaterialByName(
			this.materialNames.backLogo,
		)

		this.frontLogoMaterial?.setAlphaMode('BLEND')
		this.backLogoMaterial?.setAlphaMode('BLEND')
		this.setLogoOpacity(this.frontLogoMaterial, 1)
		this.setLogoOpacity(this.backLogoMaterial, 0)
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

	async init() {
		if (!this.modelElement) {
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
