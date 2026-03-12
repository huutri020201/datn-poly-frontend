import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 1. Import path

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 2. Add this alias configuration
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 