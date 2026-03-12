<script setup lang="ts">
import { ref, reactive } from 'vue'
import { feathersClient } from '../backendAPI'
import useClubStore from '@/stores/clubStore'

const clubStore = useClubStore()

const loading = ref(false)
const error   = ref('')
const success  = ref(false)

const eventForm = reactive({
    title: '',
    startDatetime: '',
    endDatetime: '',
    location: '',
    description: ''
})

const titleRules = [
    (v: string) => !!v || 'Title is required.'
]
const startDateRules = [
    (v: string) => !!v || 'Start date and time is required.'
]
const endDateRules = [
    (v: string) => !!v || 'End date and time is required.',
    (v: string) => {
        if(!eventForm.startDatetime) return true
        return new Date(v) > new Date(eventForm.startDatetime) || 'End date must be after start date.'
    }
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
    
    const created = new Date()

    /*
    {
    event_id: Type.Number(),
    club: Type.Number(),
    name: Type.String(),
    description: Type.String(),
    start_datetime: Type.Optional(Type.String()),
    end_datetime: Type.Optional(Type.String()),
    location: Type.String(),
    created_at: Type.String()
    },
    */

    try {
        const payload = {
        club: clubStore.id,
        name: eventForm.title,
        start_datetime: eventForm.startDatetime,
        end_datetime: eventForm.endDatetime,
        location: eventForm.location,
        description: eventForm.description,
        created_at: created
        }
        await feathersClient.service('Event').create(payload as any)
        success.value = true
        // Reset form after successful save
        Object.assign(eventForm, { title: '', startDatetime: '', endDatetime: '', location: '', description: '' })
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
    <v-card>
        <v-card-title>Create Event</v-card-title>
        <v-card-text>
 
            <v-alert v-if="success" type="success" variant="tonal" class="mb-4" closable @click:close="success = false">
                Event created successfully!
            </v-alert>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                {{ error }}
            </v-alert>
 
            <v-form ref="formRef" v-model="valid" @submit.prevent="saveEvent">
 
                <v-text-field
                    v-model="eventForm.title"
                    :rules="titleRules"
                    label="Title"
                    required
                />
 
                <v-textarea
                    v-model="eventForm.description"
                    label="Description"
                    rows="3"
                />
 
                <!-- Start / End side by side — mirrors Priority / Status row -->
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            v-model="eventForm.startDatetime"
                            :rules="startDateRules"
                            label="Start Date and Time"
                            type="datetime-local"
                            prepend-inner-icon="mdi-clock-start"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="eventForm.endDatetime"
                            :rules="endDateRules"
                            label="End Date and Time"
                            type="datetime-local"
                            prepend-inner-icon="mdi-clock-end"
                            :min="eventForm.startDatetime"
                        />
                    </v-col>
                </v-row>
 
                <!-- Location — mirrors Due Date row -->
                <v-text-field
                    v-model="eventForm.location"
                    :rules="locationRules"
                    label="Location"
                    prepend-inner-icon="mdi-map-marker"
                />
 
                <v-row class="mt-2">
                    <v-col>
                        <v-btn type="submit" color="primary" :loading="loading">
                            Create Event
                        </v-btn>
                    </v-col>
                </v-row>
 
            </v-form>
        </v-card-text>
    </v-card>
</template>