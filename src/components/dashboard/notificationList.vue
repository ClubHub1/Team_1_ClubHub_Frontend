<script setup>
import NotificationCard from '@/components/dashboard/notificationCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'
import NotificationCard from '@/components/dashboard/notificationCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'

// MOCK DATA - replace with API call
const notifications = [
  { id: 1, message: 'Welcome Night is about to start!',  date: '2024-09-01', read: false },
  { id: 2, message: 'RSVP for the upcoming workshop!',   date: '2024-08-30', read: true  },
  { id: 3, message: 'Dues are due on 9/30!',             date: '2024-08-28', read: false },
  { id: 4, message: 'New Event: Social @ 9/10',          date: '2024-08-25', read: true  },
]
// MOCK DATA - replace with API call
const notifications = [
  { id: 1, message: 'Welcome Night is about to start!',  date: '2024-09-01', read: false },
  { id: 2, message: 'RSVP for the upcoming workshop!',   date: '2024-08-30', read: true  },
  { id: 3, message: 'Dues are due on 9/30!',             date: '2024-08-28', read: false },
  { id: 4, message: 'New Event: Social @ 9/10',          date: '2024-08-25', read: true  },
]
</script>

<template>
  <div>
    <NotificationCard
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
    <EmptyState
      v-if="notifications.length === 0"
      message="No new notifications at the moment."
    />
    <v-btn
      variant="flat"
      color="primary"
      size="small"
      rounded="md"
      class="mt-2"
    >
      Add New Notification
    </v-btn>
  </div>
</template>