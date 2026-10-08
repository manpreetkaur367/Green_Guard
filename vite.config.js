import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import siteConfiguration from './.figma/make/site.json'

function figmaSiteConfiguration(config) {
  return {
    name: 'figma-site-configuration',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return { html, tags: [] }
      }
    }
  }
}

export default ({ mode }) => {
  const emitSourcemaps = mode === 'development'
  return {
    base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: { sourcemap: emitSourcemaps ? 'inline' : false, minify: !emitSourcemaps },
    plugins: [react(), tailwindcss(), figmaSiteConfiguration(siteConfiguration)],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
      strictPort: true,
      proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } },
      watch: { ignored: ['**/.figma/**'] },
    },
    preview: { host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0', port: parseInt(process.env.PORT || '8443') },
  }
}
