import Cookies from 'js-cookie'

const selectors = {
	banner: '[data-js-cookie-banner]',
	accept: '[data-js-cookie-accept]',
}

const cookieName = 'cookie-consent'
const cookieLifetimeDays = 365

export default function initCookieBanner() {
	const bannerElement = document.querySelector(selectors.banner)

	if (!bannerElement || Cookies.get(cookieName)) {
		return
	}

	const acceptElement = bannerElement.querySelector(selectors.accept)

	bannerElement.hidden = false

	acceptElement?.addEventListener('click', () => {
		Cookies.set(cookieName, 'accepted', {
			expires: cookieLifetimeDays,
			sameSite: 'lax',
		})
		bannerElement.hidden = true
	})
}
