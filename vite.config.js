import {defineConfig} from 'vite'
import cesium from 'vite-plugin-cesium'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '',
  plugins: [react(), cesium(), viteTsconfigPaths()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  build: {
    outDir: './build',
  },
  assetsInclude: ['**/*.fbx', '**/*.glb'],
})
