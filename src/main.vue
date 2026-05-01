<script setup lang="ts">
    import { RouterView } from 'vue-router';
    import Icon from './components/icon.vue'
    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAuthStore } from './stores/auth';
import { user } from 'CHBackend/lib/services/User/User';
    import useUserStore from './stores/user';
    import clubhubTextLogo from './assets/clubhubText.png';

    const userStore = useUserStore()

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

    async function logoutUser() {
        await authStore.logout()
        userStore.resetUser()
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
        <v-app-bar :elevation="6" color=#737373 scroll-behavior="hide">
            <template v-slot:prepend>
                <v-icon @click="iconClicked" icon="$chLogo" size=65 to="/"/>
                <img
                    class="clubhub-text-logo hidden-sm-and-down"
                    :src="clubhubTextLogo"
                    alt="ClubHub"
                />
            </template>

            <v-divider :thickness="5" class="mx3" inset vertical />
            <v-app-bar-title class="text-h4 font-weight-bold"></v-app-bar-title>

            <template v-slot:append>
                <v-btn v-if="authStore.isAuthenticated" append-icon="mdi-view-dashboard" class="app-bar-button mr-5" to="/dashboard" rounded="pill">
                    <span class="d-none d-md-inline">Dashboard</span>
                </v-btn>

                <v-btn v-if="authStore.isAuthenticated" append-icon="mdi-account" class="app-bar-button" to="/profile" rounded="pill">
                    <span class="d-none d-md-inline">Profile</span>
                </v-btn>

                <v-btn v-else append-icon="mdi-account" class="app-bar-button" to="/login" rounded="pill">
                    <span class="d-none d-md-inline">Login</span>
                </v-btn>

                <v-btn class="app-bar-button ml-5" append-icon="mdi-home" to="/" rounded="pill">
                    <span class="d-none d-md-inline">Home</span>
                </v-btn>

                <v-menu v-if="authStore.isAuthenticated">
                    <template v-slot:activator="{ props }">
                        <v-btn class="app-bar-button ml-5" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="logoutUser" append-icon="mdi-logout">
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-app-bar>

        <v-main>
            <RouterView></RouterView>
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

<style scoped>
.clubhub-text-logo {
    display: block;
    width: 210px;
    height: auto;
    margin-left: 8px;
    margin-right: 6px;
}

.app-bar-button {
    background-color: #5f5f5f;
}

.app-bar-button:hover {
    background-color: #565656;
}

@media (max-width: 959.98px) {
    .app-bar-button {
        min-width: 40px;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
    }

    .app-bar-button :deep(.v-btn__append) {
        margin-inline-start: 0;
        margin-inline-end: 0;
    }
}
</style>
