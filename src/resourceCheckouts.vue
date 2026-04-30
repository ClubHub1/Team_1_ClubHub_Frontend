<script setup lang="ts">
import { ref, computed } from 'vue'
import { downloadResourceCheckoutPDF } from '@/formPDF'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import { feathersClient } from '@/backendAPI'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const submitted = ref(false)
const submittedData = ref<any>(null)
const successSnackbar = ref(false)
const errorSnackbar = ref(false)
const errorMessage = ref('')

const currentStep = ref(0)

// ── Step 1: Event Information ──
const p1 = ref({
  full_name: '',
  email: '',
  club_name: '',
  leadership_position: '',
  other_position: '',
  event_title: '',
  checkout_date: '',
  checkout_time: '',
  return_date: '',
  return_time: '',
})
const p1Valid = ref(false)

const leadershipPositions = [
  'President', 'Vice President', 'Treasurer',
  'Advisor', 'Secretary', 'Historian', 'Other',
]

// ── Step 2: Items for Checkout ──
const availableItems = [
  { id: 'first_aid_kit',        label: 'Basic First Aid Kit',    icon: 'mdi-medical-bag' },
  { id: 'extension_cord',       label: 'Extension Cord',         icon: 'mdi-power-plug' },
  { id: 'megaphone',            label: 'Megaphone',              icon: 'mdi-bullhorn' },
  { id: 'recycling_bin',        label: 'Recycling Bin',          icon: 'mdi-recycle' },
  { id: 'traffic_cones',        label: 'Traffic Cones',          icon: 'mdi-alert-octagon' },
  { id: 'small_cones',          label: 'Small Cones',            icon: 'mdi-alert' },
  { id: 'disposable_masks',     label: 'Disposable Masks',       icon: 'mdi-face-mask' },
  { id: 'hand_sanitizer',       label: 'Hand Sanitizer',         icon: 'mdi-hand-wash' },
  { id: 'paper_towels',         label: 'Paper Towels',           icon: 'mdi-paper-roll' },
  { id: 'large_ice_cooler',     label: 'Large Ice Cooler (2)',   icon: 'mdi-fridge-outline' },
  { id: 'small_cooler',         label: 'Small Cooler',           icon: 'mdi-fridge' },
  { id: 'beverage_cooler',      label: 'Beverage Cooler (3)',    icon: 'mdi-cup-water' },
  { id: 'popcorn_machine',      label: 'Popcorn Machine',        icon: 'mdi-popcorn' },
  { id: 'chafing_dish',         label: 'Chafing Dish (4)',       icon: 'mdi-pot-steam' },
  { id: 'crock_pot',            label: 'Crock Pot (2)',          icon: 'mdi-pot' },
  { id: 'fire_extinguisher',    label: 'Fire Extinguisher',      icon: 'mdi-fire-extinguisher' },
  { id: 'cotton_candy_machine', label: 'Cotton Candy Machine',   icon: 'mdi-shaker-outline' },
  { id: 'coffee_urn',           label: 'Coffee Urn',             icon: 'mdi-coffee' },
  { id: 'tarps',                label: 'Tarps',                  icon: 'mdi-image-filter-hdr' },
  { id: 'cornhole',             label: 'Cornhole (3)',           icon: 'mdi-bullseye' },
  { id: 'giant_connect_4',      label: 'Giant Connect 4',        icon: 'mdi-dots-grid' },
  { id: 'spikeball',            label: 'Spikeball (3)',          icon: 'mdi-volleyball' },
  { id: 'box_of_utensils',      label: 'Box of Utensils',        icon: 'mdi-silverware-fork-knife' },
  { id: 'water_kettle',         label: 'Water Kettle',           icon: 'mdi-kettle' },
  { id: 'decibel_meter',        label: 'Decibel Meter',          icon: 'mdi-volume-high' },
]

const selectedItems = ref<string[]>([])
const quantityNotes = ref('')
const p2Valid = ref(false)

