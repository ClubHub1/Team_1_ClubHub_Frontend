import { createApp } from 'vue'
import App from './main.vue'
import { h } from 'vue'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

//router
import { createWebHistory, createRouter } from 'vue-router'
import HomePage from './homepage.vue'
import LoginPage from './loginPage.vue'
import EventsPage from './eventsPage.vue'
import ClubsPage from './clubsPage.vue'
import RegisterPage from './registerPage.vue'
import RegisterClub from './registerClub.vue'

//router to dashboard pages
// import Dashboard from './dashboard.vue'
// import Events from './dashboardPages/events.vue'
// import Clubs from './dashboardPages/clubs.vue'
// import Profile from './dashboardPages/profile.vue'
// import Tasks from './dashboardPages/tasks.vue'
// import Forms from './dashboardPages/forms.vue'
// import Finances from './dashboardPages/finances.vue'
// import Members from './dashboardPages/members.vue'
// import Settings from './dashboardPages/settings.vue'


//Import Pinia instance
import { pinia } from './modules/pinia'

//import fonts
import '@/plugins/fontSources'

//import custom styles settings
import '@/styles/main.scss'

//Importing custom clubhub logo svg icon
import chLogoComponent from './components/icon.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/events', component: EventsPage},
  { path: '/clubs', component: ClubsPage},
  { path: '/register', component: RegisterPage},
  { path: '/registerClub', component: RegisterClub}
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

app.use(vuetify);
app.use(router);
//app.use(pinia);

app.mount('#app');


