import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Força o Vite a usar apenas uma versão do React em todo o projeto
    dedupe: ['react', 'react-dom'],
  }
})