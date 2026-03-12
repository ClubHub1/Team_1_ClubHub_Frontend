<script setup lang="ts">
import { ref, reactive } from 'vue'
import { feathersClient } from './backendAPI'
import useClubStore from './stores/clubStore'
import useUserStore from './stores/user'

const clubStore = useClubStore()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')
const success = ref(false)

const notifForm = reactive({
    title: '',
    message: ''
})

const titleRules = [
    (v: string) => !!v || 'Title is required.'
]
const messageRules = [
    (v: string) => !!v || 'Message is required.'
]

const valid = ref(false)
const formRef = ref()

async function saveNotification(){
    const { valid: isValid} = await formRef.value.validate()
    if(!isValid) return

    loading.value = true
    error.value = ''
    success.value = false

    try{
        const payload = {
            club: clubStore.id,
            title: notifForm.title,
            message: notifForm.message,
            created_by: userStore.id
        }
        await feathersClient.service('Notifications').create(payload as any)
        success.value = true
        Object.assign(notifForm, { title: '', message: '' })
        formRef.value.reset()
    }
    catch (err: any){
        error.value = err.message ?? 'Something went wrong. Please try again.'
        console.error('NOTIFICATION CREATE ERROR:', err)
    }
    finally{
        loading.value = false
    }
}
</script>

<template>
    <v-container max-width="800" class="py-8">
        <v-row align ="center" class="mb-6">
            <v-col>
                <h2 class="text-h5 font-weight-bold">Notification Editor</h2>
            </v-col>
        </v-row>

        <v-card rounded="lg" color="grey-lighten-3" elevation="0">
            <v-card-text class="pa-6">
                <v-form ref="formRef" v-model="valid" @submit.prevent="saveNotification">
                    
                    <v-row align="center" class="mb-4">
                        <v-col cols="3">
                            <span class="text-body-1 font-weight-bold">Title:</span>
                        </v-col>
                        <v-col cols="9" sm="5">
                            <v-text-field
                                v-model="notifForm.title"
                                :rules="titleRules"
                                density="compact"
                                variant="solo"
                                hide-details="auto"
                                bg-color="white"
                                rounded="md"
                            />
                        </v-col>
                    </v-row>

                    <v-row align="start" class="mb-6">
                        <v-col cols = "3">
                            <span class="text-body-1 font-weight-bold">Message:</span>
                        </v-col>
                        <v-col cols="9">
                            <v-textarea
                                v-model="notifForm.message"
                                :rules="messageRules"
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
                            <v-alert type="success" variant="tonal" rounded="lg">Notification sent successfully!</v-alert>
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
                            >Publish</v-btn>
                        </v-col>
                    </v-row>
                    
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>

</template>