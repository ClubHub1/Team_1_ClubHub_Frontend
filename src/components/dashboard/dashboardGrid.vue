<template>
  <v-row class="dashboard-grid" align="stretch">
    <slot />
  </v-row>
</template>

<style scoped>
.dashboard-grid {
  column-gap: 32px;
  row-gap: 24px;
  margin-inline: 0;
}
</style>
