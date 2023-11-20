import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import path from 'path';

const settings = {
  distPath: path.join(__dirname, 'dist'),
  srcPath: path.join(__dirname, 'src'),
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/chatapiCreateUser': {
      target: 'https://api.freshchat.com/v2/users',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/chatapiCreateUser/, ''),
    },
  },
  cors: true,
},
build: {
  outDir: 'dist',
  assetsDir: 'assets',
  manifest: true,
  rollupOptions: {
    input: {
        index: fileURLToPath(new URL( path.resolve(__dirname, 'src/index.html'), import.meta.url)),
        login: fileURLToPath(new URL( path.resolve(__dirname, 'src/login.html'), import.meta.url)),
    },
  },
},
entry: {
  index: './src/index.jsx',
  login: './src/login.jsx',
},
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.join(settings.srcPath, 'components'),
      '@core': path.join(settings.srcPath, 'core'),
      '@root': path.join(settings.srcPath, ''),
      '@services': path.join(settings.srcPath, 'Services'),
      '@assets': path.join(settings.srcPath, 'assets'),
      '@action': path.join(settings.srcPath, 'StateManagement'),
      '@nativeBridge': path.join(settings.srcPath, 'NativeJSBridge'),
    },
    extensions: ['.js', '.json', '.jsx', '.scss', '.png'],
    modules: ['node_modules'],
  },
})
