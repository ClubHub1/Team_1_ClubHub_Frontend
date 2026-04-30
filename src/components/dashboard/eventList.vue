<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { feathersClient } from '@/backendAPI'
import useUserStore from '@/stores/user'
import EventCard from '@/components/dashboard/eventCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'

const userStore = useUserStore()
const events = ref<any[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const membershipRes = await (feathersClient.service('ClubMembership') as any).find({
      query: { $select: ['clubid'], userid: userStore.id, is_active: true },
    })
    const clubIds = [...new Set((membershipRes.data ?? []).map((membership: any) => membership.clubid))]

    if (clubIds.length === 0) {
      events.value = []
      return
    }

    const clubRes = await (feathersClient.service('Club') as any).find({
      query: { club_id: { $in: clubIds }, $select: ['club_id', 'name'] },
    })
    const clubMap = new Map((clubRes.data ?? []).map((club: any) => [String(club.club_id), club.name]))
    const eventClubIds = [...new Set(clubIds.flatMap((id: any) => [id, String(id)]))]

    const res = await (feathersClient.service('Event') as any).find({
      query: {
        club: { $in: eventClubIds },
        start_datetime: { $gte: new Date().toISOString() },
        $sort: { start_datetime: 1 },
        $limit: 5
      }
    })
    events.value = (res.data ?? [])
      .filter((event: any) => clubMap.has(String(event.club)))
      .map((event: any) => ({
        ...event,
        clubName: clubMap.get(String(event.club)) ?? 'Unknown Club',
      }))
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
