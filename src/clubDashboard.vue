<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import useClubStore from './stores/clubStore'
import { feathersClient } from './backendAPI'
import useMemberStore from './stores/memberStore'
import useUserStore from './stores/user'

import ClubEventsPage from './clubDashboardPages/clubEventsPage.vue'
import ClubNotificationsPage from './clubDashboardPages/clubNotificationsPage.vue'
import ClubAttendancePage from './clubDashboardPages/attendancePage.vue'
import ClubMembersPage from './clubDashboardPages/clubMembersPage.vue'
import ClubTasksPage from './clubDashboardPages/clubTasksPage.vue'
import ClubFinancesPage from './clubDashboardPages/clubFinancesPage.vue'
import ClubSettingsPage from './clubDashboardPages/clubSettingsPage.vue'

const auth = useAuthStore()
const clubStore = useClubStore()
const memberStore = useMemberStore()
const userStore = useUserStore()

// ── Set current user's role and membership ID ─────────────────────────────────
async function setPermissions() {
    const res = await (feathersClient.service('ClubMembership') as any).find({
        query: {
            $select: ['role', 'id'],
            userid: userStore.id,
            clubid: clubStore.id
        }
    }).catch((err: any) => {
        console.error('SERVER THREW ERROR RETRIEVING MEMBERSHIP ENTRY:', err)
    })

    if (res?.data?.length) {
        memberStore.setRole(res.data[0].role)
        memberStore.setId(res.data[0].id)
    }
}

onMounted(setPermissions)

const sections = [
    { id: 'dashboard', label: 'Club Dashboard', icon: 'mdi-view-dashboard-variant-outline', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary', 'Member'] },
    { id: 'createEvent', label: 'Create Event', icon: 'mdi-calendar-plus', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary'] },
    { id: 'createAnnouncement', label: 'Create Announcement', icon: 'mdi-bullhorn-outline', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary'] },
    { id: 'members', label: 'Members', icon: 'mdi-account-multiple', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary'] },
    { id: 'finances', label: 'Finances', icon: 'mdi-cash-multiple', roles: ['Advisor', 'President', 'Treasurer'] },
    { id: 'tasks', label: 'Tasks', icon: 'mdi-clipboard-check-outline', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary'] },
    { id: 'attendance', label: 'Attendance', icon: 'mdi-account-check', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary', 'Member'] },
    { id: 'settings',  label: 'Settings', icon: 'mdi-cog', roles: ['Advisor', 'President'] },
]

const activeSections = computed(() =>
    sections.filter(item => item.roles.includes(memberStore.role))
)

const selected = ref('dashboard')

function handleNavClick(sectionId: string) {
    selected.value = sectionId
}
</script>

<template>
    <v-app>
        <v-navigation-drawer expand-on-hover permanent rail width="260" app>
            <v-list>
                <v-list-item
                    v-for="s in activeSections"
                    :key="s.id"
                    :value="s.id"
                    :active="selected === s.id"
                    :prepend-icon="s.icon"
                    @click="handleNavClick(s.id)"
                >
                    <v-list-item-title>{{ s.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="primary">
            <v-toolbar-title>
                <span class="font-weight-bold">{{ clubStore.name }}</span> — Manage your organization
            </v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container class="pa-6">

                <div v-if="selected === 'createEvent'">
                    <ClubEventsPage />
                </div>

                <div v-if="selected === 'createAnnouncement'">
                    <ClubNotificationsPage />
                </div>

                <div v-if="selected === 'members'">
                    <ClubMembersPage />
                </div>

                <div v-if="selected === 'finances'">
                    <ClubFinancesPage />
                </div>

                <div v-if="selected === 'tasks'">
                    <ClubTasksPage />
                </div>

                <div v-if="selected === 'attendance'">
                    <ClubAttendancePage />
                </div>

                <div v-if="selected === 'settings'">
                    <ClubSettingsPage />
                </div>

            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped>
.mt-6 { margin-top: 24px; }
</style>