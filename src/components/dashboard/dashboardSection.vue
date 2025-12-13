<script setup>
defineProps({
  title: String,
  actionText: String
})

</script>
<template>
  <section class="dashboard-section">
    <header class="section-header">
      <h2>{{ title }}</h2>
      <button v-if="actionText" class="section-action">
        {{ actionText }}
      </button>
    </header>

    <div class="section-content">
      <slot />
    </div>
  </section>
</template>