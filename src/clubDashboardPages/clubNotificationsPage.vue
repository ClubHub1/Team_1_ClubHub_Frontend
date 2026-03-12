<script setup lang="ts">
import { ref, reactive } from 'vue'
import { feathersClient } from '../backendAPI'
import useClubStore from '../stores/clubStore'
import useUserStore from '../stores/user'

const clubStore = useClubStore()
const userStore = useUserStore()

const loading = ref(false)
const error   = ref('')
const success  = ref(false)

const notifForm = reactive({
    title:   '',
    message: ''
})

const titleRules   = [(v: string) => !!v || 'Title is required.']
const messageRules = [(v: string) => !!v || 'Message is required.']

const valid   = ref(false)
const formRef = ref()

async function saveNotification() {
    const { valid: isValid } = await formRef.value.validate()
    if (!isValid) return

    loading.value = true
    error.value   = ''
    success.value  = false

    try {
        const payload = {
            club:       clubStore.id,
            title:      notifForm.title,
            message:    notifForm.message,
            created_by: userStore.id
        }
        await feathersClient.service('Notifications').create(payload as any)
        success.value = true
        Object.assign(notifForm, { title: '', message: '' })
        formRef.value.reset()
    } catch (err: any) {
        error.value = err.message ?? 'Something went wrong. Please try again.'
        console.error('NOTIFICATION CREATE ERROR:', err)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <v-card>
        <v-card-title>Create Announcement</v-card-title>
        <v-card-text>

            <v-alert
                v-if="success"
                type="success"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="success = false"
            >
                Notification sent successfully!
            </v-alert>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                {{ error }}
            </v-alert>

            <v-form ref="formRef" v-model="valid" @submit.prevent="saveNotification">

                <v-text-field
                    v-model="notifForm.title"
                    :rules="titleRules"
                    label="Title"
                    required
                />

                <v-textarea
                    v-model="notifForm.message"
                    :rules="messageRules"
                    label="Message"
                    rows="4"
                />

                <v-row class="mt-2">
                    <v-col>
                        <v-btn type="submit" color="primary" :loading="loading">
                            Publish
                        </v-btn>
                    </v-col>
                </v-row>

            </v-form>
        </v-card-text>
    </v-card>
</template>