<script setup lang="ts">
import { ref } from 'vue'
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
  vendor_name: '',
  purchase_date: '',
  amount: null as number | null,
  category: '',
  description: '',
  receipt_url: '',
})

const categories = [
  'Office Supplies', 'Food & Beverage', 'Event Supplies',
  'Transportation', 'Technology', 'Marketing / Printing',
  'Membership / Dues', 'Other',
]

const required = (v: any) => !!v || 'This field is required.'
const positiveNumber = (v: any) => (!!v && Number(v) > 0) || 'Must be a positive number.'
const maxLength = (max: number) => (v: string) => !v || v.length <= max || `Max ${max} characters.`

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

    await feathersClient.service('p-card-requests').create({
      club: clubId,
      requested_by: user.user_id,
      vendor_name: form.value.vendor_name,
      purchase_date: form.value.purchase_date,
      amount: form.value.amount,
      category: form.value.category,
      description: form.value.description,
      receipt_url: form.value.receipt_url,
    })
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
  form.value = { vendor_name: '', purchase_date: '', amount: null, category: '', description: '', receipt_url: '' }
}
</script>

<template>
  <DashboardLayout>
    <v-container max-width="800">
      <div class="mb-6">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2 pl-0" @click="router.back()">Back</v-btn>
        <h1 class="text-h4 font-weight-bold">P-Card Request</h1>
        <p class="text-medium-emphasis mt-1">Submit a purchase card reimbursement or pre-approval request.</p>
      </div>

      <v-card elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <v-form v-model="valid" @submit.prevent="handleSubmit">

            <p class="text-overline text-primary mb-3">Vendor Information</p>
            <v-row>
              <v-col cols="12" sm="7">
                <v-text-field v-model="form.vendor_name" label="Vendor / Merchant Name"
                  :rules="[required, maxLength(255)]" prepend-inner-icon="mdi-store"
                  variant="outlined" required />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field v-model="form.purchase_date" label="Purchase Date" type="date"
                  :rules="[required]" prepend-inner-icon="mdi-calendar"
                  variant="outlined" required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="5">
                <v-text-field v-model.number="form.amount" label="Amount ($)" type="number"
                  step="0.01" min="0" :rules="[required, positiveNumber]"
                  prepend-inner-icon="mdi-currency-usd" variant="outlined" required />
              </v-col>
              <v-col cols="12" sm="7">
                <v-select v-model="form.category" :items="categories" label="Category"
                  :rules="[required]" prepend-inner-icon="mdi-tag" variant="outlined" required />
              </v-col>
            </v-row>

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Purchase Details</p>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="form.description" label="Description / Justification"
                  :rules="[required, maxLength(1000)]" prepend-inner-icon="mdi-text"
                  variant="outlined" rows="3" counter="1000" required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.receipt_url" label="Receipt URL (optional)"
                  prepend-inner-icon="mdi-link" variant="outlined"
                  hint="Paste a link to a scanned receipt or Google Drive file" persistent-hint />
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
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="3000">
      <v-icon start>mdi-check-circle</v-icon> P-Card request submitted successfully!
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="4000">
      <v-icon start>mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
  </DashboardLayout>
</template>