import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 插件
  plugins: [
    vue(),
  ],

  // https://vitejs.cn/config/#resolve-alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'source'),
    },
  },

  // 构建选项
  // https://vitejs.cn/config/#build-options
  build: {
    // 输出路径 // 默认 dist
    outDir: 'bundle',

    // 库模式
    lib: {
      // entry: string
      entry: path.resolve(__dirname, 'source/main.ts'),
      // name?: string
      name: 'MyLib',
      // formats?: ('es' | 'cjs' | 'umd' | 'iife')[]
      formats: ['es', 'cjs', 'umd', 'iife'],
      // fileName?: string | ((format: ModuleFormat) => string)
      fileName: (format) => `my-lib.${format}.js`,
    },

    // https://vitejs.cn/config/#build-rollupoptions
    // https://rollupjs.org/guide/en/#big-list-of-options
    // rollupOptions: {
    //   // 外部化处理那些不想打包进库的依赖
    //   external: ['vue'],
    //   output: {
    //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //     globals: {
    //       vue: 'Vue',
    //     },
    //   },
    // },

    // build.minify // boolean | 'terser' | 'esbuild'
    // false 禁用最小化混淆
    // 默认为 esbuild，esbuild 比 terser 快 20-40 倍，压缩率只差 1%-2%
    minify: false,
  },

  // 开发服务器选项
  // https://vitejs.cn/config/#server-host
  server: {
    // 将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    host: true,
    // 指定开发服务器端口
    port: 10101,
    // 自定义代理规则
    proxy: {
      // '/api/name' === 'https://api.com/name'
      '/api': 'https://api.com/',

      // http://game.wsmud.com/Game/GetServer
    },
  },

})
