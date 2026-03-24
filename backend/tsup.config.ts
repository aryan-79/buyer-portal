import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: true,
  format: ['esm'],
  sourcemap: false,
  dts: false,
  minify: true,
});
