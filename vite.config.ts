import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function rarebridgeAssetResolver() {
  return {
    name: 'rarebridge-figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('rarebridge:asset/')) {
        const filename = id.replace('rarebridge:asset/', '')
        // Use URL-based resolution to avoid Node-only globals in the config
        return new URL(`./src/assets/${filename}`, import.meta.url).pathname
      }
    },
  }
}

export default defineConfig({
  plugins: [
    rarebridgeAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory (URL -> pathname)
      '@': new URL('./src', import.meta.url).pathname,
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
