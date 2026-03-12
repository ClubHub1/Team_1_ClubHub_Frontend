<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { feathersClient } from '@/backendAPI'
import useClubStore from '@/stores/clubStore'
import EventCard from '@/components/dashboard/eventCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'

const clubStore = useClubStore()
const events = ref<any[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await (feathersClient.service('Event') as any).find({
      query: {
        club: clubStore.id,
        start_datetime: { $gte: new Date().toISOString() },
        $sort: { start_datetime: 1 },
        $limit: 5
      }
    })
    events.value = res.data ?? []
  } catch (e: any) {
    error.value = 'Failed to load events.'
    console.error('EVENT LIST ERROR:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="eventList">
    <div v-if="loading">Loading events...</div>
    <div v-else-if="error" class="text-error text-body-2">{{ error }}</div>
    <div v-else>
      <EventCard
        v-for="event in events"
        :key="event.event_id"
        :clubEvent="event"
      />
      <EmptyState
        v-if="events.length === 0"
        message="No upcoming events. Stay tuned for updates!"
      />
    </div>
  </div>
</template>

<style scoped>
.eventList {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>