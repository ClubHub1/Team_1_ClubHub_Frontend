<script setup lang="ts">
import { ref, reactive } from 'vue'
import { feathersClient } from '@/backendAPI'
import useClubStore from '@/stores/clubStore'

const clubStore = useClubStore()
const emit = defineEmits(['view-events'])
const loading = ref(false)
const error = ref('')
const success = ref(false)
const eventCreationDialog = ref(false)
const valid = ref(false)
const formRef = ref()

const eventForm = reactive({
  title: '',
  datetime: '',
  location: '',
  description: ''
})

const titleRules = [(v: string) => !!v || 'Title is required.']
const dateRules = [(v: string) => !!v || 'Date and time is required.']
const locationRules = [(v: string) => !!v || 'Location is required.']

async function saveEvent() {
  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await feathersClient.service('Event').create({
      club: clubStore.id,
      name: eventForm.title,
      start_datetime: eventForm.datetime,
      end_datetime: eventForm.datetime,
      location: eventForm.location,
      description: eventForm.description,
      created_at: new Date(),
    } as any)
    success.value = true
    Object.assign(eventForm, { title: '', datetime: '', location: '', description: '' })
    formRef.value.reset()
    eventCreationDialog.value = true
  } catch (err: any) {
    error.value = err.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function keepCreatingEvents() {
  eventCreationDialog.value = false
  success.value = false
}

function goToEventList() {
  eventCreationDialog.value = false
  success.value = false
  emit('view-events')
}
</script>

<template>
  <v-card elevation="2" rounded="lg">
    <v-card-text class="pa-6">
      <v-alert v-if="success && !eventCreationDialog" type="success" variant="tonal" rounded="lg" class="mb-5" closable @click:close="success = false">
        <v-icon start>mdi-check-circle</v-icon> Event created successfully!
      </v-alert>
      <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-5">{{ error }}</v-alert>

      <v-form ref="formRef" v-model="valid" @submit.prevent="saveEvent">
        <p class="text-overline text-primary mb-3">Event Details</p>
        <v-text-field
          v-model="eventForm.title"
          :rules="titleRules"
          label="Event Title"
          prepend-inner-icon="mdi-format-title"
          variant="outlined"
          class="mb-3"
          required
        />

        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="eventForm.datetime"
              :rules="dateRules"
              label="Date and Time"
              type="datetime-local"
              prepend-inner-icon="mdi-calendar-clock"
              variant="outlined"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="eventForm.location"
              :rules="locationRules"
              label="Location"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              required
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />
        <p class="text-overline text-primary mb-3">Description</p>
        <v-textarea
          v-model="eventForm.description"
          label="Event description (optional)"
          prepend-inner-icon="mdi-text-box"
          variant="outlined"
          rows="4"
        />

        <div class="d-flex justify-end gap-3 mt-4">
          <v-btn variant="outlined" color="secondary" @click="formRef?.reset()" :disabled="loading">Clear</v-btn>
          <v-btn type="submit" color="primary" rounded="lg" :loading="loading" prepend-icon="mdi-calendar-plus">
            Create Event
          </v-btn>
        </div>
      </v-form>
    </v-card-text>

    <v-dialog v-model="eventCreationDialog" max-width="440" persistent>
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center ga-3">
          <v-avatar color="success" variant="tonal" size="36">
            <v-icon color="success">mdi-check</v-icon>
          </v-avatar>
          <span class="text-h6">Event created</span>
        </v-card-title>
        <v-card-text class="pt-2">
          Would you like to create another event for this club?
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" color="grey" @click="goToEventList">
            View Events
          </v-btn>
          <v-btn color="primary" rounded="lg" prepend-icon="mdi-calendar-plus" @click="keepCreatingEvents">
            Create Another
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
