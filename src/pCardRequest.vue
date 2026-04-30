<script setup lang="ts">
import { ref, computed } from 'vue'
import { downloadPCardPDF } from '@/formPDF'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import { feathersClient } from '@/backendAPI'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const successSnackbar = ref(false)
const errorSnackbar = ref(false)
const errorMessage = ref('')

// ── Step tracking ──
const currentStep = ref(0)

// ── Page 1: Credit Card Request Form ──
const p1 = ref({
  first_name: '',
  last_name: '',
  club_name: '',
  packages_delivered: null as boolean | null,
  is_travel: null as boolean | null,
  is_gift: null as boolean | null,
  is_print: null as boolean | null,
  is_event: null as boolean | null,
  num_vendors: null as number | null,
  funding_sources: [] as string[],
  transaction_detail: '',
  asun_funding_info: '',
})
const p1Valid = ref(false)

// ── Page 2: Prize/Gift/Award ──
const p2 = ref({
  prize_receipt_acknowledged: false,
})
const p2Valid = ref(false)

// ── Page 3: UNR Name/Logo ──
const p3 = ref({
  using_unr_logo: null as boolean | null,
})
const p3Valid = ref(false)

// ── Page 4: Item Description (logo) ──
const p4 = ref({
  logo_description: '',
})
const p4Valid = ref(false)

// ── Page 5: Print Service ──
const p5 = ref({
  design_file_url: '',
  print_release_number: '',
})
const p5Valid = ref(false)

// ── Page 6: Event/Meeting/Gathering ──
const p6 = ref({
  event_name: '',
  event_location: '',
  event_date: '',
  event_timeframe: '',
  num_attendees: null as number | null,
  attendee_names: '',
  flyer_url: '',
})
const p6Valid = ref(false)

// ── Page 7: Invoices/Receipts per vendor ──
const vendors = ref([{
  receipt_url: '',
  vendor_name: '',
  approximate_amount: null as number | null,
  items_to_purchase: '',
  reason_for_purchase: '',
}])

// ── Page 8: ASUN/CSE Department Funding ──
const p8 = ref({
  department_account: '',
  budget_approved: null as string | null,
})
const p8Valid = ref(false)

// ── Page 9: Public Meeting Approval ──
const p9 = ref({
  public_meeting_date: '',
})
const p9Valid = ref(false)

// ── Page 10: Final / Signatures ──
const p10 = ref({
  email: '',
  asun_employee_verified: false,
  officer_signature: false,
  faculty_signature: false,
})
const p10Valid = ref(false)

const departmentAccounts = [
  'PG00092: Center For Student Engagement',
  'PG1984: ASUN Book Fund',
  'PG00137: Pack Rides-Recharge',
  'PG00275: ASUN Capital Account',
  'PG00401: Sagebrush',
  'PG01154: Milton Glick Undergrad Journal',
  'PG01395: ASUN Senate',
  'PG02201: Brushfire',
  'PG03044: ASUN Government Affairs',
  'PG03085: Fall & Spring Concerts',
  'PG03086: Blue Crew',
  'PG03506: 5% Contingency Fund',
  'PG03847: Inkblot Promotions',
  'PG03922: Elections',
  'PG03984: Clubs & Organizations Board',
  'PG03996: ASUN Executive Board',
]

const fundingSources = [
  'Club Account',
  'Club Support Funding',
  'ASUN/CSE Department',
  'The Nevada Sagebrush',
]

// Build step list dynamically based on selections
const steps = computed(() => {
  const list = [{ id: 'main', title: 'Credit Card Request Form' }]
  if (p1.value.is_gift) list.push({ id: 'gift', title: 'Prize / Gift / Award' })
  if (p3.value.using_unr_logo) list.push({ id: 'logo_desc', title: 'Item Description' })
  if (p1.value.using_unr_logo_question) list.push({ id: 'unr_logo', title: 'Use of UNR Name / Logo' })
  if (p1.value.is_print) list.push({ id: 'print', title: 'Stickers, Posters, Banner, Apparel, Tablecloth or Clothing' })
  if (p1.value.is_event) list.push({ id: 'event', title: 'Event / Meeting / Gathering' })
  list.push({ id: 'vendors', title: 'Invoices / Receipts' })
  if (p1.value.funding_sources.includes('ASUN/CSE Department')) list.push({ id: 'dept_funding', title: 'ASUN/CSE Department Funding' })
  if (p8.value.budget_approved === 'Yes') list.push({ id: 'public_meeting', title: 'Public Meeting Approval' })
  list.push({ id: 'final', title: 'Signatures & Submission' })
  return list
})

