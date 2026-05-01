<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import { feathersClient } from '@/backendAPI'
import { useAuthStore } from '@/stores/auth'
import useClubStore from './stores/clubStore'
import useUserStore from './stores/user'

const router = useRouter()
const authStore = useAuthStore()

// ── Form state ──────────────────────────────────────────────
const step = ref(1)
const totalSteps = 4

const loading = ref(false)
const successSnackbar = ref(false)
const errorSnackbar = ref(false)
const errorMessage = ref('')

// Step 1 — Basic Info
const form = ref({
  club_name: '',
  full_name: '',
  email: '',
  travel_budget_url: '',

  // Step 2 — Trip Details
  mode_of_travel: '',
  transportation_funding: [] as string[],
  business_purpose: '',
  num_travelers: null as number | null,
  destination: '',
  departure_date: '',
  departure_time: '',
  return_date: '',
  return_time: '',
  purpose_of_trip: '',
  has_registration: 'No',
  conference_registration_url: '',
  registration_cost: 0,
  registration_funding: [] as string[],
  agenda_url: '',

  // Lodging
  lodging_info: '',
  nightly_rate: null as number | null,
  lodging_funding: '',
  lodging_screenshot_url: '',
  lodging_total_cost: null as number | null,

  // Step 3 — Group Travel
  travel_roster_url: '',
  business_travel_form_url: '',

  // Step 4 — Acknowledgement
  ack1: false,
  ack2: false,
  ack3: false,
  ack4: false,
  ack5: false,
})

const travelModes = ['Air', 'Personal Car', 'Bus', 'Car Rental', 'Train']
const fundingSources = ['Club Support Funding', 'Club Account', 'ASUN/CSE Department Account', 'Personal Funds', 'Other']
const businessPurposes = ['Individual Travel', 'Group Travel', 'CSE Staff']
const lodgingPaymentOptions = ['Club Support Funding', 'Club Account', 'ASUN/CSE Department Account', 'Personal Funds', 'Other']

const isGroupTravel = computed(() => form.value.business_purpose === 'Group Travel')

// Step form validity
const step1Valid = ref(false)
const step2Valid = ref(false)
const step3Valid = ref(true)
const step4Valid = computed(() =>
  form.value.ack1 && form.value.ack2 && form.value.ack3 && form.value.ack4 && form.value.ack5
)

const required = (v: any) => !!v || 'This field is required.'
const positiveNumber = (v: any) => (!v || Number(v) >= 0) || 'Must be 0 or greater.'

function nextStep() { if (step.value < totalSteps) step.value++ }
function prevStep() { if (step.value > 1) step.value-- }

