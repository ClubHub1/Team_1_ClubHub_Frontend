<script setup>
import { ref, onMounted } from 'vue'
import TaskCard from './taskCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'
import { getTasks } from '@/services/tasks'

const tasks = ref([])
const loading = ref(false)
const error = ref('')

const fetchTasks = async () => {
  loading.value = true
  error.value = ''
  try {
    tasks.value = await getTasks()
  } catch (e) {
    error.value = 'Failed to load tasks.'
    console.error('Error fetching tasks:', e)
  } finally {
    loading.value = false
  }
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
      />
      <EmptyState
        v-if="tasks.length === 0"
        message="No tasks available. Add a new task to get started!"
      />
    </div>
  </div>
</template>