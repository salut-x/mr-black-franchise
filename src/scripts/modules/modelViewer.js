let loading

/**
 * Ленивая догрузка <model-viewer> — общая для всех стаканов, чтобы чанк тянулся
 * один раз, — плюс обход бага @google/model-viewer 4.3.1.
 *
 * Каждая запись атрибута orientation вызывает ARRenderer.onUpdateScene(). Вне
 * AR-сессии он всё равно собирает XRMenuPanel (три SVG растрируются в canvas)
 * и падает на presentedScene === null. На скролле orientation пишется каждый
 * кадр, то есть это ~60 исключений и ~180 растеризаций в секунду впустую.
 */
export default function loadModelViewer() {
	loading ??= (async () => {
		const { ModelViewerElement } = await import('@google/model-viewer')

		ModelViewerElement.dracoDecoderLocation = '/draco/'

		try {
			const { Renderer } = await import(
				'@google/model-viewer/lib/three-components/Renderer.js'
			)
			const { arRenderer } = Renderer.singleton

			if (!arRenderer) {
				return
			}

			const { onUpdateScene } = arRenderer

			arRenderer.onUpdateScene = () => {
				if (arRenderer.isPresenting) {
					onUpdateScene()
				}
			}
		} catch {
			// Внутренности пакета переехали — остаётся штатное шумное поведение.
		}
	})()

	return loading
}
