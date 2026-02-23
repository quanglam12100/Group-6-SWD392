import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // giữ nguyên port FE
    proxy: {
      '/api': {
        target: 'https://localhost:7031',
        changeOrigin: true,
        secure: false, // QUAN TRỌNG: cho phép https self-signed
      }
    }
  }
})