// Simpler flat step array
const allSteps = computed(() => {
  const s: string[] = ['main']
  if (p1.value.is_gift) s.push('gift')
  s.push('unr_logo')
  if (p3.value.using_unr_logo) s.push('logo_desc')
  if (p1.value.is_print) s.push('print')
  if (p1.value.is_event) s.push('event')
  s.push('vendors')
  if (p1.value.funding_sources.includes('ASUN/CSE Department')) s.push('dept_funding')
  if (p8.value.budget_approved === 'Yes') s.push('public_meeting')
  s.push('final')
  return s
})

const currentStepId = computed(() => allSteps.value[currentStep.value] ?? 'main')
const totalSteps = computed(() => allSteps.value.length)

function nextStep() {
  if (currentStep.value < totalSteps.value - 1) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

// Sync vendor count
function updateVendorCount(n: number) {
  p1.value.num_vendors = n
  while (vendors.value.length < n) {
    vendors.value.push({ receipt_url: '', vendor_name: '', approximate_amount: null, items_to_purchase: '', reason_for_purchase: '' })
  }
  vendors.value = vendors.value.slice(0, n)
}

async function handleSubmit() {
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
      ...p1.value,
      ...p2.value,
      ...p3.value,
      ...p4.value,
      ...p5.value,
      ...p6.value,
      vendors: vendors.value,
      ...p8.value,
      ...p9.value,
      ...p10.value,
    })
    successSnackbar.value = true
    currentStep.value = 0
  } catch (e: any) {
    errorMessage.value = e?.message || 'Submission failed. Please try again.'
    errorSnackbar.value = true
  } finally {
    loading.value = false
  }
}

const required = (v: any) => !!v || 'This field is required.'
const positiveNumber = (v: any) => (!!v && Number(v) > 0) || 'Must be a positive number.'
</script>

