<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import useUserStore from './stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const valid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const emailRules = [
  (v: string) => !!v || 'E-mail is required.',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
]
const passwordRules = [
  (v: string) => !!v || 'Password is required.',
]

async function handleSubmit() {
  if (!valid.value) return
  error.value = ''
  loading.value = true
  try {
    authStore.clearError()
    const res = await authStore.authenticate({
      strategy: 'local',
      school_email: email.value,
      password: password.value,
    })
    if (res) {
      userStore.setEmail(res.User?.email)
      userStore.setId(res.User?.id)
      userStore.setFirstName(res.User?.first_name)
      userStore.setLastName(res.User?.last_name)
    }
    const redirectTo = authStore.loginRedirect || '/dashboard'
    authStore.loginRedirect = null
  } catch (e: any) {
    error.value = authStore.error?.message || 'Login failed. Please check your email and password.'
  } finally {
    loading.value = false
    if (authStore.isAuthenticated) router.push('/dashboard')
  }
}
</script>

<template>
  <v-app>
    <v-main style="background: #f5f5f5;">
      <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
        <v-row justify="center" align="center" style="width: 100%; gap: 16px;" no-gutters>

          <!-- Left accent panel -->
          <v-col cols="12" md="5" class="d-none d-md-flex">
            <v-card
              color="primary"
              rounded="lg"
              elevation="0"
              class="pa-10 d-flex flex-column justify-center"
              style="height: 480px; width: 100%;"
            >
              <v-icon size="48" color="white" class="mb-6">mdi-account-group</v-icon>
              <h1 class="text-h3 font-weight-bold text-white mb-4">Welcome<br/>Back.</h1>
              <p class="text-white" style="opacity: 0.8; font-size: 1.1rem;">
                Sign in to manage your clubs, track events, and stay connected with your campus community.
              </p>
            </v-card>
          </v-col>

          <!-- Login form -->
          <v-col cols="12" md="5">
            <v-card rounded="lg" elevation="2" class="pa-8" style="height: 480px;">
              <div class="mb-6">
                <h2 class="text-h5 font-weight-bold mb-1">Sign In</h2>
                <p class="text-medium-emphasis">Enter your UNR credentials to continue.</p>
              </div>

              <v-alert v-if="authStore.error" type="error" variant="tonal" rounded="lg" class="mb-4">
                {{ authStore.error.message }}
              </v-alert>

              <v-form v-model="valid" @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Email Address"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  class="mb-3"
                  required
                />
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  class="mb-5"
                  required
                  @click:append-inner="showPassword = !showPassword"
                />

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded="lg"
                  :loading="loading"
                  :disabled="!valid"
                  prepend-icon="mdi-login"
                >Sign In</v-btn>
              </v-form>

              <v-divider class="my-5" />
              <p class="text-center text-body-2 text-medium-emphasis">
                Don't have an account?
                <router-link to="/register" class="text-primary font-weight-medium">Register Here</router-link>
              </p>
            </v-card>
          </v-col>

        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>