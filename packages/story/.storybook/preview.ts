import type { Preview } from '@storybook/svelte';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		chromatic: { diffThreshold: 0.2 }
	}
};

export default preview;
