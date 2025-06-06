import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable DTS generation to avoid conflicts
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom']
})