<script setup>
import { ref, onMounted } from 'vue'
import { feathersClient } from '@/backendAPI'
import useUserStore from '@/stores/user'
import NotificationCard from '@/components/dashboard/notificationCard.vue'
import EmptyState from '@/components/dashboard/emptyState.vue'

const userStore = useUserStore()
const notifications = ref([])
const loading = ref(false)
const error = ref('')

const dismissedStorageKey = () => `dismissed-notifications:${userStore.id ?? 'anonymous'}`

const getDismissedNotificationIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(dismissedStorageKey()) ?? '[]').map(String))
  } catch {
    return new Set()
  }
}

const saveDismissedNotificationIds = (ids) => {
  localStorage.setItem(dismissedStorageKey(), JSON.stringify([...ids]))
}

const dismissNotification = (notificationId) => {
  const dismissedIds = getDismissedNotificationIds()
  dismissedIds.add(String(notificationId))
  saveDismissedNotificationIds(dismissedIds)
  notifications.value = notifications.value.filter((notification) => notification.id !== notificationId)
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const dismissedIds = getDismissedNotificationIds()
    const membershipRes = await feathersClient.service('ClubMembership').find({
      query: { $select: ['clubid'], userid: userStore.id, is_active: true },
    })
    const clubIds = [...new Set((membershipRes.data ?? []).map((membership) => membership.clubid))]

    if (clubIds.length === 0) {
      notifications.value = []
      return
    }

    const clubRes = await feathersClient.service('Club').find({
      query: { club_id: { $in: clubIds }, $select: ['club_id', 'name'] },
    })
    const clubMap = new Map((clubRes.data ?? []).map((club) => [String(club.club_id), club.name]))

    const notificationRes = await feathersClient.service('Notifications').find({
      query: { club: { $in: clubIds }, $limit: 50 },
    })
    notifications.value = (notificationRes.data ?? [])
      .filter((notification) => clubMap.has(String(notification.club)))
      .filter((notification) => !dismissedIds.has(String(notification.id)))
      .map((notification) => ({
        ...notification,
        clubName: clubMap.get(String(notification.club)) ?? 'Unknown Club',
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  } catch (e) {
    error.value = 'Failed to load notifications.'
    console.error('NOTIFICATION LIST ERROR:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="loading">Loading notifications...</div>
    <div v-else-if="error" class="text-error text-body-2">{{ error }}</div>
    <div v-else>
      <NotificationCard
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @dismiss="dismissNotification"
      />
      <EmptyState
        v-if="notifications.length === 0"
        message="No new notifications at the moment."
      />
    </div>
  </div>
</template>
