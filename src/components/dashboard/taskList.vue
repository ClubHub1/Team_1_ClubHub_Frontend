<script setup>
import TaskCard from '@/components/dashboard/taskCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'

// MOCK DATA - replace with API call
const tasks = [
  { id: 1, title: 'Finish Finance Request',         daysUntilDue: 1  },
  { id: 2, title: 'Order Food for Welcome Night',   daysUntilDue: 5  },
  { id: 3, title: 'Make Competition Interest Form', daysUntilDue: 7  },
  { id: 4, title: 'Send out Workshop Notification', daysUntilDue: 10 },
]
</script>

<template>
  <div>
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
</template>