<template>
  <DashboardLayout>
    <v-container max-width="800">

      <!-- Page Header -->
      <div class="mb-6">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2 pl-0" @click="router.back()">Back</v-btn>
        <h1 class="text-h4 font-weight-bold">P-Card Request</h1>
        <p class="text-medium-emphasis mt-1">ASUN/CSE Credit Card Request Form FY 25-26</p>
      </div>

      <!-- Step Progress -->
      <v-card elevation="1" rounded="lg" class="pa-4 mb-5">
        <div class="d-flex align-center justify-space-between">
          <span class="text-body-2 text-medium-emphasis">Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
          <v-chip color="primary" variant="tonal" size="small">{{ allSteps[currentStep] === 'main' ? 'Credit Card Request' : steps.find(s => s.id === currentStepId)?.title ?? '' }}</v-chip>
        </div>
        <v-progress-linear
          :model-value="((currentStep + 1) / totalSteps) * 100"
          color="primary"
          rounded
          height="6"
          class="mt-3"
        />
      </v-card>

      <!-- ── STEP: Main Form ── -->
      <v-card v-if="currentStepId === 'main'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">

          <!-- Info Alerts -->
          <v-alert type="info" variant="tonal" rounded="lg" class="mb-3" density="compact">
            Credit Card Requests are currently only available for <strong>CSE/ASUN Departments</strong> and ASUN-recognized clubs and organizations.
          </v-alert>
          <v-alert type="warning" variant="tonal" rounded="lg" class="mb-3" density="compact">
            <strong>REQUEST MUST BE SUBMITTED AT LEAST A WEEK PRIOR TO EVENT.</strong> Please allow 48 hours to process the request.
          </v-alert>
          <v-alert type="info" variant="tonal" rounded="lg" class="mb-3" density="compact">
            Do not wait until the last moment to request/pick up a card. There is a possibility that the card has been previously checked out or has not been returned.
          </v-alert>
          <v-alert type="warning" variant="tonal" rounded="lg" class="mb-5" density="compact">
            If this is a club request, the <strong>President or Treasurer MUST</strong> submit this form for club security.
          </v-alert>

          <v-form v-model="p1Valid">
            <p class="text-overline text-primary mb-3">Requestor Information</p>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="p1.first_name" label="First Name" prepend-inner-icon="mdi-account" variant="outlined" :rules="[required]" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="p1.last_name" label="Last Name" prepend-inner-icon="mdi-account" variant="outlined" :rules="[required]" required />
              </v-col>
            </v-row>
            <v-text-field
              v-model="p1.club_name"
              label="Which club, organization, or department is this request for? (As it appears on your PG account)"
              prepend-inner-icon="mdi-account-group"
              variant="outlined"
              :rules="[required]"
              hint="e.g. 'Example Club' or 'Center for Student Engagement'"
              persistent-hint
              class="mb-4"
              required
            />

            <v-alert type="info" variant="tonal" rounded="lg" class="mb-4" density="compact">
              Is this a purchase for a professional service (DJ, Rental, Photo Booth, Food Truck, Catering, Security Services)?
              If so, please fill out a <strong>PO Request Form</strong> instead.
            </v-alert>

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Delivery & Purchase Details</p>

            <p class="text-body-2 font-weight-medium mb-1">Are you having any packages delivered? <span class="text-error">*</span></p>
            <p class="text-caption text-medium-emphasis mb-2">NOTE: All packages need to be delivered to the University of Nevada, Reno</p>
            <v-radio-group v-model="p1.packages_delivered" :rules="[v => v !== null || 'Required.']" inline class="mb-4">
              <v-radio label="Yes" :value="true" color="primary" />
              <v-radio label="No" :value="false" color="primary" />
            </v-radio-group>

            <v-alert v-if="p1.packages_delivered" type="warning" variant="tonal" rounded="lg" class="mb-4" density="compact">
              <strong>PLEASE MAKE SURE THE NAME OF THE PERSON PICKING UP THE PACKAGE IS ALSO ON THE PACKAGE BEING DELIVERED. USE A UNIVERSITY MAILSTOP.</strong>
              <br/><br/>
              If there is no name on the package when it is delivered to ASUN, there is no way for us to guarantee we will be able to get your package to you.
              <br/><br/>
              Note: If you are ordering from Amazon, please use the Amazon Request Form instead. The ASUN/CSE Mailstop is <strong>0058</strong>.
            </v-alert>

            <p class="text-body-2 font-weight-medium mb-1">Is this request for travel? <span class="text-error">*</span></p>
            <p class="text-caption text-medium-emphasis mb-2">If YES, please submit the Travel Request first and ensure it is approved.</p>
            <v-radio-group v-model="p1.is_travel" :rules="[v => v !== null || 'Required.']" inline class="mb-4">
              <v-radio label="Yes" :value="true" color="primary" />
              <v-radio label="No" :value="false" color="primary" />
            </v-radio-group>

            <p class="text-body-2 font-weight-medium mb-1">Would you be purchasing a gift/prize/award? <span class="text-error">*</span></p>
            <v-radio-group v-model="p1.is_gift" :rules="[v => v !== null || 'Required.']" inline class="mb-4">
              <v-radio label="Yes" :value="true" color="primary" />
              <v-radio label="No" :value="false" color="primary" />
            </v-radio-group>

            <p class="text-body-2 font-weight-medium mb-1">Are you using a print service such as stickers, posters, banners, apparel, tablecloth or clothing? <span class="text-error">*</span></p>
            <v-radio-group v-model="p1.is_print" :rules="[v => v !== null || 'Required.']" inline class="mb-4">
              <v-radio label="Yes" :value="true" color="primary" />
              <v-radio label="No" :value="false" color="primary" />
            </v-radio-group>

            <p class="text-body-2 font-weight-medium mb-1">Is this for an event/meeting/gathering? <span class="text-error">*</span></p>
            <v-radio-group v-model="p1.is_event" :rules="[v => v !== null || 'Required.']" inline class="mb-4">
              <v-radio label="Yes" :value="true" color="primary" />
              <v-radio label="No" :value="false" color="primary" />
            </v-radio-group>

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Vendors & Funding</p>

            <p class="text-body-2 font-weight-medium mb-3">Number of Vendors <span class="text-error">*</span></p>
            <v-radio-group v-model="p1.num_vendors" :rules="[v => !!v || 'Required.']" inline class="mb-4">
              <v-radio v-for="n in [1,2,3,4,5]" :key="n" :label="String(n)" :value="n" color="primary" @click="updateVendorCount(n)" />
            </v-radio-group>

            <p class="text-body-2 font-weight-medium mb-2">Please check the funding source(s) that apply <span class="text-error">*</span></p>
            <v-checkbox
              v-for="src in fundingSources"
              :key="src"
              v-model="p1.funding_sources"
              :label="src"
              :value="src"
              color="primary"
              density="compact"
              hide-details
            />

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Transaction Details</p>

            <v-textarea
              v-model="p1.transaction_detail"
              label="Please explain in detail what this transaction is for."
              prepend-inner-icon="mdi-text-box"
              variant="outlined"
              rows="5"
              :rules="[required]"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="p1.asun_funding_info"
              label="If your club received funding from ASUN, include the date and amount funded (optional)"
              prepend-inner-icon="mdi-information-outline"
              variant="outlined"
              hint="e.g. 'Funded $500 on March 1, 2025'"
              persistent-hint
            />
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Prize/Gift/Award ── -->
      <v-card v-if="currentStepId === 'gift'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Prize / Gift / Award</p>
          <v-alert type="info" variant="tonal" rounded="lg" class="mb-5" density="compact">
            The Prize Receipt Form can be found on the ASUN website. Any individual that receives a Prize/Gift/Award will need to fill out a prize receipt form.
          </v-alert>
          <v-form v-model="p2Valid">
            <v-checkbox
              v-model="p2.prize_receipt_acknowledged"
              color="primary"
              :rules="[v => !!v || 'You must acknowledge this requirement.']"
            >
              <template #label>
                <span>* Any individual that receives a Prize/Gift/Award will need to fill out a prize receipt form</span>
              </template>
            </v-checkbox>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: UNR Name/Logo ── -->
      <v-card v-if="currentStepId === 'unr_logo'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Use of UNR Name / Logo</p>
          <v-form v-model="p3Valid">
            <p class="text-body-2 font-weight-medium mb-1">
              Will you be using any UNR logos (ASUN, academic department, CSE, etc.) or the UNR name on any of your purchases?
              If yes, please explain the design in the item description. <span class="text-error">*</span>
            </p>
            <v-radio-group v-model="p3.using_unr_logo" :rules="[v => v !== null || 'Required.']" inline>
              <v-radio label="Yes" :value="true" color="primary" />
              <v-radio label="No" :value="false" color="primary" />
            </v-radio-group>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Item Description (logo) ── -->
      <v-card v-if="currentStepId === 'logo_desc'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Item Description</p>
          <v-form v-model="p4Valid">
            <v-text-field
              v-model="p4.logo_description"
              label="Please describe your use of the University's name/logo in your requested items"
              prepend-inner-icon="mdi-image-outline"
              variant="outlined"
              :rules="[required]"
              required
            />
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Print Service ── -->
      <v-card v-if="currentStepId === 'print'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Stickers, Posters, Banner, Apparel, Tablecloth or Clothing</p>
          <v-alert type="info" variant="tonal" rounded="lg" class="mb-4" density="compact">
            Please request a Print Release Number from UNR Marketing &amp; Communications before proceeding.
            If you are an ASUN Department or a Club that received funding, you will need to have the ASUN logo on your items.
          </v-alert>
          <v-form v-model="p5Valid">
            <v-text-field
              v-model="p5.design_file_url"
              label="Design File URL (link to complete design of the item)"
              prepend-inner-icon="mdi-file-image-outline"
              variant="outlined"
              :rules="[required]"
              hint="Paste a Google Drive, Dropbox, or other link to your design file"
              persistent-hint
              class="mb-4"
              required
            />
            <v-text-field
              v-model="p5.print_release_number"
              label="Print Release Number"
              prepend-inner-icon="mdi-pound"
              variant="outlined"
              :rules="[required]"
              required
            />
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Event/Meeting/Gathering ── -->
      <v-card v-if="currentStepId === 'event'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Event / Meeting / Gathering</p>
          <v-form v-model="p6Valid">
            <v-text-field v-model="p6.event_name" label="Name of the Event" prepend-inner-icon="mdi-calendar-star" variant="outlined" :rules="[required]" required class="mb-3" />
            <v-text-field v-model="p6.event_location" label="Location of Event" prepend-inner-icon="mdi-map-marker" variant="outlined" :rules="[required]" required class="mb-3" />
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="p6.event_date" label="Date of the Event" type="date" prepend-inner-icon="mdi-calendar" variant="outlined" :rules="[required]" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="p6.event_timeframe" label="Time Frame of the Event" prepend-inner-icon="mdi-clock-outline" variant="outlined" :rules="[required]" placeholder="e.g. 2:00 PM – 5:00 PM" required />
              </v-col>
            </v-row>
            <v-text-field v-model.number="p6.num_attendees" label="Number of People in Attendance" type="number" prepend-inner-icon="mdi-account-group" variant="outlined" :rules="[required, positiveNumber]" required class="mb-3" />

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Attendee List</p>
            <v-textarea
              v-model="p6.attendee_names"
              label="If your event provides food for 20 people or less, list the names of attendees (one per line)"
              prepend-inner-icon="mdi-format-list-bulleted"
              variant="outlined"
              rows="5"
              :rules="[required]"
              required
              class="mb-4"
            />

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Event Flyer</p>
            <v-text-field
              v-model="p6.flyer_url"
              label="Event Flyer URL (required — include meeting agenda with Approved Budget if ASUN-related)"
              prepend-inner-icon="mdi-paperclip"
              variant="outlined"
              :rules="[required]"
              hint="Paste a Google Drive or other link to your event flyer"
              persistent-hint
              required
            />
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Invoices/Receipts ── -->
      <v-card v-if="currentStepId === 'vendors'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-1">Invoices / Receipts</p>
          <p class="text-body-2 text-medium-emphasis mb-5">Fill in the details for each vendor.</p>

          <div v-for="(vendor, i) in vendors" :key="i">
            <v-divider v-if="i > 0" class="my-6" />
            <p class="text-overline text-primary mb-3">Vendor #{{ i + 1 }}</p>
            <v-text-field
              v-model="vendor.receipt_url"
              :label="`Receipt / Invoice URL — Vendor #${i + 1}`"
              prepend-inner-icon="mdi-paperclip"
              variant="outlined"
              hint="Paste a link to a scanned receipt or invoice"
              persistent-hint
              class="mb-3"
            />
            <v-text-field
              v-model="vendor.vendor_name"
              :label="`Vendor #${i + 1} Name`"
              prepend-inner-icon="mdi-store"
              variant="outlined"
              :rules="[required]"
              required
              class="mb-3"
            />
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="vendor.approximate_amount"
                  :label="`Approximate Amount — Vendor #${i + 1} ($)`"
                  type="number" step="0.01" min="0"
                  prepend-inner-icon="mdi-currency-usd"
                  variant="outlined"
                  :rules="[required, positiveNumber]"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vendor.items_to_purchase"
                  :label="`Items to be Purchased — Vendor #${i + 1}`"
                  prepend-inner-icon="mdi-cart-outline"
                  variant="outlined"
                  :rules="[required]"
                  required
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model="vendor.reason_for_purchase"
              :label="`Reason for Purchase — Vendor #${i + 1}`"
              prepend-inner-icon="mdi-text-box"
              variant="outlined"
              :rules="[required]"
              required
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- ── STEP: ASUN/CSE Department Funding ── -->
      <v-card v-if="currentStepId === 'dept_funding'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">ASUN/CSE Department Funding</p>
          <v-form v-model="p8Valid">
            <v-select
              v-model="p8.department_account"
              :items="departmentAccounts"
              label="Department Account"
              prepend-inner-icon="mdi-bank-outline"
              variant="outlined"
              :rules="[required]"
              required
              class="mb-5"
            />
            <p class="text-body-2 font-weight-medium mb-1">Was a budget for this request approved in a public meeting? <span class="text-error">*</span></p>
            <v-radio-group v-model="p8.budget_approved" :rules="[v => !!v || 'Required.']" inline>
              <v-radio label="Yes" value="Yes" color="primary" />
              <v-radio label="No" value="No" color="primary" />
              <v-radio label="N/A" value="N/A" color="primary" />
            </v-radio-group>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Public Meeting Approval ── -->
      <v-card v-if="currentStepId === 'public_meeting'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Public Meeting Approval</p>
          <v-form v-model="p9Valid">
            <v-text-field
              v-model="p9.public_meeting_date"
              label="Public Meeting Approval Date"
              type="date"
              prepend-inner-icon="mdi-calendar-check"
              variant="outlined"
              :rules="[required]"
              required
            />
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP: Final / Signatures ── -->
      <v-card v-if="currentStepId === 'final'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-3">Contact Information</p>
          <v-form v-model="p10Valid">
            <v-text-field
              v-model="p10.email"
              label="Your Email (UNR email only — @unr.edu)"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              :rules="[required, (v: string) => /^[^@]+@unr\.edu$/i.test(v) || 'Must be a valid @unr.edu email.']"
              required
              class="mb-5"
            />

            <v-divider class="mb-4" />
            <p class="text-overline text-primary mb-1">Signatures & Verification</p>
            <v-alert type="info" variant="tonal" rounded="lg" class="mb-4" density="compact">
              In order to proceed and submit this request, you must check all of the following:
            </v-alert>

            <v-checkbox
              v-model="p10.asun_employee_verified"
              color="primary"
              :rules="[v => !!v || 'Required.']"
              class="mb-2"
            >
              <template #label>
                <span><strong>*</strong> ASUN Employee Verification</span>
              </template>
            </v-checkbox>

            <v-checkbox
              v-model="p10.officer_signature"
              color="primary"
              :rules="[v => !!v || 'Required.']"
              class="mb-2"
            >
              <template #label>
                <span><strong>*</strong> ASUN/Club Officer/Director Signature</span>
              </template>
            </v-checkbox>

            <v-checkbox
              v-model="p10.faculty_signature"
              color="primary"
              :rules="[v => !!v || 'Required.']"
            >
              <template #label>
                <span><strong>*</strong> CSE Administrative Faculty Signature</span>
              </template>
            </v-checkbox>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── Navigation Buttons ── -->
      <div class="d-flex justify-space-between mt-5">
        <v-btn
          v-if="currentStep > 0"
          variant="outlined"
          color="secondary"
          prepend-icon="mdi-arrow-left"
          rounded="lg"
          @click="prevStep"
        >Previous</v-btn>
        <v-spacer v-else />

        <v-btn
          v-if="currentStepId !== 'final'"
          color="primary"
          append-icon="mdi-arrow-right"
          rounded="lg"
          @click="nextStep"
        >Next</v-btn>

        <div class="d-flex" style="gap: 12px;">
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-download"
            rounded="lg"
            @click="downloadPCardPDF(p1)"
          >Download PDF</v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-send"
            rounded="lg"
            :loading="loading"
            @click="handleSubmit"
          >Submit Request</v-btn>
        </div>
      </div>

    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="4000">
      <v-icon start>mdi-check-circle</v-icon> P-Card request submitted successfully!
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="4000">
      <v-icon start>mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
  </DashboardLayout>
</template>