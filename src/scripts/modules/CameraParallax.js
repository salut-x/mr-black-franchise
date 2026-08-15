import { gsap } from 'gsap'

const defaults = {
	cameraPitch: 75,
	cameraYaw: -20,
	duration: 0.8,
	ease: 'power3.out',
	maxRotation: 15,
}

/**
 * Наклон камеры <model-viewer> вслед за курсором: движение мыши по секции
 * доворачивает camera-orbit в пределах maxRotation и плавно возвращает камеру
 * на место, когда указатель уходит.
 *
 * Крутится именно камера, а не модель, поэтому это не конфликтует с
 * прокруткой стакана через orientation.
 */
class CameraParallax {
	constructor(modelElement, interactionElements, options) {
		this.modelElement = modelElement
		this.interactionElements = interactionElements
		this.options = { ...defaults, ...options }
		this.rotation = {
			x: 0,
			y: 0,
		}
		this.reduceMotionMedia = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		)

		const { duration, ease } = this.options

		this.rotateXTo = gsap.quickTo(this.rotation, 'x', {
			duration,
			ease,
			onUpdate: this.onRotationUpdate,
		})
		this.rotateYTo = gsap.quickTo(this.rotation, 'y', {
			duration,
			ease,
			onUpdate: this.onRotationUpdate,
		})

		this.bindEvents()
	}

	onRotationUpdate = () => {
		const { cameraYaw, cameraPitch } = this.options

		this.modelElement.setAttribute(
			'camera-orbit',
			`${cameraYaw + this.rotation.y}deg ${cameraPitch + this.rotation.x}deg auto`,
		)
	}

	onPointerMove = event => {
		// На тач-устройствах наведения нет, а pointermove там означает свайп.
		if (
			!this.modelElement.loaded ||
			event.pointerType !== 'mouse' ||
			this.reduceMotionMedia.matches
		) {
			return
		}

		const bounds = event.currentTarget.getBoundingClientRect()
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
		const { maxRotation } = this.options

		this.rotateXTo(-pointerY * maxRotation)
		this.rotateYTo(pointerX * maxRotation)
	}

	onPointerLeave = () => {
		if (!this.modelElement.loaded) {
			return
		}

		this.rotateXTo(0)
		this.rotateYTo(0)
	}

	bindEvents() {
		this.interactionElements.forEach(interactionElement => {
			interactionElement.addEventListener('pointermove', this.onPointerMove)
			interactionElement.addEventListener('pointerleave', this.onPointerLeave)
		})
	}

	destroy() {
		this.interactionElements.forEach(interactionElement => {
			interactionElement.removeEventListener('pointermove', this.onPointerMove)
			interactionElement.removeEventListener(
				'pointerleave',
				this.onPointerLeave,
			)
		})
		this.rotateXTo?.tween.kill()
		this.rotateYTo?.tween.kill()
	}
}

export default CameraParallax
