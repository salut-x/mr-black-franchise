import { gsap } from 'gsap'

const selectors = {
	root: '[data-js-main-menu]',
	toggle: '[data-js-main-menu-toggle]',
	panel: '[data-js-main-menu-panel]',
	link: '[data-js-main-menu-link]',
	footerItem: '[data-js-main-menu-footer-item]',
	label: '[data-js-main-menu-label]',
	icon: '[data-js-main-menu-icon]'
}

const stateClasses = {
	isOpen: 'is-open',
	isPanelVisible: 'is-panel-visible',
	isLock: 'is-lock'
}

const animation = {
	panel: {
		duration: 0.5,
		closeDelay: 0.3,
		ease: 'power1.out'
	},
	label: {
		x: 12,
		duration: 0.3,
		closeDelay: 0.1,
		ease: 'sine.inOut'
	},
	items: {
		openX: 100,
		closeX: 100,
		duration: 0.5,
		stagger: 0.04,
		openEase: 'power2.out',
		closeEase: 'power2.in'
	},
	footer: {
		delay: 0.3,
		duration: 0.1,
		stagger: 0.08,
		openEase: 'sine.out',
		closeEase: 'sine.in'
	}
}

const initMainMenu = rootElement => {
	const isEnglish = document.documentElement.lang === 'en'
	const ariaLabels = isEnglish
		? { open: 'Open menu', close: 'Close menu' }
		: { open: 'Открыть меню', close: 'Закрыть меню' }
	const toggleElement = rootElement.querySelector(selectors.toggle)
	const panelElement = rootElement.querySelector(selectors.panel)
	const labelElement = rootElement.querySelector(selectors.label)
	const iconElement = rootElement.querySelector(selectors.icon)
	const linkElements = rootElement.querySelectorAll(selectors.link)
	const footerItemElements = rootElement.querySelectorAll(selectors.footerItem)
	const media = gsap.matchMedia()

	let panelTimeline = null
	let openingTimeline = null
	let closingTimeline = null
	let reduceMotion = false

	const isOpen = () => rootElement.classList.contains(stateClasses.isOpen)

	const killContentTimelines = () => {
		openingTimeline?.kill()
		closingTimeline?.kill()
	}

	const setOpenState = () => {
		rootElement.classList.add(stateClasses.isOpen)
		rootElement.classList.add(stateClasses.isPanelVisible)
		toggleElement.setAttribute('aria-expanded', 'true')
		toggleElement.setAttribute('aria-label', ariaLabels.close)
		panelElement.setAttribute('aria-hidden', 'false')
		panelElement.removeAttribute('inert')
		document.documentElement.classList.add(stateClasses.isLock)
	}

	const setClosedState = ({ hidePanel = false } = {}) => {
		rootElement.classList.remove(stateClasses.isOpen)
		if (hidePanel) {
			rootElement.classList.remove(stateClasses.isPanelVisible)
		}
		toggleElement.setAttribute('aria-expanded', 'false')
		toggleElement.setAttribute('aria-label', ariaLabels.open)
		panelElement.setAttribute('aria-hidden', 'true')
		panelElement.setAttribute('inert', '')
		document.documentElement.classList.remove(stateClasses.isLock)
	}

	const openMenu = () => {
		setOpenState()
		killContentTimelines()

		gsap.set(panelElement, { display: 'flex', autoAlpha: 1 })
		gsap.set(footerItemElements, { autoAlpha: 0 })
		gsap.set(linkElements, { opacity: 1, x: 0 })

		openingTimeline = gsap
			.timeline()
			.to(
				labelElement,
				{
					autoAlpha: 0,
					x: animation.label.x,
					duration: reduceMotion ? 0 : animation.label.duration,
					ease: animation.label.ease
				},
				0
			)
			.from(
				linkElements,
				{
					x: reduceMotion ? 0 : animation.items.openX,
					opacity: reduceMotion ? 1 : 0,
					duration: reduceMotion ? 0 : animation.items.duration,
					stagger: reduceMotion ? 0 : animation.items.stagger,
					ease: animation.items.openEase
				},
				0
			)
			.to(
				footerItemElements,
				{
					autoAlpha: 1,
					duration: reduceMotion ? 0 : animation.footer.duration,
					stagger: reduceMotion ? 0 : animation.footer.stagger,
					ease: animation.footer.openEase
				},
				reduceMotion ? 0 : animation.footer.delay
			)

		panelTimeline?.play()
	}

	const closeMenu = ({ immediately = false } = {}) => {
		setClosedState({ hidePanel: immediately })
		killContentTimelines()

		if (immediately) {
			panelTimeline?.progress(0).pause()
			gsap.set(panelElement, { display: 'none' })
			gsap.set(footerItemElements, { autoAlpha: 0 })
			gsap.set(labelElement, { autoAlpha: 1, x: 0 })
			gsap.set(linkElements, { autoAlpha: 1, x: 0 })
			return
		}

		closingTimeline = gsap
			.timeline()
			.to(
				footerItemElements,
				{
					autoAlpha: 0,
					duration: reduceMotion ? 0 : animation.footer.duration,
					ease: animation.footer.closeEase
				},
				0
			)
			.to(
				linkElements,
				{
					x: reduceMotion ? 0 : animation.items.closeX,
					opacity: reduceMotion ? 1 : 0,
					duration: reduceMotion ? 0 : animation.items.duration,
					stagger: reduceMotion
						? 0
						: { each: animation.items.stagger, from: 'end' },
					ease: animation.items.closeEase
				},
				0
			)
			.to(
				labelElement,
				{
					autoAlpha: 1,
					x: 0,
					duration: reduceMotion ? 0 : animation.label.duration,
					ease: animation.label.ease
				},
				reduceMotion ? 0 : animation.label.closeDelay
			)
			.call(
				() => panelTimeline?.reverse(),
				[],
				reduceMotion ? 0 : animation.panel.closeDelay
			)
	}

	const onToggleClick = () => {
		isOpen() ? closeMenu() : openMenu()
	}

	const onDocumentKeydown = event => {
		if (event.key === 'Escape' && isOpen()) {
			closeMenu()
		}
	}

	const onLinkClick = () => {
		closeMenu()
	}

	media.add(
		{
			isVisible: '(max-width: 1023px)',
			reduceMotion: '(prefers-reduced-motion: reduce)'
		},
		context => {
			const { isVisible, reduceMotion: shouldReduceMotion } = context.conditions
			reduceMotion = shouldReduceMotion

			if (!isVisible) {
				closeMenu({ immediately: true })
				return
			}

			const duration = reduceMotion ? 0 : animation.panel.duration

			gsap.set(footerItemElements, { autoAlpha: 0 })
			gsap.set(labelElement, { autoAlpha: 1, x: 0 })
			gsap.set(linkElements, { autoAlpha: 1, x: 0 })

			panelTimeline = gsap
				.timeline({
					paused: true,
					onReverseComplete: () => {
						if (!isOpen()) {
							rootElement.classList.remove(stateClasses.isPanelVisible)
							gsap.set(panelElement, { display: 'none' })
						}
					}
				})
				.fromTo(
					panelElement,
					{ clipPath: 'inset(0 0 100% 0)' },
					{
						clipPath: 'inset(0 0 0% 0)',
						duration,
						ease: animation.panel.ease
					}
				)
				.to(iconElement, { borderColor: 'transparent', duration }, 0)

			return () => {
				killContentTimelines()
				closeMenu({ immediately: true })
				panelTimeline = null
			}
		}
	)

	toggleElement.addEventListener('click', onToggleClick)
	document.addEventListener('keydown', onDocumentKeydown)
	linkElements.forEach(linkElement => {
		linkElement.addEventListener('click', onLinkClick)
	})

	return () => {
		toggleElement.removeEventListener('click', onToggleClick)
		document.removeEventListener('keydown', onDocumentKeydown)
		linkElements.forEach(linkElement => {
			linkElement.removeEventListener('click', onLinkClick)
		})
		killContentTimelines()
		media.revert()
	}
}

const initMainMenus = () => {
	const cleanupFunctions = Array.from(
		document.querySelectorAll(selectors.root),
		initMainMenu
	)

	return () => {
		cleanupFunctions.forEach(cleanup => cleanup())
	}
}

export default initMainMenus
