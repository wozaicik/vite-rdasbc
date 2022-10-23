import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import cesium from 'vite-plugin-cesium'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    }),
    cesium({
      rebuildCesium: true
    })
  ],
  // 这里是为了使用  @ 符号引入
  resolve: {
    // +++
    alias: {
      '@': resolve(__dirname, './src') // +++
    } // +++
  }
})
