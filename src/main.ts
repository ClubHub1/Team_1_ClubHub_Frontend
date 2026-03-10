import { createApp } from 'vue'
import App from './main.vue'
import { h } from 'vue'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

//Import Pinia instance
import { pinia } from './modules/pinia'

//import fonts
import '@/plugins/fontSources'

//import custom styles settings
import '@/styles/main.scss'

//Importing custom clubhub logo svg icon
import chLogoComponent from './components/icon.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    aliases:{
        chLogo: chLogoComponent,
    },
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
        light: {
            colors: {
                primary: "#041E42"
            }
        },
        dark: {
            colors: {
                primary: "#041E42"
            },
        },
    },
  },
})

import router from './router'

const app = createApp(App);

import { api } from './backendAPI'
import { feathersClient } from './backendAPI'

//Plugins
app.use(pinia);
app.use(vuetify);
app.use(router);
app.mount('#app');


