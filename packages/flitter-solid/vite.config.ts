import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    solid(),
    dts({
      insertTypesEntry: true,
      include: ['src/lib/**/*.ts', 'src/lib/**/*.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'FlitterSolid',
      fileName: 'flitter-solid',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['solid-js', '@meursyphus/flitter'],
      output: {
        globals: {
          'solid-js': 'Solid',
          '@meursyphus/flitter': 'Flitter',
        },
      },
    },
  },
});