// ── Step 3: Acknowledgements ──
const ack = ref({
  return_24hrs: false,
  late_return: false,
  on_campus: false,
  must_clean: false,
  financially_responsible: false,
  policy_warning: false,
  food_equipment: false,
})
const p3Valid = ref(false)

const allSteps = ['event_info', 'items', 'acknowledgements']
const stepTitles = ['Event Information', 'Items for Checkout', 'Acknowledgements']
const currentStepId = computed(() => allSteps[currentStep.value])
const totalSteps = computed(() => allSteps.length)

function nextStep() { if (currentStep.value < totalSteps.value - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }

function toggleItem(id: string) {
  const idx = selectedItems.value.indexOf(id)
  if (idx === -1) selectedItems.value.push(id)
  else selectedItems.value.splice(idx, 1)
}

async function handleSubmit() {
  loading.value = true
  try {
    const user = authStore.user
    const membership = await feathersClient.service('Club Membership').find({
      query: { 'user': user.id, is_active: true, $limit: 1 }
    })
    const rows = membership.data ?? membership
    const clubId = rows[0]?.club

    await feathersClient.service('resource-checkouts').create({
      club: clubId,
      requested_by: user.id,
      ...p1.value,
      requested_items: selectedItems.value,
      quantity_notes: quantityNotes.value,
      ...ack.value,
    })
    submittedData.value = { ...p1.value, ...ack.value, requested_items: [...selectedItems.value], quantity_notes: quantityNotes.value }
    submitted.value = true
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
const allAcknowledged = computed(() => Object.values(ack.value).every(v => v))
</script>

<template>
  <DashboardLayout>
    <v-container max-width="800">

      <!-- Page Header -->
      <div class="mb-6">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2 pl-0" @click="router.back()">Back</v-btn>
        <h1 class="text-h4 font-weight-bold">Club Resource Checkout</h1>
        <p class="text-medium-emphasis mt-1">ASUN Club Resource Checkout Request</p>
      </div>

      <!-- Progress Bar -->
      <v-card elevation="1" rounded="lg" class="pa-4 mb-5">
        <div class="d-flex align-center justify-space-between">
          <span class="text-body-2 text-medium-emphasis">Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
          <v-chip color="primary" variant="tonal" size="small">{{ stepTitles[currentStep] }}</v-chip>
        </div>
        <v-progress-linear
          :model-value="((currentStep + 1) / totalSteps) * 100"
          color="primary"
          rounded
          height="6"
          class="mt-3"
        />
      </v-card>

      <template v-if="!submitted">
      <!-- ── STEP 1: Event Information ── -->
      <v-card v-if="currentStepId === 'event_info'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">

          <!-- Info Alert -->
          <v-alert type="info" variant="tonal" rounded="lg" class="mb-5" density="compact">
            <div class="font-weight-bold mb-1">ASUN Club Resource Request</div>
            Club resources are provided by ASUN free of charge and are available to ASUN recognized Clubs and Organizations meeting the following guidelines:
            <ul class="mt-2 ml-4">
              <li>Club or organization is in good standing with Central Station.</li>
              <li>Resource request is received a minimum of two (2) business days prior to the requested pick-up day.</li>
              <li>Event has been approved by SEAB.</li>
            </ul>
            <div class="mt-3">
              Requests are evaluated for availability on a first-come, first-serve basis.
              Clubs and Organizations may use the kitchen located within the Center for Student Engagement for <strong><em>food preparation only</em></strong>!
              <strong>You CANNOT cook or take any food, only prepare items.</strong>
              If you have any questions, please contact Front Desk, 775-784-6589.
            </div>
            <div class="mt-2 font-weight-bold">
              The Club President, Treasurer or Non-recognized Student Group Requester MUST be present to collect club resources!
            </div>
          </v-alert>

          <v-form v-model="p1Valid">
            <p class="text-overline text-primary mb-3">Requestor Information</p>

            <v-text-field
              v-model="p1.full_name"
              label="Name (First and Last)"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="[required]"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="p1.email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              :rules="[required, (v: string) => /.+@.+\..+/.test(v) || 'Enter a valid email.']"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="p1.club_name"
              label="Club / Organization Name"
              prepend-inner-icon="mdi-account-group"
              variant="outlined"
              :rules="[required]"
              required
              class="mb-3"
            />
            <v-select
              v-model="p1.leadership_position"
              :items="leadershipPositions"
              label="Leadership Position in Club / Organization"
              prepend-inner-icon="mdi-badge-account"
              variant="outlined"
              :rules="[required]"
              required
              class="mb-3"
            />
            <v-text-field
              v-if="p1.leadership_position === 'Other'"
              v-model="p1.other_position"
              label="Please specify your position"
              prepend-inner-icon="mdi-pencil"
              variant="outlined"
              class="mb-3"
            />

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Event Details</p>

            <v-text-field
              v-model="p1.event_title"
              label="Event Title"
              prepend-inner-icon="mdi-calendar-star"
              variant="outlined"
              :rules="[required]"
              required
              class="mb-3"
            />

            <v-divider class="my-4" />
            <p class="text-overline text-primary mb-3">Checkout & Return Schedule</p>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="p1.checkout_date"
                  label="Checkout Date"
                  type="date"
                  prepend-inner-icon="mdi-calendar-arrow-right"
                  variant="outlined"
                  :rules="[required]"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="p1.checkout_time"
                  label="Checkout Time (e.g. 10:00 AM)"
                  prepend-inner-icon="mdi-clock-outline"
                  variant="outlined"
                  :rules="[required]"
                  placeholder="e.g. 10:00 AM"
                  required
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="p1.return_date"
                  label="Return Date"
                  type="date"
                  prepend-inner-icon="mdi-calendar-arrow-left"
                  variant="outlined"
                  :rules="[required]"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="p1.return_time"
                  label="Return Time (e.g. 10:00 AM)"
                  prepend-inner-icon="mdi-clock-check-outline"
                  variant="outlined"
                  :rules="[required]"
                  placeholder="e.g. 10:00 AM"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ── STEP 2: Items for Checkout ── -->
      <v-card v-if="currentStepId === 'items'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-1">Items for Checkout</p>
          <p class="text-body-2 text-medium-emphasis mb-4">Select all items you are requesting. Items with a quantity in their name are subject to availability.</p>

          <v-alert type="info" variant="tonal" rounded="lg" class="mb-5" density="compact">
            The following are items you can request. Please select any item that you are requesting.
          </v-alert>

          <!-- Item Gallery Grid -->
          <v-row dense>
            <v-col
              v-for="item in availableItems"
              :key="item.id"
              cols="6" sm="4" md="3"
            >
              <v-card
                :variant="selectedItems.includes(item.id) ? 'flat' : 'outlined'"
                :color="selectedItems.includes(item.id) ? 'primary' : undefined"
                rounded="lg"
                class="pa-3 text-center cursor-pointer item-card"
                :class="{ 'selected-item': selectedItems.includes(item.id) }"
                @click="toggleItem(item.id)"
                hover
              >
                <v-icon
                  :icon="item.icon"
                  size="32"
                  :color="selectedItems.includes(item.id) ? 'white' : 'primary'"
                  class="mb-2"
                />
                <p
                  class="text-caption font-weight-medium ma-0"
                  :class="selectedItems.includes(item.id) ? 'text-white' : ''"
                  style="line-height: 1.3;"
                >{{ item.label }}</p>
                <v-icon
                  v-if="selectedItems.includes(item.id)"
                  icon="mdi-check-circle"
                  size="16"
                  color="white"
                  class="mt-1"
                />
              </v-card>
            </v-col>
          </v-row>

          <v-alert v-if="selectedItems.length === 0" type="warning" variant="tonal" rounded="lg" class="mt-4" density="compact">
            Please select at least one item to request.
          </v-alert>

          <v-chip-group v-if="selectedItems.length > 0" class="mt-4">
            <v-chip
              v-for="id in selectedItems"
              :key="id"
              color="primary"
              variant="tonal"
              size="small"
              closable
              @click:close="toggleItem(id)"
            >{{ availableItems.find(i => i.id === id)?.label }}</v-chip>
          </v-chip-group>

          <v-divider class="my-5" />
          <p class="text-overline text-primary mb-2">Quantity Notes</p>
          <v-text-field
            v-model="quantityNotes"
            label="For items with a quantity listed, please specify how many you need. If not applicable, enter N/A."
            prepend-inner-icon="mdi-counter"
            variant="outlined"
            :rules="[required]"
            hint="e.g. 'Large Ice Cooler: 1, Beverage Cooler: 2' or 'N/A'"
            persistent-hint
            required
          />
        </v-card-text>
      </v-card>

      <!-- ── STEP 3: Acknowledgements ── -->
      <v-card v-if="currentStepId === 'acknowledgements'" elevation="2" rounded="lg">
        <v-card-text class="pa-6">
          <p class="text-overline text-primary mb-1">Acknowledgements</p>
          <p class="text-body-2 text-medium-emphasis mb-4">Please acknowledge and agree to all of the following requirements before submitting your request.</p>

          <v-alert type="info" variant="tonal" rounded="lg" class="mb-5" density="compact">
            Please acknowledge and agree to the following requirements before requesting items.
          </v-alert>

          <v-checkbox
            v-model="ack.return_24hrs"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> Resources must be returned within 24 hours (including all parts if applicable).</span>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="ack.late_return"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> If your event ends after the ASUN Center for Student Engagement is closed, please return the resources by 10:00 a.m. the following day.</span>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="ack.on_campus"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> Resources are to remain on campus unless permission has been granted otherwise. They are not for personal use.</span>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="ack.must_clean"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> All resources must be cleaned before being returned. Front Desk staff will not accept items that have not been cleaned.</span>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="ack.financially_responsible"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> You or your organization may be held financially responsible if resources are damaged or lost.</span>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="ack.policy_warning"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> Failure to follow these policies will result in a warning. In the case of multiple instances, resource checkout privileges will be revoked.</span>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="ack.food_equipment"
            color="primary"
            :rules="[v => !!v || 'Required.']"
            class="mb-1"
          >
            <template #label>
              <span><strong>*</strong> If you are checking out food equipment, you/your club is aware that you must purchase the food and supplies necessary. Please remember that events with food may require approval from an SEAB meeting.</span>
            </template>
          </v-checkbox>

          <v-alert type="info" variant="tonal" rounded="lg" class="mt-4" density="compact">
            Please remember to submit your form after clicking "Submit Request" at the bottom.
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- Navigation Buttons -->
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
          v-if="currentStepId !== 'acknowledgements'"
          color="primary"
          append-icon="mdi-arrow-right"
          rounded="lg"
          :disabled="currentStepId === 'items' && selectedItems.length === 0"
          @click="nextStep"
        >Next</v-btn>
        <v-btn
          v-else
          color="primary"
          prepend-icon="mdi-send"
          rounded="lg"
          :loading="loading"
          :disabled="!allAcknowledged"
          @click="handleSubmit"
        >Submit Request</v-btn>
      </div>
      </template>

      <!-- ── Success State ── -->
      <v-card v-if="submitted" elevation="2" rounded="lg" class="mt-5">
        <v-card-text class="pa-8 text-center">
          <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
          <h2 class="text-h5 font-weight-bold mb-2">Request Submitted!</h2>
          <p class="text-medium-emphasis mb-6">Your resource checkout request has been submitted. Download a copy for your records.</p>
          <div class="d-flex justify-center" style="gap: 12px;">
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-download" rounded="lg" @click="downloadResourceCheckoutPDF(submittedData)">
              Download PDF
            </v-btn>
            <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" @click="submitted = false; currentStep = 0">
              Submit Another
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="4000">
      <v-icon start>mdi-check-circle</v-icon> Resource checkout request submitted successfully!
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="4000">
      <v-icon start>mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
  </DashboardLayout>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.item-card {
  transition: all 0.15s ease;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>