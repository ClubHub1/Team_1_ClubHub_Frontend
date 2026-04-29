<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { feathersClient } from './backendAPI'
import useUserStore from './stores/user'

const registerForm = ref(null)
const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const error = ref('')
const loading = ref(false)
const valid = ref(false)
const showPassword = ref(false)

const first_name = ref('')
const last_name = ref('')
const new_email = ref('')
const new_password = ref('')
const rePassword = ref('')

const emailRules = [
  (v: string) => !!v || 'E-mail is required.',
  (v: string) => /^[a-z0-9._%+-]+@unr\.edu$/i.test(v) || 'Must be a valid UNR email (@unr.edu).',
]
const passwordRules = [
  (v: string) => !!v || 'Password is required.',
  (v: string) => v.length >= 8 || 'At least 8 characters.',
  (v: string) => /[A-Z]/.test(v) || 'At least 1 uppercase letter.',
  (v: string) => /\d/.test(v) || 'At least 1 number.',
  (v: string) => /[^A-Za-z0-9]/.test(v) || 'At least 1 special character.',
  (v: string) => v === rePassword.value || 'Passwords must match.',
]
const nameRules = [
  (v: string) => (!!v && v.length < 31) || 'Required, max 30 characters.',
]

function refreshPasswordRules() {
  (registerForm.value as any)?.validate()
}

async function handleSubmit() {
  if (!valid.value) return
  error.value = ''
  loading.value = true
  try {
    const now = new Date().toISOString()
    await feathersClient.service('User')._create({
      password: new_password.value,
      first_name: first_name.value,
      last_name: last_name.value,
      email: new_email.value,
      role: 'student',
      created_at: now,
    }).catch((err: any) => { error.value = err.message })

    if (!error.value) {
      authStore.clearError()
      const loginRes = await authStore.authenticate({
        strategy: 'local',
        email: new_email.value,
        password: new_password.value,
      })
      if (loginRes) {
        userStore.setEmail(loginRes.User?.email)
        userStore.setId(loginRes.User?.id)
        userStore.setFirstName(loginRes.User?.first_name)
        userStore.setLastName(loginRes.User?.last_name)
      }
    }
  } catch (e: any) {
    // handled above
  } finally {
    loading.value = false
    if (authStore.isAuthenticated) router.push('/dashboard')
  }
}
</script>

<template>
  <v-app>
    <v-main style="background: #f5f5f5;">
      <v-container class="d-flex align-center justify-center py-10">
        <v-row justify="center" align="start" style="width: 100%; gap: 16px;" no-gutters>

          <!-- Left accent panel -->
          <v-col cols="12" md="5" class="d-none d-md-flex">
            <v-card
              color="primary"
              rounded="lg"
              elevation="0"
              class="pa-10 d-flex flex-column justify-center"
              style="height: 620px; width: 100%;"
            >
              <v-icon size="48" color="white" class="mb-6">mdi-rocket-launch</v-icon>
              <h1 class="text-h3 font-weight-bold text-white mb-4">Let's elevate your club experience.</h1>
              <p class="text-white" style="opacity: 0.8; font-size: 1.05rem;">
                Join ClubHub to manage events, connect with members, track finances, and take your organization to the next level.
              </p>
            </v-card>
          </v-col>

          <!-- Register form -->
          <v-col cols="12" md="5">
            <v-card rounded="lg" elevation="2" class="pa-8" style="height: 620px; overflow-y: auto;">
              <div class="mb-6">
                <h2 class="text-h5 font-weight-bold mb-1">Create an Account</h2>
                <p class="text-medium-emphasis">Use your UNR email address to register.</p>
              </div>

              <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>

              <v-form ref="registerForm" v-model="valid" @submit.prevent="handleSubmit">
                <v-row dense>
                  <v-col cols="6">
                    <v-text-field
                      v-model="first_name"
                      :rules="nameRules"
                      label="First Name"
                      prepend-inner-icon="mdi-account"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="last_name"
                      :rules="nameRules"
                      label="Last Name"
                      variant="outlined"
                      required
                    />
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="new_email"
                  :rules="emailRules"
                  label="UNR Email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  class="mb-3"
                  required
                />

                <v-text-field
                  v-model="new_password"
                  :rules="passwordRules"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  hint="8+ chars, 1 uppercase, 1 number, 1 special character"
                  persistent-hint
                  class="mb-3"
                  required
                  @click:append-inner="showPassword = !showPassword"
                />

                <v-text-field
                  v-model="rePassword"
                  :rules="passwordRules"
                  label="Confirm Password"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  class="mb-5"
                  required
                  @input="refreshPasswordRules"
                />

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded="lg"
                  :loading="loading"
                  :disabled="!valid"
                  prepend-icon="mdi-account-plus"
                >Create Account</v-btn>
              </v-form>

              <v-divider class="my-5" />
              <p class="text-center text-body-2 text-medium-emphasis">
                Already have an account?
                <router-link to="/login" class="text-primary font-weight-medium">Sign in here</router-link>
              </p>
            </v-card>
          </v-col>

        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>