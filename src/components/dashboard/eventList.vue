<script setup>
    import EventCard from '@/components/events/eventCard.vue'
    import EmptyState from '@/components/dashboard/emptyState.vue'
    //MOCK DATA - to be replaced with API call
    const events = [
    {
        id: 1,
        title: 'Welcome Night',
        date: '2024-09-01',
        time: '18:00',
        location: 'Main Hall',
    },
    {
        id: 2,
        title: 'Tech Talk',
        date: '2024-09-10',
        time: '15:00',
        location: 'Room 101',
    },
    {
        id: 3,
        title: 'Social Gathering',
        date: '2024-09-15',
        time: '19:00',
        location: 'LME',
    },
    ]
</script>

<template>
    <div class="eventList">
        <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        />
        <EmptyState v-if="events.length === 0" message="No upcoming events. Stay tuned for updates!" />
    </div>
</template>