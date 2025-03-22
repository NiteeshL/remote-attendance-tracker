import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '*.amazonaws.com',
      'a8e0e8f4578b44efca15e6c346fa517f-c1a78a8970840967.elb.ap-south-1.amazonaws.com'
    ]
  }
})
