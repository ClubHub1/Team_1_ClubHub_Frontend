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
const clubName = 'Nevada Cyber Club'
const currentDate = new Date

</script>

<template>
  <v-main>
    <v-row class="ml-15 mr-15">

        <h1 class="text-h4 font-weight-bold mb-3">Hey there, {{ name }}!</h1>
        <v-spacer></v-spacer>
          <v-chip
            color="primary"
            variant="flat"
            size="large"
            rounded="lg"
            class="px-5 text-body-2 font-weight-medium mb-3"
          >
            {{currentDate.toLocaleDateString()}}
          </v-chip>
        <v-divider thickness="2" color="grey-darken-3" class="mb-4" />
      </v-row>
      <v-row class="ml-15">
        <div class="d-flex ga-3">
          <!-- Swap out for real logo with :src when available -->
          <v-avatar color="grey-lighten-2" size="40">
            <v-icon icon="mdi-account-group" color="grey-darken-1" />
          </v-avatar>
          <v-btn color="default" class="text-body-1 font-italic text-medium-emphasis mb-10" to='/clubsList'>View Your Clubs</v-btn>
        </div>

      </v-row>
        
    <DashboardLayout>
    <v-row>
    <DashboardGrid>
      <DashboardSection title="Events" :md="4">
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
  </v-main>
</template>