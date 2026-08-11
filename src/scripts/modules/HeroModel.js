import { gsap } from 'gsap'

class HeroModel {
	selectors = {
		model: '[data-js-hero-model-view]',
	}

	materialNames = {
		cup: ['Paper', 'Cup Edge'],
	}

	animation = {
		cameraPitch: 75,
		cameraYaw: -20,
		duration: 0.8,
		ease: 'power3.out',
		maxRotation: 15,
	}

	constructor(rootElement) {
		this.rootElement = rootElement
		this.modelElement = this.rootElement.querySelector(this.selectors.model)
		this.reduceMotionMedia = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)
		this.isModelLoaded = false
		this.rotation = {
			x: 0,
			y: 0,
		}

		this.init()
	}

	onRootPointerMove = event => {
		if (
			!this.isModelLoaded ||
			event.pointerType !== 'mouse' ||
			this.reduceMotionMedia.matches
		) {
			return
		}

		const bounds = this.rootElement.getBoundingClientRect()
		const pointerX = gsap.utils.clamp(
			-1,
			1,
			((event.clientX - bounds.left) / bounds.width) * 2 - 1,
		)
		const pointerY = gsap.utils.clamp(
			-1,
			1,
			((event.clientY - bounds.top) / bounds.height) * 2 - 1,
		)

		this.rotateXTo(-pointerY * this.animation.maxRotation)
		this.rotateYTo(pointerX * this.animation.maxRotation)
	}

	onRootPointerLeave = () => {
		if (!this.isModelLoaded) {
			return
		}

		this.rotateXTo(0)
		this.rotateYTo(0)
	}

	onModelLoad = () => {
		this.isModelLoaded = true
		this.setCupColor()
	}

	onRotationUpdate = () => {
		this.modelElement.setAttribute(
			'camera-orbit',
			`${this.animation.cameraYaw + this.rotation.y}deg ${this.animation.cameraPitch + this.rotation.x}deg auto`,
		)
	}

	setCupColor() {
		const cupColor = getComputedStyle(this.rootElement)
			.getPropertyValue('--color-white')
			.trim()
		const cupMaterials = this.materialNames.cup.map(
			materialName =>
				this.modelElement.model?.getMaterialByName(materialName),
		)

		if (!cupColor) {
			return
		}

		cupMaterials.forEach(cupMaterial => {
			cupMaterial?.pbrMetallicRoughness.setBaseColorFactor(cupColor)
		})
	}

	async init() {
		if (!this.modelElement) {
			return
		}

		this.modelElement.addEventListener('load', this.onModelLoad)
		await import('@google/model-viewer')

		this.rotateXTo = gsap.quickTo(this.rotation, 'x', {
			duration: this.animation.duration,
			ease: this.animation.ease,
			onUpdate: this.onRotationUpdate,
		})
		this.rotateYTo = gsap.quickTo(this.rotation, 'y', {
			duration: this.animation.duration,
			ease: this.animation.ease,
			onUpdate: this.onRotationUpdate,
		})

		this.bindEvents()
	}

	bindEvents() {
		this.rootElement.addEventListener('pointermove', this.onRootPointerMove)
		this.rootElement.addEventListener('pointerleave', this.onRootPointerLeave)
	}

	destroy() {
		this.rootElement.removeEventListener('pointermove', this.onRootPointerMove)
		this.rootElement.removeEventListener('pointerleave', this.onRootPointerLeave)
		this.modelElement.removeEventListener('load', this.onModelLoad)
		this.rotateXTo?.tween.kill()
		this.rotateYTo?.tween.kill()
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
