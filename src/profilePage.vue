<script setup lang="ts">
    import { ref } from 'vue'
    import { feathersClient } from './backendAPI'
    import useUserStore from './stores/user'

    const userStore = useUserStore()

    const firstName = ref(userStore.firstName)
    const lastName = ref(userStore.lastName)
    const email = ref(userStore.email)

    const saving = ref(false)
    const error = ref('')
    const success = ref(false)
    const valid = ref(false)

    const nameRules = [
        (v: string) => !!v || 'This field is required'
    ]

    async function saveProfile() {
        if (!valid.value) return
        saving.value = true
        error.value = ''
        success.value = false
        try {
            await feathersClient.service('User').patch(userStore.id, {
                first_name: firstName.value,
                last_name: lastName.value,
            })
            success.value = true
        } catch (err) {
            error.value = 'Failed to save changes. Please try again.'
            console.error(err)
        } finally {
            saving.value = false
        }
    }
</script>

<template>
    <v-container class="pa-6" max-width="600">
        <h1 class="text-h4 mb-6">My Profile</h1>

        <v-card elevation="2" class="pa-4">
            <v-card-title class="mb-2">
                <v-icon icon="mdi-account-circle" size="28" class="mr-2" />
                Account Information
            </v-card-title>

            <v-card-subtitle class="text-h6 mb-4">
                {{ userStore.first_name }} {{ userStore.last_name }}
            </v-card-subtitle>

            <v-card-text>
                <v-alert v-if="success" type="success" variant="tonal" class="mb-4" closable @click:close="success = false">
                    Profile updated successfully!
                </v-alert>
                <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                    {{ error }}
                </v-alert>

                <v-form v-model="valid" @submit.prevent="saveProfile">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                v-model="firstName"
                                label="First Name"
                                :rules="nameRules"
                                prepend-inner-icon="mdi-account"
                                required
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="lastName"
                                label="Last Name"
                                :rules="nameRules"
                                required
                            />
                        </v-col>
                    </v-row>

                    <v-text-field
                        v-model="email"
                        label="Email"
                        prepend-inner-icon="mdi-email-outline"
                        readonly
                        disabled
                        class="mt-2"
                    />

                    <v-row class="mt-2" justify="end">
                        <v-col cols="auto">
                            <v-btn type="submit" color="primary" :loading="saving">
                                Save Changes
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>