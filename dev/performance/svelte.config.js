import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

const resolvePath = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		alias: {
			'@headless': resolvePath('../../packages/chart/src/headless'),
			'@shared': resolvePath('../../packages/chart/src/shared'),
			'@utils': resolvePath('../../packages/chart/src/shared/utils'),
			'flitter-ui/chart': resolvePath('../../packages/flitter/src/chart.ts'),
			'flitter-ui': resolvePath('../../packages/flitter/src/index.ts'),
			'flitter-core/component/Tooltip': resolvePath('../../packages/core/src/component/Tooltip.ts'),
			'flitter-core': resolvePath('../../packages/core/src/index.ts')
		},
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
