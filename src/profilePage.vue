<script setup lang="ts">
import { ref } from 'vue'
import { feathersClient } from './backendAPI'
import useUserStore from './stores/user'
import ProfilePhotoUpload from './components/ProfilePhotoUpload.vue'

const userStore = useUserStore()

const firstName = ref(userStore.firstName)
const lastName = ref(userStore.lastName)
const email = ref(userStore.email)
const bio = ref(userStore.bio || '')
const linkedinUrl = ref(userStore.linkedin_url || '')
const twitterUrl = ref(userStore.twitter_url || '')
const instagramUrl = ref(userStore.instagram_url || '')
const facebookUrl = ref(userStore.facebook_url || '')

const saving = ref(false)
const error = ref('')
const success = ref(false)
const valid = ref(false)

const nameRules = [(v: string) => !!v || 'This field is required.']
const urlRules = [
  (v: string) => !v || /^https?:\/\/.+/.test(v) || 'Must be a valid URL starting with http:// or https://'
]

async function saveProfile() {
  if (!valid.value) return
  saving.value = true
  error.value = ''
  success.value = false
  try {
    await feathersClient.service('User').patch(userStore.id, {
      first_name: firstName.value,
      last_name: lastName.value,
      bio: bio.value,
      linkedin_url: linkedinUrl.value,
      twitter_url: twitterUrl.value,
      instagram_url: instagramUrl.value,
      facebook_url: facebookUrl.value,
    })
    // Update the store with the new values
    userStore.setUser({
      firstName: firstName.value,
      lastName: lastName.value,
      bio: bio.value,
      linkedin_url: linkedinUrl.value,
      twitter_url: twitterUrl.value,
      instagram_url: instagramUrl.value,
      facebook_url: facebookUrl.value,
    })
    success.value = true
  } catch {
    error.value = 'Failed to save changes. Please try again.'
  } finally {
    saving.value = false
  }
}

function onPhotoUploaded(photoUrl: string) {
  savePhotoUrl(photoUrl)
}

async function savePhotoUrl(photoPath: string) {
  try {
    await feathersClient.service('User').patch(userStore.id, {
      profile_photo_url: photoPath,
    })
    userStore.setProfilePhotoUrl(photoPath)
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch {
    error.value = 'Failed to save profile photo. Please try again.'
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
    <v-card elevation="2" rounded="lg" class="mb-6">
      <v-card-text class="pa-6">

        <div class="d-flex align-center mb-5">
          <v-avatar :color="userStore.profile_photo_url ? 'transparent' : 'primary'" size="64" class="mr-4">
            <img
              v-if="userStore.profile_photo_url"
              :src="`http://localhost:42063${userStore.profile_photo_url}`"
              alt="Profile photo"
              class="profile-avatar-image"
            />
            <span v-else class="text-h5 text-white font-weight-bold">
              {{ (userStore.firstName?.[0] ?? '') }}{{ (userStore.lastName?.[0] ?? '') }}
            </span>
          </v-avatar>
          <div>
            <p class="text-h6 font-weight-bold ma-0">{{ userStore.firstName }} {{ userStore.lastName }}</p>
            <p class="text-medium-emphasis text-body-2 ma-0">{{ userStore.email }}</p>
            <p v-if="userStore.bio" class="text-body-2 ma-0 mt-1">{{ userStore.bio }}</p>
          </div>
        </div>

        <v-divider class="mb-5" />

        <p class="text-overline text-primary mb-4">Profile Photo</p>
        <ProfilePhotoUpload @photo-uploaded="onPhotoUploaded" class="mb-5" />

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

          <v-textarea
            v-model="bio"
            label="Bio"
            prepend-inner-icon="mdi-text-box-outline"
            variant="outlined"
            rows="3"
            class="mb-4"
            hint="Tell others about yourself (optional)"
            persistent-hint
          />

          <v-divider class="mb-4" />

          <p class="text-overline text-primary mb-3">Social Media Links</p>

          <v-text-field
            v-model="linkedinUrl"
            label="LinkedIn Profile"
            :rules="urlRules"
            prepend-inner-icon="mdi-linkedin"
            variant="outlined"
            class="mb-3"
            placeholder="https://linkedin.com/in/yourprofile"
          />

          <v-text-field
            v-model="twitterUrl"
            label="Twitter Profile"
            :rules="urlRules"
            prepend-inner-icon="mdi-twitter"
            variant="outlined"
            class="mb-3"
            placeholder="https://twitter.com/yourhandle"
          />

          <v-text-field
            v-model="instagramUrl"
            label="Instagram Profile"
            :rules="urlRules"
            prepend-inner-icon="mdi-instagram"
            variant="outlined"
            class="mb-3"
            placeholder="https://instagram.com/yourhandle"
          />

          <v-text-field
            v-model="facebookUrl"
            label="Facebook Profile"
            :rules="urlRules"
            prepend-inner-icon="mdi-facebook"
            variant="outlined"
            class="mb-4"
            placeholder="https://facebook.com/yourprofile"
          />

          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="primary"
              rounded="lg"
              :loading="saving"
              :disabled="!valid"
              prepend-icon="mdi-content-save"
            >Save Profile</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.profile-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
