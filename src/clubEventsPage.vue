<script setup lang="ts">
import { ref, reactive } from 'vue'
import { feathersClient } from '@/backendAPI'
import useClubStore from '@/stores/clubStore'

const clubStore = useClubStore()

const loading = ref(false)
const error   = ref('')
const success  = ref(false)

const eventForm = reactive({
    title: '',
    datetime: '',
    location: '',
    description: ''
})

const titleRules = [
    (v: string) => !!v || 'Title is required.'
]
const dateRules = [
    (v: string) => !!v || 'Date and time is required.'
]
const locationRules = [
    (v: string) => !!v || 'Location is required.'
]

const valid = ref(false)
const formRef = ref()

async function saveEvent() {
    const { valid: isValid } = await formRef.value.validate()
    if (!isValid) return

    loading.value = true
    error.value = ''
    success.value = false

    try {
        const payload = {
        clubid: clubStore.id,
        title: eventForm.title,
        datetime: eventForm.datetime,
        location: eventForm.location,
        description: eventForm.description
        }
        await feathersClient.service('Event').create(payload as any)
        success.value = true
        // Reset form after successful save
        Object.assign(eventForm, { title: '', datetime: '', location: '', description: '' })
        formRef.value.reset()
    } catch (err: any) {
        error.value = err.message ?? 'Something went wrong. Please try again.'
        console.error('EVENT CREATE ERROR:', err)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <v-container max-width="800" class="py-8">

    <v-row align="center" class="mb-6">
        <v-col>
        <h2 class="text-h5 font-weight-bold">Event Editor</h2>
        </v-col>
    </v-row>

    <v-card rounded="lg" color="grey-lighten-3" elevation="0">
        <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="saveEvent">
            <v-row align="center" class="mb-4">
            <v-col cols="3">
                <span class="text-body-1 font-weight-bold">Title:</span>
            </v-col>
            <v-col cols="9" sm="5">
                <v-text-field
                v-model="eventForm.title"
                :rules="titleRules"
                density="compact"
                variant="solo"
                hide-details="auto"
                bg-color="white"
                rounded="md"
                />
            </v-col>
            </v-row>

            <v-row align="center" class="mb-4">
            <v-col cols="3">
                <span class="text-body-1 font-weight-bold">Date and Time:</span>
            </v-col>
            <v-col cols="9" sm="5">
                <v-text-field
                v-model="eventForm.datetime"
                :rules="dateRules"
                type="datetime-local"
                density="compact"
                variant="solo"
                hide-details="auto"
                bg-color="white"
                rounded="md"
                />
            </v-col>
            </v-row>

            <v-row align="center" class="mb-4">
            <v-col cols="3">
                <span class="text-body-1 font-weight-bold">Location:</span>
            </v-col>
            <v-col cols="9">
                <v-text-field
                v-model="eventForm.location"
                :rules="locationRules"
                density="compact"
                variant="solo"
                hide-details="auto"
                bg-color="white"
                rounded="md"
                />
            </v-col>
            </v-row>

            <v-row align="start" class="mb-6">
            <v-col cols="3">
                <span class="text-body-1 font-weight-bold">Description:</span>
            </v-col>
            <v-col cols="9">
                <v-textarea
                v-model="eventForm.description"
                density="compact"
                variant="solo"
                hide-details="auto"
                bg-color="white"
                rounded="md"
                rows="5"
                no-resize
                />
            </v-col>
            </v-row>

            <v-row v-if="error" class="mb-4">
            <v-col>
                <v-alert type="error" variant="tonal" rounded="lg">{{ error }}</v-alert>
            </v-col>
            </v-row>

            <v-row v-if="success" class="mb-4">
            <v-col>
                <v-alert type="success" variant="tonal" rounded="lg">Event created successfully!</v-alert>
            </v-col>
            </v-row>

            <v-row justify="end">
            <v-col cols="auto">
                <v-btn
                type="submit"
                color="blue-darken-4"
                rounded="pill"
                size="large"
                min-width="160"
                :loading="loading"
                >Save
                </v-btn>
            </v-col>
            </v-row>

        </v-form>
        </v-card-text>
    </v-card>

    </v-container>
</template>