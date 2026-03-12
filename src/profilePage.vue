<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { feathersClient } from './backendAPI'
    import useUserStore from './stores/user'

    const userStore = useUserStore()

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')

    const loading = ref(false)
    const saving = ref(false)
    const error = ref('')
    const success = ref(false)
    const valid = ref(false)

    const nameRules = [
        (v: string) => !!v || 'This field is required'
    ]

    onMounted(async () => {
        loading.value = true
        error.value = ''
        try {
            const res = await feathersClient.service('User').find({
                query: {
                    id: userStore.id
                }
            })
            if (res.data.length === 1) {
                const user = res.data[0]
                firstName.value = user.first_name
                lastName.value = user.last_name
                email.value = user.email
            }
        } catch (err) {
            error.value = 'Failed to load profile. Please try again.'
            console.error(err)
        } finally {
            loading.value = false
        }
    })

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

        <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto mt-10" />

        <v-card v-else elevation="2" class="pa-4">
            <v-card-title class="mb-2">
                <v-icon icon="mdi-account-circle" size="28" class="mr-2" />
                Account Information
            </v-card-title>

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