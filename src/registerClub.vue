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
    import { useRouter } from 'vue-router';

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
    const club_tags = ref<string[]>([])
    const logo_file = ref<File | null>(null)
    const logo_preview = ref<string>('')
    const allTags = [
      'Sports', 'Technology', 'Arts', 'Community', 'Academic',
      'Competitive', 'Volunteering', 'Gaming', 'Coding', 'Music',
      'Strategy', 'Leadership', 'Cultural', 'Health & Wellness', 'Engineering',
      'Business', 'Science', 'Pre-Med', 'Law', 'Environmental'
    ]

    //RULES FOR FORM

const nameRules = [
  (v: string) => (!!v && v.length < 31) || 'Required, max 30 characters.',
]
const descRules = [
  (v: string) => (!!v && v.length < 750) || 'Required, max 750 characters.',
]
const tagRules = [
  (v: string[]) => (!!v && v.length > 0) || 'Select at least one tag.',
]

    const logoRules = [
        (value: any) => {
            if (!value) return true // logo is optional
            if (value.size <= 5242880) return true // 5MB
            return 'Logo must be less than 5MB'
        }
    ]

    // Handle file selection and preview
    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement
        const files = target.files
        if (files && files.length > 0) {
            logo_file.value = files[0]
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                logo_preview.value = e.target?.result as string
            }
            reader.readAsDataURL(files[0])
        }
    }

    // Upload file to backend
    async function uploadLogoFile(): Promise<string | null> {
        if (!logo_file.value) return null

        try {
            const formData = new FormData()
            formData.append('file', logo_file.value)

            const response = await fetch('http://localhost:42063/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('File upload failed')
            }

            const data = await response.json()
            console.log(data);
            console.log(data.path);
            return data.path // Returns /uploads/filename
        } catch (err) {
            console.error('Logo upload error:', err)
            throw err
        }
    }

function refreshRules() {
  (registerForm.value as any)?.validate()
}

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

          // Upload logo if provided
          let logoUrl = null
          if (logo_file.value) {
            try {
              logoUrl = await uploadLogoFile()
              console.log('Logo uploaded successfully:', logoUrl)
            } catch (uploadErr) {
              error.value = 'Failed to upload logo. Club will be created without logo.'
              console.log('Logo upload error:', uploadErr)
            }
          }

          //Create new club in the database
          const newClub = await feathersClient.service("Club")._create({
            name: club_name.value,
            description: club_description.value,
            tags: club_tags.value,
            created_at: nowString,
            activity_status: 'Active',
            ...(logoUrl && { logo_url: logoUrl }) // Add logo_url if upload succeeded
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
            if(newClub.logo_url) {
              clubStore.setLogoUrl(newClub.logo_url)
            }
          }
          

          //If club creation succeeds, create new ClubMembership item designating the creating user as the president by default
          if(newClub){
            const newPresident = await feathersClient.service("ClubMembership")._create({
              userid: userStore.id,
              role: 'president',
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
    <v-main style="background: #f5f5f5;">
      <v-container class="d-flex align-center justify-center py-10">
        <v-row justify="center" align="stretch" style="width: 100%;">

          <!-- Left accent panel -->
          <v-col cols="12" md="5" class="d-none d-md-flex">
            <v-card
              color="primary"
              rounded="lg"
              elevation="0"
              class="pa-10 d-flex flex-column justify-center h-100"
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

                <v-autocomplete
                  v-model="club_tags"
                  :items="allTags"
                  :rules="tagRules"
                  label="Club Tags"
                  prepend-inner-icon="mdi-tag-multiple"
                  variant="outlined"
                  multiple
                  chips
                  closable-chips
                  clearable
                  class="mb-5"
                  required
                />

                <v-row class="mb-5">
                    <v-file-input
                      v-model="logo_file"
                      @change="handleFileSelect"
                      accept="image/*"
                      label="Club Logo (Optional)"
                      prepend-icon="mdi-image"
                      class="mr-6"
                      :rules="logoRules"
                    ></v-file-input>
                </v-row>

                  <v-row v-if="logo_preview" class="mb-5 justify-center">
                    <v-img
                      :src="logo_preview"
                      alt="Logo Preview"
                      max-width="150"
                      max-height="150"
                    ></v-img>
                  </v-row>

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
