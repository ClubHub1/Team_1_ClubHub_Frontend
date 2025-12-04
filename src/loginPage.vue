<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './components/icon.vue'
import { login } from '@/services/auth'   // uses src/services/auth.ts

const router = useRouter()

function iconClicked() {
  // navigate back to homepage (change path if yours is different)
  router.push('/')
}

const links = [
  'Home',
  'About Us',
  'Team',
  'Services',
  'Contact Us',
]

const valid = ref(false)
const email = ref('')
const password = ref('')

// Vuetify-style rules: return true or an error string
const emailRules = [
  (value: string) => {
    if (value) return true
    return 'E-mail is required.'
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  },
]

const passwordRules = [
  (value: string) => {
    if (value) return true
    return 'Password is required.'
  },
]

//login state
const loading = ref(false)
const error = ref('')

// handle form submit
async function handleSubmit() {
  // if form validation fails, don't submit
  if (!valid.value) return

  error.value = ''
  loading.value = true

  try {
    const data = await login(email.value, password.value)

    // Save user/orgs for later pages if you want
    // localStorage.setItem('user', JSON.stringify(data.user))
    // localStorage.setItem('organizations', JSON.stringify(data.organizations))

    // After successful login, send them somewhere (change route as needed)
    router.push('/homepage') // or '/dashboard' once you have one
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      'Login failed. Please check your email and password.'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <v-app>
    <v-main>

      <v-container>
        <v-row justify="center">
          <v-column >
            <v-card class = "bg-primary mt-10" height="500" width="400">
              <v-card-title class="ml-3 mt-3 mb-10">
                <h1>Welcome <br/>
                Back.</h1>
              </v-card-title>
            </v-card>
          </v-column>
          <v-column>
            <v-card class = "mt-10" height="500" width="400" text>

              <v-card-title class="text-center">
                <h2>Sign In</h2>
              </v-card-title>

              <v-container class="ml-3">
                <v-form v-model="valid" class="mt-7">

                  <v-row
                  >
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="E-mail"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

                  <v-row>
                      <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        label="Password"
                        type ="password"
                        required
                        class="mr-6"
                      ></v-text-field>
                  </v-row>

                  <v-row class="justify-center">
                    <v-btn 
                      type="submit"
                      class="mt-7 bg-primary"
                      width="100"
                    >
                      Login
                    </v-btn>
                  </v-row>

                  <v-row class="justify-center mt-6">
                    <p>Don't have an account? <router-link to="/register">Register Here!</router-link> </p>
                  </v-row>

                </v-form>
              </v-container>
            </v-card>
          </v-column>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>