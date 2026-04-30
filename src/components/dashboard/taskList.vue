<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TaskCard from './taskCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'
import { getTasks } from '@/services/tasks'
import { feathersClient } from '@/backendAPI'
import useClubStore from '@/stores/clubStore'
import useUserStore from '@/stores/user'

const tasks = ref([])
const loading = ref(false)
const error = ref('')
const clubsById = ref(new Map())
const router = useRouter()
const clubStore = useClubStore()
const userStore = useUserStore()

const normalizeClubId = (id) => String(id)

const fetchTasks = async () => {
  loading.value = true
  error.value = ''
  try {
    const membershipResponse = await feathersClient.service('ClubMembership').find({
      query: { $select: ['clubid'], userid: userStore.id },
    })
    const clubIds = [...new Set(membershipResponse.data.map((membership) => membership.clubid))]
    const allowedClubIds = new Set(clubIds.map(normalizeClubId))

    if (clubIds.length === 0) {
      tasks.value = []
      clubsById.value = new Map()
      return
    }

    const clubResponse = await feathersClient.service('Club').find({
      query: { club_id: { $in: clubIds } },
    })
    clubsById.value = new Map(clubResponse.data.map((club) => [normalizeClubId(club.club_id), club]))

    const scopedTasks = await getTasks(clubIds)
    tasks.value = scopedTasks
      .filter((task) => allowedClubIds.has(normalizeClubId(task.club)))
      .map((task) => ({
        ...task,
        clubName: clubsById.value.get(normalizeClubId(task.club))?.name,
      }))
  } catch (e) {
    error.value = 'Failed to load tasks.'
    console.error('Error fetching tasks:', e)
  } finally {
    loading.value = false
  }
}

const openTaskClub = (task) => {
  const club = clubsById.value.get(normalizeClubId(task.club))

  if (!club) {
    error.value = 'You do not have access to this task.'
    return
  }

  clubStore.setName(club.name)
  clubStore.setDescription(club.description)
  clubStore.setId(club.club_id)
  clubStore.setLogoUrl(club.logo_url)
  router.push({ path: '/clubDash', query: { section: 'tasks' } })
}

onMounted(() => {
  fetchTasks()
})
</script>

<template>
  <div>
    <div v-if="loading">Loading tasks...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @open-task="openTaskClub"
      />
      <EmptyState
        v-if="tasks.length === 0"
        message="No tasks available. Add a new task to get started!"
      />
    </div>
  </div>
</template>
