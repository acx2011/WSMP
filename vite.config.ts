import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'

const stableBuildPlugin = (): Plugin => ({
  name: 'winpoint-stable-build',
  transform() {
    return null
  },
})

export default defineConfig({
  plugins: [vue(), stableBuildPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
