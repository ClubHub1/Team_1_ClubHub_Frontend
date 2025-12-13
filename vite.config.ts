import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
// vite.config.ts

//Setting up autoImport for pinia
import AutoImport from 'unplugin-auto-import/vite'

import { feathersPiniaAutoImport } from 'feathers-pinia'


vuetify({
  styles: {
    configFile: 'src/sass/variables.scss',
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    vuetify(),
    AutoImport({ 
    /* options */ 
     imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
        feathersPiniaAutoImport,
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
    }),
  ],
  //base: '/ClubHub1/Team_1_ClubHub/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
