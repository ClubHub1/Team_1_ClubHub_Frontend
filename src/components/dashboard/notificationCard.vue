<script setup>
defineProps({
  notification: Object
})
</script>

<template>
    <div class="notificationCard" :class="{ unread: !notification.read }">
        <div class="notificationContent">
            {{ notification.message }}
        </div>
        <div class="notificationDate">
            {{ new Date(notification.date).toLocaleDateString() }}
        </div>
    </div>
</template>
