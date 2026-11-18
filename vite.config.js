import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        /* React and the router change when they are upgraded and at no other
           time, while the writing changes whenever Austin adds a poem. Kept
           apart, a new poem invalidates the small half and returning readers
           keep the large one out of cache.

           The pages themselves are deliberately NOT split. They are rendered
           to HTML at build time, and a lazily-loaded route cannot be — it
           would come back as a Suspense fallback on first paint, which on
           this site means a flash of nothing where the photograph should be. */
        manualChunks: (id) =>
          id.includes('node_modules') ? 'vendor' : undefined,
      },
    },
  },
})
