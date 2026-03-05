<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const badgeColor = (() => {
  const d = props.task.daysUntilDue
  if (d <= 1) return 'error'           // red
  if (d <= 5) return 'warning'         // yellow/amber
  if (d <= 7) return 'success'         // green
  return 'info'                        // blue
})()

const dueLabel = `Due in ${props.task.daysUntilDue} day${props.task.daysUntilDue === 1 ? '' : 's'}`
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
        icon="mdi-arrow-right"
        variant="outlined"
        size="small"
        color="grey-darken-3"
        aria-label="View task"
      />

    </v-card-text>
  </v-card>
</template>