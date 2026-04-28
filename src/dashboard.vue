<script setup>
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import DashboardGrid from '@/components/dashboard/dashboardGrid.vue'
import DashboardSection from '@/components/dashboard/dashboardSection.vue'
import EventList from '@/components/dashboard/eventList.vue'
import TaskList from '@/components/dashboard/taskList.vue'
import NotificationList from '@/components/dashboard/notificationList.vue'
import useUserStore from './stores/user'

const userStore = useUserStore()
const name = userStore.firstName
const currentDate = new Date()
</script>

<template>
  <v-main>
    <v-container max-width="1200" class="py-8">

      <!-- Page Header -->
      <div class="d-flex align-center justify-space-between mb-2">
        <div>
          <h1 class="text-h4 font-weight-bold">Hey there, {{ name }}!</h1>
          <p class="text-medium-emphasis mt-1">Here's what's happening with your clubs today.</p>
        </div>
        <v-chip color="primary" variant="tonal" size="large" rounded="lg" class="px-5 font-weight-medium">
          {{ currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }) }}
        </v-chip>
      </div>

      <v-divider class="mb-6" />

      <!-- Quick Nav to Clubs -->
      <v-card elevation="1" rounded="lg" class="pa-4 mb-6">
        <div class="d-flex align-center gap-4">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon color="primary">mdi-account-group</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <p class="font-weight-medium ma-0">Your Organizations</p>
            <p class="text-caption text-medium-emphasis ma-0">Access and manage your clubs</p>
          </div>
          <v-btn color="primary" variant="flat" rounded="lg" size="small" prepend-icon="mdi-arrow-right" to="/clubsList">
            View Your Clubs
          </v-btn>
        </div>
      </v-card>

      <!-- Dashboard Widgets -->
      <DashboardLayout>
        <v-row>
          <DashboardGrid>
            <DashboardSection title="Upcoming Events" :md="4">
              <EventList />
            </DashboardSection>

            <DashboardSection title="Tasks" :md="4">
              <TaskList />
            </DashboardSection>

            <DashboardSection title="Notifications" :md="4">
              <NotificationList />
            </DashboardSection>
          </DashboardGrid>
        </v-row>
      </DashboardLayout>

    </v-container>
  </v-main>
</template>