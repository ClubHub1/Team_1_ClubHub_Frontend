<script setup>
defineProps({
  clubEvent: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="eventCard">
    <div class="eventTitle">{{ clubEvent.title }}</div>
    <button class="eventAction">Edit</button>
  </div>
</template>

<style scoped>
.eventCard {
  background: #d3d0d0;
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.eventTitle {
  font-weight: 600;
  font-size: 1rem;
}

.eventAction {
  align-self: flex-start;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 0.8rem;
  cursor: pointer;
}

.eventAction:hover {
  background: #555;
}
</style>