hardcoded notification list for dashboard view

<script setup>
    import notificationCard from '@/components/dashboard/notificationCard.vue'
    import EmptyState from '@/components/dashboard/emptyState.vue'

    //MOCK DATA - to be replaced with API call
    const notifications = [
    {
        id: 1,
        message: 'Welcome Night is about to start!',
        date: '2024-09-01',
        read: false,
    },
    {
        id: 2,
        message: 'RSVP for the next workshop!.',
        date: '2024-08-30',
        read: true,
    },
    {
        id: 3,
        message: 'Dues are due next week. Please make sure to pay on time.',
        date: '2024-08-28',
        read: false,
    },
    ]
</script>

<template>
    <div>
        <notificationCard
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        />
        <EmptyState v-if="notifications.length === 0" message="No new notifications at the moment." />
    </div>
</template>