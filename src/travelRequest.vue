<script setup lang="ts">
import { ref } from 'vue'
import { downloadTravelPDF } from '@/formPDF'
const submitted = ref(false)
const submittedData = ref<any>(null)
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import { feathersClient } from '@/backendAPI'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const valid = ref(false)
const loading = ref(false)
const successSnackbar = ref(false)
const errorSnackbar = ref(false)
const errorMessage = ref('')

const form = ref({
  destination: '',
  purpose: '',
  departure_date: '',
  return_date: '',
  num_travelers: 1,
  estimated_cost: null as number | null,
  transportation: '',
  lodging: '',
  notes: '',
})

const transportationOptions = [
  'Personal Vehicle', 'Club Vehicle', 'Rental Car',
  'Airplane', 'Bus / Shuttle', 'Train', 'Rideshare (Uber/Lyft)', 'Other',
]

const required = (v: any) => !!v || 'This field is required.'
const positiveNumber = (v: any) => (!!v && Number(v) > 0) || 'Must be a positive number.'
const minOne = (v: any) => (!!v && Number(v) >= 1) || 'Must be at least 1.'
const maxLength = (max: number) => (v: string) => !v || v.length <= max || `Max ${max} characters.`
const returnAfterDeparture = (v: string) => {
  if (!v || !form.value.departure_date) return true
  return new Date(v) >= new Date(form.value.departure_date) || 'Return date must be on or after departure.'
}

async function handleSubmit() {
  if (!valid.value) return
  loading.value = true
  try {
    const user = authStore.user
    const membership = await feathersClient.service('Club Membership').find({
      query: { userid: user.user_id, is_active: true, $limit: 1 }
    })
    const rows = membership.data ?? membership
    const clubId = rows[0]?.clubid

    await feathersClient.service('travel-requests').create({
      club: clubId,
      requested_by: user.user_id,
      destination: form.value.destination,
      purpose: form.value.purpose,
      departure_date: form.value.departure_date,
      return_date: form.value.return_date,
      num_travelers: form.value.num_travelers,
      estimated_cost: form.value.estimated_cost,
      transportation: form.value.transportation,
      lodging: form.value.lodging,
      notes: form.value.notes,
    })
    submittedData.value = { ...form.value }
    submitted.value = true
    successSnackbar.value = true
    resetForm()
  } catch (e: any) {
    errorMessage.value = e?.message || 'Submission failed. Please try again.'
    errorSnackbar.value = true
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    destination: '', purpose: '', departure_date: '', return_date: '',
    num_travelers: 1, estimated_cost: null, transportation: '', lodging: '', notes: ''
  }
}
</script>

<template>
  <DashboardLayout>
    <v-container max-width="800">
      <div class="mb-6">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2 pl-0" @click="router.back()">Back</v-btn>
        <h1 class="text-h4 font-weight-bold">Travel Request</h1>
        <p class="text-medium-emphasis mt-1">Submit a travel request for club-related trips and events.</p>
      </div>

      <v-card elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <v-form v-model="valid" @submit.prevent="handleSubmit">

            <p class="text-overline text-primary mb-3">Trip Details</p>
            <v-row>
              <v-col cols="12" sm="8">
                <v-text-field v-model="form.destination" label="Destination (City, State)"
                  :rules="[required, maxLength(255)]" prepend-inner-icon="mdi-map-marker"
                  variant="outlined" required />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model.number="form.num_travelers" label="# of Travelers"
                  type="number" min="1" :rules="[required, minOne]"
                  prepend-inner-icon="mdi-account-group" variant="outlined" required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.departure_date" label="Departure Date" type="date"
                  :rules="[required]" prepend-inner-icon="mdi-airplane-takeoff"
                  variant="outlined" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.return_date" label="Return Date" type="date"
                  :rules="[required, returnAfterDeparture]" prepend-inner-icon="mdi-airplane-landing"
                  variant="outlined" required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="form.purpose" label="Purpose of Travel"
                  :rules="[required, maxLength(1000)]" prepend-inner-icon="mdi-text-box"
                  variant="outlined" rows="3" counter="1000" required />
              </v-col>
            </v-row>

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Logistics & Budget</p>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select v-model="form.transportation" :items="transportationOptions"
                  label="Transportation Method" prepend-inner-icon="mdi-car" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="form.estimated_cost" label="Estimated Total Cost ($)"
                  type="number" step="0.01" min="0" :rules="[required, positiveNumber]"
                  prepend-inner-icon="mdi-currency-usd" variant="outlined" required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.lodging" label="Lodging (Hotel name, address, or 'N/A')"
                  :rules="[maxLength(255)]" prepend-inner-icon="mdi-bed" variant="outlined" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Additional Notes</p>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="form.notes" label="Any additional notes or special requests"
                  :rules="[maxLength(2000)]" prepend-inner-icon="mdi-note-text"
                  variant="outlined" rows="3" counter="2000" />
              </v-col>
            </v-row>

            <v-divider class="my-6" />
            <div class="d-flex justify-end gap-3">
              <v-btn variant="outlined" color="secondary" @click="resetForm" :disabled="loading">Clear</v-btn>
              <v-btn type="submit" color="primary" :loading="loading" prepend-icon="mdi-send">Submit Request</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    >temple/<      
>reniatnoc-v/<

    <v-snackbar v-model="successSnackbar" color="success" timeout="3000">
      <v-icon start>mdi-check-circle</v-icon> Travel request submitted successfully!
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="4000">
      <v-icon start>mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
  </v-container>
  </DashboardLayout>
</template>