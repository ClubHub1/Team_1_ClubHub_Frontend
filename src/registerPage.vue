
<script setup lang="ts">
  import { ref } from 'vue'
  import { errorMessages } from 'vue/compiler-sfc';
  import Icon from './components/icon.vue'
  import { validateHeaderName } from 'http';
  import { useAuthStore } from './stores/auth';
  import { feathersClient } from './backendAPI';

  const registerForm = ref(null)
  const show1 = ref(false)
  const show2 = ref(true)

  const router = useRouter()

  //Setup stores and logic for form submission
  const authStore = useAuthStore()
  const error = ref('')
  const loading = ref(false)

  //test for valid user input
  const valid = ref(false)

  //Store user inputs to be passed to create()
  const first_name = ref('')
  const last_name = ref('')
  const new_email = ref('')
  const new_password = ref('')
  const rePassword = ref('')

  //RULES FOR FORM
  const emailRules = [
    (value: string) => {
      if (value) return true
      return 'E-mail is required.'
    },
    (value: string) => {
      if (/^[a-z0-9._%+-]+@unr\.edu$/i.test(value)) return true
      return 'E-mail must be valid and school issued ("@unr").'
    },
  ]

  const passwordRules = [
    (value: string) => {
      if (value) return true
      return 'Password is required and passwords must match.'
    },
    (value: string) => {
      if (value.length >= 8) return true
      return 'Password must be at least 8 characters long.'
    },
    (value: string) => {
      if (/[A-Z]/.test(value)) return true
      return 'Password must contain at least 1 uppercase character.'
    },
    (value: string) => {
      if (/\d/.test(value)) return true
      return 'Password must contain at least 1 number.'
    },
    (value: string) => {
      if (/[^A-Za-z0-9]/.test(value)) return true
      return 'Password must contain at least 1 special character.'
    },
    (value: string) => {
      if (value == rePassword.value) return true
      return 'Passwords must match.'
    }
  ]

  const nameRules = [
    (value: string) => {
      if (value && (value.length < 11)) return true
      return 'Name is required and must be less than 10 characters.'
    }
  ]

  async function handleSubmit() {
  // if form validation fails, don't submit
    if (!valid.value) return

    error.value = ''
    loading.value = true

    try {
      console.log('trying registration, please wait')
      const now = new Date()
      const nowString = now.toISOString()
      console.log(nowString)
      await feathersClient.service("User")._create({
        password: new_password.value,
        first_name: first_name.value,
        last_name: last_name.value,
        email: new_email.value,
        role: 'User',
        created_at: nowString
        }
      ).catch(err =>{
        error.value = err.message
      })
      authStore.clearError()
      console.log(error.value)
      if(error.value == ''){
        console.log("Trying login")
        await authStore.authenticate({
          strategy: 'local',
          email: new_email.value,
          password: new_password.value,
        });
        const redirectTo = authStore.loginRedirect || '/dashboard'
        authStore.loginRedirect = null
      // Save user/orgs for later pages if you want
      // localStorage.setItem('user', JSON.stringify(data.user))
      // localStorage.setItem('organizations', JSON.stringify(data.organizations))

      // After successful login, send them somewhere (change route as needed)
        if(authStore.isInitDone){
          router.push(redirectTo)
        }
      }
    } catch (e: any) {
      if(error.value == ''){
        error.value =
        authStore.error.message ||
        'Login failed. Please check your email and password.'
      }
    } finally {
      loading.value = false
    }
  }
    
</script>

Method to auto-refresh form validity rules
<script lang="ts">

  export default {

    methods: {
      refreshPasswordRules(){
        this.$refs.registerForm.validate()
      },
    },
  }
</script>

<template>
  <v-app>
    <v-main>

      <v-container>
        <v-row justify="center">

            <v-card class = "bg-primary mt-10" :height="($vuetify.display.width<=822) ? 300 : 850" width="400">
              <v-card-title class="text-wrap ml-3 mt-3 mb-10" width="400">
                <h1>Let's elevate your club experience.</h1>
              </v-card-title>
            </v-card>
          
          <v-column>
            <v-card class = "mt-10" height="850" width="400" text>

              <v-card-title class="text-center">
                <h2>Create an Account</h2>
              </v-card-title>

              <v-container class="ml-3">
                <v-form ref="registerForm" v-model="valid" class="mt-7" @submit.prevent="handleSubmit">

                  <v-row
                  >
                    <v-text-field
                      v-model="first_name"
                      :rules="nameRules"
                      label="First name"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

                  <v-row
                  >
                    <v-text-field
                      v-model="last_name"
                      :rules="nameRules"
                      label="Last name"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

                  <v-row>
                    <v-text-field
                      v-model="new_email"
                      :rules="emailRules"
                      label="E-mail"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

                  <v-row>
                      <v-text-field
                        v-model="new_password"
                        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        hint="At least 8 characters, 1 uppercase, 1 number, 1 special character"
                        persistent-hint
                        :rules='passwordRules'
                        label="Password"
                        :type="show1 ? 'text' : 'password'"
                        required
                        class="mr-6 mb-5"
                        @click:append-inner="show1 = !show1"
                      ></v-text-field>
                  </v-row>

                  <v-row>
                      <v-text-field
                        v-model="rePassword"
                        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules='passwordRules'
                        label="Re-Enter Password"
                        :type="show1 ? 'text' : 'password'"
                        required
                        @input="refreshPasswordRules"
                        class="mr-6"
                        @click:append-inner="show1 = !show1"
                      ></v-text-field>
                  </v-row>

                  <!-- error from backend -->
                  <v-row v-if="error != ''" class="mt-3">
                    <v-alert type="error" variant="tonal" class="mr-6">
                      {{ error }}
                    </v-alert>
                  </v-row>

                  <v-row class="justify-center">
                    <v-btn 
                      type="submit"
                      class="mt-7 bg-primary"
                      width="100"
                      :loading = "loading"
                    >
                      Register
                    </v-btn>
                  </v-row>

                  <v-row class="justify-center mt-6">
                    Already have an account? &nbsp;  <router-link to="/login">Sign in here.</router-link>
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