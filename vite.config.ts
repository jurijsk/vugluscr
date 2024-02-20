import { defineConfig } from 'vite';
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		dts({}),
		cssInjectedByJsPlugin()
	],
	resolve: {
		alias: [{ find: 'vugluscr', replacement: resolve(__dirname, 'index.ts') }]
	},
	build: {
		minify: false,
		cssCodeSplit: false,
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'index.ts'),
			name: 'index',
			// the proper extensions will be added
			fileName: 'index',
		}
	}
})