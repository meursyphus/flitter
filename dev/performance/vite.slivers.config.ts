import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
	root: resolve('./fixtures/slivers'),
	resolve: { alias: { 'flitter-core': resolve('../../packages/core/src/index.ts') } },
	server: { fs: { allow: [resolve('../..')] } }
});
