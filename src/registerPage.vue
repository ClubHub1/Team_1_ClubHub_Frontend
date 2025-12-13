<script setup lang="ts">
  import { ref } from 'vue'
  import { errorMessages } from 'vue/compiler-sfc';
  import Icon from './components/icon.vue'
  import { validateHeaderName } from 'http';
  const registerForm = ''
  const show1 = ref(false)
  const show2 = ref(true)
    
</script>

Rules for Form Inputs
<script lang="ts">

  //test for valid user input
  const valid = ref(false)

  export default {

    methods: {
      refreshPasswordRules(){
        this.$refs.registerForm.validate()
      },
    },
    data: () => ({
      valid: false,
      firstname: '',
      lastname: '',
      nameRules: [
        value => {
            if (value) return true 

            return 'Name is required.'
        },
        value => {
            if(value?.length <= 10) return true
            
            return 'Name must be less than 10 characters.'
        },
      ],

      email: '',
      emailRules: [
        value => {
          if (value) return true

          return 'E-mail is required.'
        },
        value => {
          if (/.+@unr+\..+/.test(value)) return true

          return 'E-mail must be valid.'
        },
      ],

      password: '',
      rePassword: '',

      passwordRules: {

        checkSame(otherValue, errorMessage){
          return value => value == otherValue || errorMessage
        },

        requirements: [
          value => value.length >= 8 || 'Must be at least 8 characters.',
          value => !!value || 'Password is required.',
          value => /[A-Z]/.test(value) || 'Must contain at least 1 uppercase letter.',
          value => /\d/.test(value) || 'Must contain at least 1 number.',
          value => /[^A-Za-z0-9]/.test(value) || 'Must contain at least 1 special character.'
        ],
      },

    }),
  }
</script>

<template>
  <v-app>
    <v-main>

      <v-container>
        <v-row justify="center">
          <v-column >
            <v-card class = "bg-primary mt-10" height="800" width="400">
              <v-card-title class="ml-3 mt-3 mb-10">
                <h1>Let's take your <br/>
                club to the next <br/> level.</h1>
              </v-card-title>
            </v-card>
          </v-column>
          <v-column>
            <v-card class = "mt-10" height="800" width="400" text>

              <v-card-title class="text-center">
                <h2>Create an Account</h2>
              </v-card-title>

              <v-container class="ml-3">
                <v-form ref = "registerForm" v-model="valid" class="mt-7">

                  <v-row
                  >
                    <v-text-field
                      v-model="firstname"
                      :rules="nameRules"
                      label="First name"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

                  <v-row
                  >
                    <v-text-field
                      v-model="lastname"
                      :rules="nameRules"
                      label="Last name"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

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
                        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        hint="At least 8 characters, 1 uppercase, 1 number, 1 special character"
                        persistent-hint
                        :rules="[...passwordRules.requirements, passwordRules.checkSame(rePassword, 'Passwords must match.')]"
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
                        :rules="[...passwordRules.requirements, passwordRules.checkSame(rePassword, 'Passwords must match.')]"
                        label="Re-Enter Password"
                        :type="show1 ? 'text' : 'password'"
                        required
                        @input="refreshPasswordRules"
                        class="mr-6"
                        @click:append-inner="show1 = !show1"
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
                    <p>Already have an account? <router-link to="/login">Sign in here.</router-link> </p>
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