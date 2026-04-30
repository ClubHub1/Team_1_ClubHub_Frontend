<script setup>
defineProps({
  clubEvent: {
    type: Object,
    required: true
  }
})

function formatDatetime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  })
}
</script>

<template>
  <v-card
    color="grey-lighten-2"
    rounded="lg"
    elevation="0"
    class="mb-2"
  >
    <v-card-text class="d-flex flex-column ga-2 pa-3">

      <span class="text-body-1 font-weight-bold">
        {{ clubEvent.name }}
      </span>

      <div class="d-flex align-center ga-1 text-body-2 text-medium-emphasis">
        <v-icon icon="mdi-account-group-outline" size="14" />
        {{ clubEvent.clubName || 'Unknown Club' }}
      </div>

      <div class="d-flex align-center ga-1 text-body-2 text-medium-emphasis">
        <v-icon icon="mdi-clock-outline" size="14" />
        {{ formatDatetime(clubEvent.start_datetime) }}
      </div>

      <div class="d-flex align-center ga-1 text-body-2 text-medium-emphasis">
        <v-icon icon="mdi-map-marker-outline" size="14" />
        {{ clubEvent.location || '—' }}
      </div>

    </v-card-text>
  </v-card>
</template>
