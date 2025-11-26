import { createApp } from 'vue'
import App from './homepage.vue'
import { h } from 'vue'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

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

createApp(App).use(vuetify).mount('#app')
