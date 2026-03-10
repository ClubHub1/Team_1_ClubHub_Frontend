//router imports
import { useAuthStore } from '@/stores/auth'
import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../homepage.vue'
import LoginPage from '../loginPage.vue'
import EventsPage from '../eventsPage.vue'
import ClubsPage from '../clubsPage.vue'
import RegisterPage from '../registerPage.vue'
import RegisterClub from '../registerClub.vue'
import Dashboard from '../dashboard.vue'
import AboutPage from '../aboutPage.vue'
import ClubDashboard from '../clubDashboard.vue'
import ClubsList from '@/clubsList.vue'

const routes = [
    { 
        path: '/', 
        name: 'home',
        component: HomePage,
        meta: { requiresAuth: false }
    },
    { 
        path: '/login', 
        name: 'login',
        component: LoginPage,
        meta: { requiresAuth: false }
    },
    { 
        path: '/events', 
        component: EventsPage,
        meta: { requiresAuth: false }
    },
    { 
        path: '/clubs', 
        component: ClubsPage,
        meta: { requiresAuth: false }
    },
    { 
        path: '/register', 
        component: RegisterPage,
        meta: { requiresAuth: false }
    },
    { 
        path: '/registerClub', 
        component: RegisterClub,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    { 
        path: '/about', 
        component: AboutPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/clubDash',
        component: ClubDashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/clubsList',
        component: ClubsList,
        meta: { requiresAuth:true }
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If the route requires auth and the user is not authenticated, redirect to login
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // If the user is authenticated and tries to access the login page, redirect to home
    next({ name: 'home' });
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;