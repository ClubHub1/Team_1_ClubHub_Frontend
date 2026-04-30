<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-task'])

const badgeColor = (() => {
  const d = props.task.daysUntilDue
  if (d === 'overdue') return 'error'
  if (typeof d === 'number') {
    if (d <= 1) return 'error'           // red
    if (d <= 5) return 'warning'         // yellow/amber
    if (d <= 7) return 'success'         // green
  }
  return 'info'                        // blue
})()

const dueLabel = (() => {
  const d = props.task.daysUntilDue
  if (d === 'overdue') return 'Overdue'
  return `Due in ${d} day${d === 1 ? '' : 's'}`
})()
</script>

<template>
  <v-card
    rounded="lg"
    elevation="1"
    class="mb-2"
  >
    <v-card-text class="d-flex align-center justify-space-between pa-3">

      <div class="d-flex flex-column ga-2">
        <span class="text-body-2 font-weight-bold font-italic">{{ task.title }}</span>
        <span v-if="task.clubName" class="text-caption text-medium-emphasis">{{ task.clubName }}</span>
        <v-chip
          :color="badgeColor"
          size="small"
          label
          variant="flat"
        >
          {{ dueLabel }}
        </v-chip>
      </div>

      <v-btn
        class="ml-2"
        icon="mdi-arrow-right"
        variant="outlined"
        size="small"
        color="grey-darken-3"
        aria-label="View task"
        @click="emit('open-task', task)"
      />

    </v-card-text>
  </v-card>
</template>
