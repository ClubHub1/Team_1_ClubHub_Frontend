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

//router imports
import { createWebHistory, createRouter } from 'vue-router'
import HomePage from './homepage.vue'
import LoginPage from './loginPage.vue'
import EventsPage from './eventsPage.vue'
import ClubsPage from './clubsPage.vue'
import RegisterPage from './registerPage.vue'
import RegisterClub from './registerClub.vue'
import Dashboard from './dashboard.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/events', component: EventsPage},
  { path: '/clubs', component: ClubsPage},
  { path: '/register', component: RegisterPage},
  { path: '/registerClub', component: RegisterClub},
  { path: '/dashboard', component: Dashboard}
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

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

const app = createApp(App);

//Plugins
app.use(vuetify);
app.use(pinia);
app.use(router);

app.mount('#app');


