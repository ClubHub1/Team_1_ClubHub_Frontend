<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { feathersClient } from './backendAPI'
import { useAuthStore } from './stores/auth'
import useClubStore from './stores/clubStore'
import useUserStore from './stores/user'

const registerForm = ref(null)
const authStore = useAuthStore()
const clubStore = useClubStore()
const userStore = useUserStore()
const router = useRouter()

const error = ref('')
const loading = ref(false)
const valid = ref(false)
const club_name = ref('')
const club_description = ref('')

const nameRules = [
  (v: string) => (!!v && v.length < 31) || 'Required, max 30 characters.',
]
const descRules = [
  (v: string) => (!!v && v.length < 750) || 'Required, max 750 characters.',
]

function refreshRules() {
  (registerForm.value as any)?.validate()
}

async function handleSubmit() {
  if (!valid.value) return
  error.value = ''
  loading.value = true
  try {
    const now = new Date().toISOString()
    const newClub = await feathersClient.service('Club')._create({
      name: club_name.value,
      description: club_description.value,
      created_at: now,
      activity_status: 'Active',
    }).catch((err: any) => { error.value = err.message })

    if (newClub) {
      clubStore.setDescription(newClub.description)
      clubStore.setId(newClub.club_id)
      clubStore.setName(newClub.name)

      await feathersClient.service('ClubMembership')._create({
        userid: userStore.id,
        role: 'president',
        clubid: newClub.club_id,
        is_active: true,
        dues_paid: false,
      }).catch((err: any) => { error.value = err.message })
    }
  } finally {
    loading.value = false
    if (!error.value) router.push('/clubDash')
  }
}
</script>

<template>
  <v-app>
    <v-main style="background: #f5f5f5;">
      <v-container class="d-flex align-center justify-center py-10">
        <v-row justify="center" align="start" style="width: 100%;">

          <!-- Left accent panel -->
          <v-col cols="12" md="5" class="d-none d-md-flex">
            <v-card
              color="primary"
              rounded="lg"
              elevation="0"
              class="pa-10 d-flex flex-column justify-center"
              style="min-height: 500px; width: 100%;"
            >
              <v-icon size="48" color="white" class="mb-6">mdi-trophy</v-icon>
              <h1 class="text-h3 font-weight-bold text-white mb-4">Let's take your club to the next level.</h1>
              <p class="text-white" style="opacity: 0.8; font-size: 1.05rem;">
                Register your club to get access to event management, member tracking, finances, and more.
              </p>
            </v-card>
          </v-col>

          <!-- Form -->
          <v-col cols="12" md="5">
            <v-card rounded="lg" elevation="2" class="pa-8">
              <div class="mb-6">
                <h2 class="text-h5 font-weight-bold mb-1">Create a Club</h2>
                <p class="text-medium-emphasis">Fill in the details to register your new organization.</p>
              </div>

              <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>

              <v-form ref="registerForm" v-model="valid" @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="club_name"
                  :rules="nameRules"
                  label="Club Name"
                  prepend-inner-icon="mdi-account-group"
                  variant="outlined"
                  class="mb-4"
                  required
                />

                <v-textarea
                  v-model="club_description"
                  :rules="descRules"
                  label="Description"
                  prepend-inner-icon="mdi-text-box"
                  variant="outlined"
                  rows="6"
                  counter="750"
                  class="mb-5"
                  required
                />

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded="lg"
                  :loading="loading"
                  :disabled="!valid"
                  prepend-icon="mdi-plus-circle"
                >Register Club</v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>