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

const nameRules = [(v: string) => !!v || 'This field is required.']

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
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-container class="py-8" max-width="700">

    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">My Profile</h1>
        <p class="text-medium-emphasis mt-1">Manage your account information.</p>
      </div>
      <v-avatar color="primary" size="52" variant="tonal">
        <v-icon size="28">mdi-account</v-icon>
      </v-avatar>
    </div>

    <!-- Account Info Card -->
    <v-card elevation="2" rounded="lg">
      <v-card-text class="pa-6">

        <div class="d-flex align-center mb-5">
          <v-avatar color="primary" size="64" class="mr-4">
            <span class="text-h5 text-white font-weight-bold">
              {{ (userStore.firstName?.[0] ?? '') }}{{ (userStore.lastName?.[0] ?? '') }}
            </span>
          </v-avatar>
          <div>
            <p class="text-h6 font-weight-bold ma-0">{{ userStore.firstName }} {{ userStore.lastName }}</p>
            <p class="text-medium-emphasis text-body-2 ma-0">{{ userStore.email }}</p>
          </div>
        </div>

        <v-divider class="mb-5" />

        <p class="text-overline text-primary mb-4">Edit Information</p>

        <v-alert v-if="success" type="success" variant="tonal" rounded="lg" class="mb-4" closable @click:close="success = false">
          Profile updated successfully!
        </v-alert>
        <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>

        <v-form v-model="valid" @submit.prevent="saveProfile">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="firstName"
                label="First Name"
                :rules="nameRules"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                :rules="nameRules"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                required
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="email"
            label="Email Address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            readonly
            disabled
            class="mb-4"
            hint="Email cannot be changed."
            persistent-hint
          />

          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="primary"
              rounded="lg"
              :loading="saving"
              :disabled="!valid"
              prepend-icon="mdi-content-save"
            >Save Changes</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>