import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@deamondz/react-filters-provider'],
  },
  build: {
    commonjsOptions: {
      include: [/@deamondz\/react-filters-provider/, /node_modules/]
    }
  }
})
