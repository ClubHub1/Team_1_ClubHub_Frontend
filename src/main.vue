Main Home Site Structure, Mounted on initialization
<script setup lang="ts">
    import { RouterView } from 'vue-router';
    import Icon from './components/icon.vue'
    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAuthStore } from './stores/auth';

    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const search = computed({
        get() {
            return route.query.search ?? ''
        },
        set(search) {
            router.replace({ query: { search } })
        },
    })

    function iconClicked() {
        router.push('/')
    }
    
    const links = {
        homeLink: {
            name: 'Home',
            link: '/'
        },
        aboutLink: {
            name: 'About Us',
            link: '/about'
        }
    }
    
    router.push('/')
    
</script>

<template>
    <v-app>
        <!-- App bar displayed at the top of the page -->
        <v-app-bar :elevation="6" color=#4E4E4E scroll-behavior="hide">
            <template v-slot:prepend>
                <v-icon @click="iconClicked" icon = "$chLogo" size=65 to="/"/>
                <v-img 
                class= "mt-3" 
                src=src/assets/clubhubText.png
                cover 
                :width="200" 
                :height="200"
                />
            </template>
        <v-divider :thickness="5" class="mx3" inset vertical />

        <v-app-bar-title class="text-h4 font-weight-bold"></v-app-bar-title>

        <template v-slot:append>
            <v-btn v-if="authStore.isAuthenticated" append-icon="mdi-view-dashboard" class = "mr-5" to="/dashboard">Dashboard</v-btn>

            <v-btn v-if="authStore.isAuthenticated" append-icon="mdi-account" to="/">Profile</v-btn>
            
            <v-btn v-else append-icon="mdi-account" to="/login">Login</v-btn>

            <v-btn class="ml-5" append-icon="mdi-home" to="/">Home</v-btn>

            <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>

        </v-app-bar>
        <v-main>
            <v-card v-if="authStore.isAuthenticated">
                <v-card-text>
                    Authenticated
                </v-card-text>
            </v-card>
            <RouterView></RouterView>
            <!-- ROUTER-RENDERED CONTENT DISPLAYED HERE -->
        </v-main>
        <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 mt-15" color="surface-light">
            <v-btn
            v-for="link in links"
            :text="link.name"
            :to="link.link"
            variant="text"
            rounded
            ></v-btn>
            <div class="flex-1-0-100 text-center mt-2">
            {{ new Date().getFullYear() }} — <strong>ClubHub</strong>
            </div>
        </v-footer>
    </v-app>
</template>