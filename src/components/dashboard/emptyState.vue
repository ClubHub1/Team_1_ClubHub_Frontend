<script setup>
defineProps({
  message: String
})
</script>

<template>
  <div class="d-flex flex-column align-center justify-center py-6 ga-2">
    <v-icon icon="mdi-inbox-outline" color="grey-lighten-1" size="32" />
    <span class="text-body-2 text-medium-emphasis text-center">{{ message }}</span>
  </div>
</template>