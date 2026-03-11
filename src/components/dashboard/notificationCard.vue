<script setup>
defineProps({
  notification: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <v-card
    rounded="lg"
    elevation="0"
    color="grey-lighten-3"
    class="mb-2"
  >
    <v-card-text class="d-flex align-center ga-3 pa-3">
      <v-btn
        icon="mdi-close"
        variant="outlined"
        size="x-small"
        color="grey-darken-3"
        aria-label="Dismiss notification"
        class="flex-shrink-0"
      />
      <span class="text-body-2">{{ notification.message }}</span>
    </v-card-text>
  </v-card>
</template>