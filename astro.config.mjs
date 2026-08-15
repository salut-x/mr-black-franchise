import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					// Хелперы (миксины/функции) доступны в каждом <style lang="scss"> без @use.
					loadPaths: [fileURLToPath(new URL('./src/styles', import.meta.url))],
					additionalData: '@use "helpers" as *;',
				},
			},
		},
	},
})
