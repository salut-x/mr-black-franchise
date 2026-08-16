/**
 * Стакан выбирает WebGL или пререндер один раз при инициализации, поэтому
 * пересечение брейкпоинта требует полной переинициализации — проще перезагрузить.
 *
 * Слушаем именно matchMedia, а не resize: на мобилке resize стреляет при
 * появлении адресной строки и при открытии клавиатуры, то есть перезагружал бы
 * страницу посреди заполнения формы. matchMedia срабатывает только когда
 * ширина реально пересекает границу.
 */
const breakpoints = [768, 1024]

export default function initBreakpointReload() {
	breakpoints.forEach(width => {
		window
			.matchMedia(`(min-width: ${width}px)`)
			.addEventListener('change', () => window.location.reload())
	})
}
