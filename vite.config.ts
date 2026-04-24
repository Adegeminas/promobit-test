import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/** GitHub Pages: https://adegeminas.github.io/promobit-test/ */
const GITHUB_PAGES_BASE = '/promobit-test/';

export default defineConfig(({ command }) => ({
	base: command === 'build' ? GITHUB_PAGES_BASE : '/',
	plugins: [vue()],
	test: {
		environment: 'happy-dom',
		globals: true,
	},
}));
