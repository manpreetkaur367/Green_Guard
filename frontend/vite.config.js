import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default ({ mode }) => {
  const emitSourcemaps = mode === 'development'
  return {
    base: '/',
    build: { sourcemap: emitSourcemaps ? 'inline' : false, minify: !emitSourcemaps },
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
    server: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      proxy: { '/api': { target: 'http://localhost:8011', changeOrigin: true } },
    },
    preview: { host: '0.0.0.0', port: 4173 },
  }
}
