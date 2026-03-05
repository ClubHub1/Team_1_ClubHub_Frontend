<script setup>
defineProps({
  clubEvent: {
    type: Object,
    required: true
  }
})
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
        {{ clubEvent.title }}
      </span>

      <v-btn
        variant="flat"
        color="grey-darken-3"
        size="small"
        rounded="sm"
        class="align-self-start"
      >
        Edit
      </v-btn>

    </v-card-text>
  </v-card>
</template>