<script setup lang="ts">
    import { ref } from 'vue';
    import { errorMessages } from 'vue/compiler-sfc';
    import Icon from './components/icon.vue';
    import { validateHeaderName } from 'http';
    import { feathersClient } from './backendAPI';
    import { appendFile } from 'fs';
    import { useAuthStore } from './stores/auth';
    import { storeToRefs } from 'pinia';
    import { useClubStore } from './stores/clubStore';
    import { useUserStore } from './stores/user';

    const registerForm = ref(null)
    const authStore = useAuthStore()
    const clubStore = useClubStore()
    const userStore = useUserStore()
    
    const router = useRouter()

    //Setup stores and logic for form submission
    const error = ref('')
    const loading = ref(false)

    //test for valid user input
    const valid = ref(false)

    //Store user inputs to be passed to create()
    const club_name = ref('')
    const club_description = ref('')

    //RULES FOR FORM

    const nameRules = [
        (value: string) => {
          if (value && (value.length < 31)) return true
          return 'Name is required and must be less than 30 characters.'
        }
    ]

    const descRules = [
        (value: string) => {
            if (value && (value.length < 750)) return true
            return 'Description is required and must be less than 750 characters.'
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

          //Create new club in the database
          const newClub = await feathersClient.service("Club")._create({
            name: club_name.value,
            description: club_description.value,
            created_at: nowString,
            activity_status: 'Active'
          }
          ).catch(err =>{
            error.value = err.message
            console.log('error caught; ', error)
          });
          console.log(newClub)
          if(newClub){
            clubStore.setDescription(newClub.description)
            clubStore.setId(newClub.club_id)
            clubStore.setName(newClub.name)
          }
          

          //If club creation succeeds, create new ClubMembership item designating the creating user as the president by default
          if(newClub){
            const newPresident = await feathersClient.service("ClubMembership")._create({
              userid: userStore.id,
              role: 'President',
              clubid: newClub.club_id,
              is_active: true,
              dues_paid: false
            }
            ).catch(err => {
              error.value = err.message
              console.log('error caught; ', error)
            })
            console.log(newPresident)
          }
        } finally {
          loading.value = false
          router.push('/clubDash')
        }
    }
        
</script>

Method to auto-refresh form validity rules
<script lang="ts">

  export default {

    methods: {
      refreshRules(){
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
          
            <v-card class = "bg-primary mt-10" width="400">
              <v-card-title class="ml-3 mt-3 mb-10 text-wrap">
                <h1>Let's take your
                club to the next level.</h1>
              </v-card-title>
            </v-card>
        </v-row>

        <v-row justify="center">
            <v-card height="600" width="400" text>

              <v-card-title class="text-center">
                <h2>Create a Club</h2>
              </v-card-title>

              <v-container class="ml-3">
                <v-form ref="registerForm" v-model="valid" class="mt-7" @submit.prevent="handleSubmit">

                  <v-row
                  >
                    <v-text-field
                      v-model="club_name"
                      :rules="nameRules"
                      label="Club Name"
                      required
                      class="mr-6 mb-5"
                    ></v-text-field>
                  </v-row>

                  <v-row
                  >
                    <v-textarea
                      v-model="club_description"
                      :rules="descRules"
                      label="Description:"
                      required
                      class="mr-6 mb-5"
                      height="400"
                    ></v-textarea>
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

                </v-form>
              </v-container>
            </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>