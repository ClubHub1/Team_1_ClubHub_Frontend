<script setup>
defineProps({
  title: String,
  actionText: String,
  // col width at each breakpoint — defaults match the 3-column layout
  cols: { type: [String, Number], default: 12 },
  sm:   { type: [String, Number], default: 12 },
  md:   { type: [String, Number], default: 4  },
})
</script>

<template>
  <v-col :cols="cols" :sm="sm" :md="md">
    <v-card rounded="lg" elevation="0" color="grey-lighten-3">
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4 pb-2">
        <span class="text-subtitle-1 font-weight-bold">{{ title }}</span>
        <v-btn
          v-if="actionText"
          variant="outlined"
          size="small"
          density="comfortable"
        >
          {{ actionText }}
        </v-btn>
      </v-card-title>

      <v-card-text class="px-3 pb-3">
        <slot />
      </v-card-text>
    </v-card>
  </v-col>
</template>