async function handleSubmit() {
  if (!step4Valid.value) return
  loading.value = true
  try {
    const user = authStore.user
    const membership = await feathersClient.service('ClubMembership').find({
      query: { userid: useUserStore().id, is_active: true, $limit: 1 }
    })
    const rows = membership.data ?? membership
    const clubId = rows[0]?.clubid

    await feathersClient.service('travel-requests').create({
      club: useClubStore().id,
      requested_by: useUserStore().id,
      destination: form.value.destination,
      purpose: form.value.purpose_of_trip,
      departure_date: form.value.departure_date,
      return_date: form.value.return_date,
      num_travelers: form.value.num_travelers,
      estimated_cost: form.value.lodging_total_cost,
      transportation: form.value.mode_of_travel,
      lodging: form.value.lodging_info,
      notes: JSON.stringify({
        club_name: form.value.club_name,
        full_name: form.value.full_name,
        email: form.value.email,
        business_purpose: form.value.business_purpose,
        transportation_funding: form.value.transportation_funding,
        has_registration: form.value.has_registration,
        registration_cost: form.value.registration_cost,
        nightly_rate: form.value.nightly_rate,
        lodging_funding: form.value.lodging_funding,
      }),
    })
    successSnackbar.value = true
    setTimeout(() => router.push('/dashboard'), 2000)
  } catch (e: any) {
    errorMessage.value = e?.message || 'Submission failed. Please try again.'
    errorSnackbar.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <v-container max-width="820">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-h4 font-weight-bold">ASUN/CSE Travel Request FY 25-26</h1>
        <p class="text-medium-emphasis mt-1">Form fields marked with an asterisk (*) are required.</p>
      </div>

      <!-- Progress -->
      <v-stepper v-model="step" flat class="mb-6 bg-transparent">
        <v-stepper-header>
          <v-stepper-item title="Travel Request" :value="1" :complete="step > 1" color="primary" />
          <v-divider />
          <v-stepper-item title="Trip Details" :value="2" :complete="step > 2" color="primary" />
          <v-divider />
          <v-stepper-item title="Group Travel" :value="3" :complete="step > 3" color="primary" />
          <v-divider />
          <v-stepper-item title="Acknowledgement" :value="4" color="primary" />
        </v-stepper-header>
      </v-stepper>

      <!-- ── STEP 1: Travel Request ─────────────────────── -->
      <v-form v-if="step === 1" v-model="step1Valid">

        <!-- Info Banner -->
        <v-alert color="light-blue-lighten-4" rounded="lg" class="mb-5" border="start" border-color="light-blue">
          <p class="text-body-2 mb-2">
            Submit travel request <strong>30 days</strong> before travel date if traveling by <strong>Air/Bus/Train</strong>.
          </p>
          <p class="text-body-2 mb-2">
            Submit travel request <strong>45 days</strong> before travel date if <strong>driving (Personal Car or Rental Car)</strong> AND if <strong><u>traveling internationally</u></strong>.
          </p>
          <p class="text-body-2 mb-2">
            If a request is submitted without enough time <strong>(1 or 2 weeks before travel date)</strong> we <strong>cannot guarantee</strong> your trip will be approved. If your travel is not approved, you <strong><u>cannot</u></strong> travel.
          </p>
          <v-alert type="warning" variant="tonal" density="compact" class="mt-3" rounded="lg">
            IF YOU DO NOT HAVE A FINAL ACCURATE ROSTER & MAJORITY OF THE REQUIRED DOCUMENTS, PLEASE WAIT TO SUBMIT THE REQUEST UNTIL YOU DO.
          </v-alert>
          <p class="text-body-2 mt-3"><strong>There are two types of travel for the University. Business travel and non-business travel.</strong></p>
          <p class="text-body-2 mt-2"><strong>Business travel</strong></p>
          <ol class="text-body-2 ml-4 mt-1">
            <li><em>Directly supports a faculty member's project or research program or;</em></li>
            <li><em>Are related to presenting or leading a session at a conference (a photocopy of the conference program is attached), or;</em></li>
            <li><em>Are incurred while officially representing the University</em></li>
          </ol>
          <p class="text-body-2 mt-2"><strong>Non-business travel</strong></p>
          <p class="text-body-2"><em>If none of the above criteria are met, the reimbursement will be classified as a fellowship/scholarship/award (FSA).</em></p>
        </v-alert>

        <!-- Contact Banner -->
        <v-alert color="light-blue-lighten-4" rounded="lg" class="mb-6" border="start" border-color="light-blue">
          <p class="text-body-2">
            For any questions related to travel please check
            <a href="https://www.unr.edu/student-engagement/clubs-and-organizations/travel" target="_blank" class="text-primary">https://www.unr.edu/student-engagement/clubs-and-organizations/travel</a>
            for help. If your question cannot be answered from the website, please contact Accounting Office at
            <a href="mailto:cseaccounting@unr.edu" class="text-primary">cseaccounting@unr.edu</a>
          </p>
        </v-alert>

        <v-card elevation="2" rounded="lg" class="pa-6 mb-4">
          <v-text-field v-model="form.club_name" label="* Club/Organization/Department Name"
            :rules="[required]" variant="outlined" class="mb-4" />

          <v-text-field v-model="form.full_name" label="* Your Full Name"
            :rules="[required]" variant="outlined" class="mb-4" />

          <v-text-field v-model="form.email" label="* Your Email Address"
            :rules="[required]" variant="outlined" class="mb-4" />

          <!-- Travel Budget -->
          <v-alert color="light-blue-lighten-4" rounded="lg" class="mb-4" density="compact">
            <p class="text-body-2">
              <strong>Travel Budget:</strong> Please
              <a href="https://nevada.box.com/s/oquufnsbi693co1xg26cekhkhkx1t758" target="_blank" class="text-primary">download</a>
              the Excel and fill out all of the relevant fields for your travel. It is required for you to attach.
            </p>
          </v-alert>

          <v-text-field v-model="form.travel_budget_url" label="* Attach Travel Budget (paste file URL or Drive link)"
            :rules="[required]" prepend-inner-icon="mdi-paperclip" variant="outlined"
            hint="Upload your filled Excel budget to Google Drive and paste the link here" persistent-hint />
        </v-card>

        <div class="d-flex justify-end mt-4">
          <v-btn color="primary" :disabled="!step1Valid" @click="nextStep" append-icon="mdi-arrow-right" size="large">
            Next
          </v-btn>
        </div>
      </v-form>

      <!-- ── STEP 2: Trip Details ────────────────────────── -->
      <v-form v-else-if="step === 2" v-model="step2Valid">
        <v-card elevation="2" rounded="lg" class="pa-6 mb-4">

          <!-- Mode of Travel -->
          <p class="text-body-1 font-weight-medium mb-1">* Please select the mode of travel</p>
          <v-alert type="warning" variant="tonal" density="compact" rounded="lg" class="mb-3">
            Reminder: All drivers (personal or rental car) must be 21 years or older.
          </v-alert>
          <v-radio-group v-model="form.mode_of_travel" :rules="[required]" class="mb-5">
            <v-radio v-for="m in travelModes" :key="m" :label="m" :value="m" color="primary" />
          </v-radio-group>

          <v-divider class="mb-5" />

          <!-- Transportation Funding -->
          <p class="text-body-1 font-weight-medium mb-3">* How will you be covering the cost of transportation?</p>
          <div class="mb-5">
            <v-checkbox v-for="s in fundingSources" :key="s"
              v-model="form.transportation_funding" :label="s" :value="s"
              color="primary" density="compact" hide-details />
          </div>

          <v-divider class="mb-5" />

          <!-- Business Purpose -->
          <p class="text-body-1 font-weight-medium mb-3">* Business Purpose</p>
          <v-radio-group v-model="form.business_purpose" :rules="[required]" class="mb-5">
            <v-radio v-for="b in businessPurposes" :key="b" :label="b" :value="b" color="primary" />
          </v-radio-group>

          <v-divider class="mb-5" />

          <!-- Traveler Count & Destination -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.num_travelers" label="* How many people will be traveling?"
                type="number" min="1" :rules="[required]" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.destination" label="* Travel Destination (City, State)"
                :rules="[required]" variant="outlined" />
            </v-col>
          </v-row>

          <!-- Dates & Times -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.departure_date" label="* Departure Date" type="date"
                :rules="[required]" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.departure_time" label="* Departure Time" type="time"
                :rules="[required]" variant="outlined" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.return_date" label="* Return to Reno, NV Date" type="date"
                :rules="[required]" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.return_time" label="* Return to Reno, NV Time" type="time"
                :rules="[required]" variant="outlined" />
            </v-col>
          </v-row>

          <v-divider class="my-5" />

          <!-- Purpose of Trip -->
          <v-textarea v-model="form.purpose_of_trip"
            label="* Purpose of Trip (If a conference or meeting is involved, give the name of the organization, location and time of meeting, etc.)"
            :rules="[required]" variant="outlined" rows="4" class="mb-5" />

          <!-- Registration -->
          <p class="text-body-1 font-weight-medium mb-2">* Is there registration(s) associated with this trip? If yes purchase ticket through P-Card.</p>
          <v-radio-group v-model="form.has_registration" inline class="mb-4">
            <v-radio label="Yes" value="Yes" color="primary" />
            <v-radio label="No" value="No" color="primary" />
          </v-radio-group>

          <v-alert color="light-blue-lighten-4" rounded="lg" class="mb-4" density="compact">
            <p class="text-body-2">
              <strong>Conference/Meeting Registration:</strong> If your trip includes registration it is REQUIRED to attach a screenshot showing the cost, even if it is $0
            </p>
          </v-alert>

          <v-text-field v-model="form.conference_registration_url"
            label="* Conference/Meeting Registration (paste file URL or screenshot link)"
            prepend-inner-icon="mdi-paperclip" variant="outlined" class="mb-4"
            :rules="[required]" />

          <v-text-field v-model.number="form.registration_cost"
            label="* Total Cost of all Registrations (if none, put $0.00)"
            type="number" step="0.01" min="0" :rules="[positiveNumber]"
            prepend-inner-icon="mdi-currency-usd" variant="outlined" class="mb-4" />

          <p class="text-body-1 font-weight-medium mb-3">* How will you be paying for conference fees/registration?</p>
          <div class="mb-5">
            <v-checkbox v-for="s in fundingSources" :key="s"
              v-model="form.registration_funding" :label="s" :value="s"
              color="primary" density="compact" hide-details />
          </div>

          <v-divider class="mb-5" />

          <!-- Agenda -->
          <p class="text-body-1 font-weight-medium mb-2">
            * Upload a Conference Agenda or create a detailed Day-to-Day Agenda of when you are leaving, approximately what you are doing on a per hour basis, and when you are returning.
          </p>
          <v-text-field v-model="form.agenda_url" label="* Agenda (paste file URL or Drive link)"
            prepend-inner-icon="mdi-paperclip" variant="outlined" :rules="[required]" class="mb-5" />

          <v-divider class="mb-5" />

          <!-- Lodging -->
          <v-textarea v-model="form.lodging_info"
            label="* Lodging Information — Please provide the hotel name and address"
            :rules="[required]" variant="outlined" rows="3" class="mb-4" />

          <v-text-field v-model.number="form.nightly_rate" label="* Nightly Rate excluding taxes"
            type="number" step="0.01" min="0" :rules="[required]"
            prepend-inner-icon="mdi-currency-usd" variant="outlined" class="mb-4" />

          <v-select v-model="form.lodging_funding" :items="lodgingPaymentOptions"
            label="* How will you be paying for lodging?" :rules="[required]"
            variant="outlined" class="mb-4" />

          <p class="text-body-1 font-weight-medium mb-2">
            * Upload a screenshot from the hotel website showing the total estimated cost of lodging for all travelers on your travel dates.
          </p>
          <v-text-field v-model="form.lodging_screenshot_url" label="* Lodging Screenshot (paste file URL or Drive link)"
            prepend-inner-icon="mdi-paperclip" variant="outlined" :rules="[required]" class="mb-4" />

          <v-text-field v-model.number="form.lodging_total_cost"
            label="* Total Cost of Lodging All Nights Includes Taxes (0.00 Format)"
            type="number" step="0.01" min="0" :rules="[required]"
            prepend-inner-icon="mdi-currency-usd" variant="outlined" class="mb-4" />

          <!-- Reimbursement Info -->
          <v-alert color="light-blue-lighten-4" rounded="lg" border="start" border-color="light-blue">
            <p class="text-body-2 font-weight-bold mb-2">
              TRAVEL REIMBURSEMENT: A travel reimbursement form must be turned in at MOST 10 business days after you return from your trip.
            </p>
            <p class="text-body-2 mb-1"><strong>For business related travel:</strong></p>
            <p class="text-body-2 mb-1">1) Current employee in Workday. The Accounting office will process your reimbursement and your current supervisor will have to approve it.</p>
            <p class="text-body-2 mb-1">2) Not an employee in Workday. The Accounting office will process your reimbursement via non-worker and a physical check will be sent to the address you put in the Pack Life form.</p>
            <p class="text-body-2 mt-2"><strong>For non-business related travel:</strong></p>
            <p class="text-body-2">3) Members seeking reimbursement must be signed up on the NSHE Supplier Registration System Lite. (<a href="https://suppliers.nevada.edu/lite" target="_blank" class="text-primary">suppliers.nevada.edu/lite</a>)</p>
          </v-alert>
        </v-card>

        <div class="d-flex justify-space-between mt-4">
          <v-btn variant="outlined" @click="prevStep" prepend-icon="mdi-arrow-left" size="large">Previous</v-btn>
          <v-btn color="primary" :disabled="!step2Valid" @click="nextStep" append-icon="mdi-arrow-right" size="large">Next</v-btn>
        </div>
      </v-form>

      <!-- ── STEP 3: Group Travel ────────────────────────── -->
      <v-form v-else-if="step === 3" v-model="step3Valid">
        <v-card elevation="2" rounded="lg" class="pa-6 mb-4">
          <h2 class="text-h5 font-weight-bold mb-5">Group Travel</h2>

          <v-alert color="light-blue-lighten-4" rounded="lg" class="mb-5" border="start" border-color="light-blue">
            <p class="text-body-2">
              A travel roster is required for any group travel.
              <a href="https://nevada.box.com/shared/static/zyvmpdnojxa0hkbgfphuavmsru4toz7m.pdf" target="_blank" class="text-primary">Download this template</a>,
              fill out the requested information, then upload it below. Please include each traveler's first name, last name, phone number, and email address.
            </p>
          </v-alert>

          <p class="text-body-1 font-weight-medium mb-2">* Upload a Travel Roster (First Name, Last Name, Phone Number, and Email Address)</p>
          <v-text-field v-model="form.travel_roster_url" label="Travel Roster (paste file URL or Drive link)"
            prepend-inner-icon="mdi-paperclip" variant="outlined" class="mb-6" />

          <v-alert color="light-blue-lighten-4" rounded="lg" class="mb-5" border="start" border-color="light-blue">
            <p class="text-body-2">
              Each student traveler needs to have a
              <a href="https://nevada.box.com/shared/static/kk7kktwt3dj75qnqz3lw4b1zyrztmt0r.pdf" target="_blank" class="text-primary">Business Travel Form</a>
              filled out. Have each traveler fill out the requested information and upload the forms.
            </p>
          </v-alert>

          <p class="text-body-1 font-weight-medium mb-2">* Upload each Business Travel Form if your travel meets the requirements listed.</p>
          <v-text-field v-model="form.business_travel_form_url" label="Business Travel Form (paste file URL or Drive link)"
            prepend-inner-icon="mdi-paperclip" variant="outlined" class="mb-4" />

          <p class="text-body-2 text-medium-emphasis mb-2">Business Travel Form (if needed)</p>
          <v-text-field label="Additional Business Travel Form (optional)" prepend-inner-icon="mdi-paperclip"
            variant="outlined" class="mb-3" />

          <p class="text-body-2 text-medium-emphasis mb-2">Business Travel Form (if needed)</p>
          <v-text-field label="Additional Business Travel Form (optional)" prepend-inner-icon="mdi-paperclip"
            variant="outlined" class="mb-3" />

          <p class="text-body-2 text-medium-emphasis mb-2">Business Travel Form (if needed)</p>
          <v-text-field label="Additional Business Travel Form (optional)" prepend-inner-icon="mdi-paperclip"
            variant="outlined" />
        </v-card>

        <div class="d-flex justify-space-between mt-4">
          <v-btn variant="outlined" @click="prevStep" prepend-icon="mdi-arrow-left" size="large">Previous</v-btn>
          <v-btn color="primary" @click="nextStep" append-icon="mdi-arrow-right" size="large">Next</v-btn>
        </div>
      </v-form>

      <!-- ── STEP 4: Acknowledgement ─────────────────────── -->
      <div v-else-if="step === 4">
        <v-card elevation="2" rounded="lg" class="pa-6 mb-4">
          <h2 class="text-h5 font-weight-bold mb-6">Acknowledgement</h2>
          <p class="text-body-2 text-medium-emphasis mb-6">Form fields marked with an asterisk (*) are required.</p>

          <div v-for="(ack, key, idx) in {
            ack1: 'By Clicking this I Agree to Update any Travel Changes to the Accounting Office AS SOON AS POSSIBLE.',
            ack2: 'By Clicking This I Agree to Sign the DocuSign in a Timely Manner.',
            ack3: 'By Clicking This I Agree to Regularly Check Comments in Pack Life and Respond',
            ack4: 'By Clicking This I Agree That Only Travelers on the Approved Roster for This Travel Request, May Travel.',
          }" :key="key" class="mb-5">
            <p class="text-body-2 font-weight-medium text-error mb-1">* Required</p>
            <v-checkbox v-model="(form as any)[key]" :label="'* ' + ack" color="primary" hide-details />
          </div>

          <div class="mb-2">
            <p class="text-body-2 font-weight-medium text-error mb-1">* Required</p>
            <v-checkbox v-model="form.ack5" color="primary" hide-details>
              <template #label>
                <span>* By Failing to Follow with the Above Agreements I Understand My Request and/or Reimbursement Could Be
                  <strong class="text-error">Delayed or Denied</strong></span>
              </template>
            </v-checkbox>
          </div>
        </v-card>

        <div class="d-flex justify-space-between mt-4">
          <v-btn variant="outlined" @click="prevStep" prepend-icon="mdi-arrow-left" size="large">Previous</v-btn>
          <v-btn color="primary" :disabled="!step4Valid" :loading="loading"
            @click="handleSubmit" prepend-icon="mdi-send" size="large">
            Submit Request
          </v-btn>
        </div>
      </div>

    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="3000">
      <v-icon start>mdi-check-circle</v-icon> Travel request submitted successfully!
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="4000">
      <v-icon start>mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
  </DashboardLayout>
</template>
