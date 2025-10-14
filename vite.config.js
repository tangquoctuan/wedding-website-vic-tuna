import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { imagetools } from 'vite-imagetools'
import { TrendingUp } from 'lucide-react';

export default defineConfig({
  plugins: [
    react(),
    // 👇 Smart import-based optimizer (for ?w=800&format=webp)
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('format')) return new URLSearchParams()
        return new URLSearchParams({
          format: 'webp',
          w: '1200', // default max width
        })
      },
    }),
    // 👇 Global optimizer (compresses all image assets at build)
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 75 },
      avif: { quality: 60 },
      svg: { multipass: true },
      generateWebp: true,
      generateAvif: true,
      resize: [400, 800, 1200],
    }),
  ],  
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp'],
  server: {  
    allowedHosts: true,
    cors: true, // This allows all origins
  }
});