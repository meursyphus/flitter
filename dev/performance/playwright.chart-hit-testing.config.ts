import base from './playwright.chart-gallery.config';
export default {
	...base,
	testMatch: /chart-hit-testing\.spec\.ts/,
	outputDir: 'test-results/chart-hit-testing',
	fullyParallel: true,
	workers: 2
};
