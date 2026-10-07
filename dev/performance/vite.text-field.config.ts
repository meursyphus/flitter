import { mergeConfig } from 'vite';
import config from './vite.config';
// This focused core fixture does not need to crawl unrelated chart routes.
export default mergeConfig(config, { optimizeDeps: { noDiscovery: true, entries: [] } });
