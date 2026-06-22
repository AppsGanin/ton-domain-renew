import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// base: './' keeps every asset path relative, so the build works on any
// GitHub Pages URL (user.github.io/<repo>/, a custom domain, or a sub-path)
// without having to hardcode the repository name.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // @ton/core and @tonconnect rely on Node globals (Buffer/global/process)
    // that don't exist in the browser — polyfill them or the app white-screens
    // with "Buffer is not defined".
    nodePolyfills({ globals: { Buffer: true, global: true, process: true } }),
  ],
});
