import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'FlitterVue',
      fileName: 'flitter-vue'
    },
    rollupOptions: {
      external: ['vue', '@meursyphus/flitter'],
      output: {
        globals: {
          vue: 'Vue',
          '@meursyphus/flitter': 'Flitter'
        }
      }
    }
  }
})