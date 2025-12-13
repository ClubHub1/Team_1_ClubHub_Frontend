<script setup>
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import DashboardGrid from '@/components/dashboard/dashboardGrid.vue'
import DashboardSection from '@/components/dashboard/dashboardSection.vue'

import EventList from '@/components/events/eventList.vue'
import TaskList from '@/components/dashboard/taskList.vue'
import NotificationList from '@/components/dashboard/notificationList.vue'
</script>

HEADER AND CLUB NAME HARDCODED, DATE HARDCODED
will be retrieved from user profile when user is logged in
<template>
  <DashboardLayout>
    <section class="dashboard-header">
      <div class="header-left">
        <h1>Hey there, Officer!</h1>
        <p class="club-name">Nevada Cyber Club</p>
      </div>

      <div class="header-right">
        <span class="date-pill">August 25, 2025</span>
      </div>
    </section>
    <DashboardGrid>
      <DashboardSection title="Events">
        <EventList />
      </DashboardSection>
      <DashboardSection
        title="Tasks">
        <TaskList />
      </DashboardSection>
      <DashboardSection title="Notifications">
        <NotificationList />
      </DashboardSection>
    </DashboardGrid>
  </DashboardLayout>
</template>

