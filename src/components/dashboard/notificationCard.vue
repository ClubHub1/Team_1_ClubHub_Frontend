<script setup>
defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['dismiss'])

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <v-card
    rounded="lg"
    elevation="0"
    color="grey-lighten-3"
    class="mb-2"
  >
    <v-card-text class="pa-3">
      <div class="d-flex align-start ga-3">
        <v-avatar color="primary" variant="tonal" size="32" class="flex-shrink-0">
          <v-icon icon="mdi-bullhorn-outline" color="primary" size="18" />
        </v-avatar>
        <div class="flex-grow-1">
          <div class="text-body-2 font-weight-bold">{{ notification.title }}</div>
          <div class="text-caption text-medium-emphasis">
            {{ notification.clubName }}<span v-if="notification.created_at"> · {{ formatDate(notification.created_at) }}</span>
          </div>
          <p class="text-body-2 ma-0 mt-1">{{ notification.message }}</p>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="x-small"
          color="grey-darken-2"
          aria-label="Dismiss notification"
          class="flex-shrink-0"
          @click="emit('dismiss', notification.id)"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
