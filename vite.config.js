import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  esbuild: {
    loader: 'jsx',
    include: [
      'src/**/*.js',
      'src/**/*.jsx',
      'node_modules/**/*.js',
      'node_modules/**/*.jsx',
    ],
  },
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    open: true,
    strictPort: true
  }
})
