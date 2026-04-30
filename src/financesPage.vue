<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { downloadTransactionPDF, downloadTransactionReportPDF } from '@/formPDF'
import useClubStore from '@/stores/clubStore'
import useUserStore from '@/stores/user'
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import { feathersClient } from '@/backendAPI'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const clubStore = useClubStore()
const userStore = useUserStore()
const transactions = ref<any[]>([])
const loading = ref(false)
const addDialog = ref(false)
const deleteDialog = ref(false)
const deleteTarget = ref<any>(null)
const snackbar = ref({ show: false, message: '', color: '' })
const filterCategory = ref('')
const filterType = ref('')
const searchQuery = ref('')
const formValid = ref(false)
const formLoading = ref(false)

const newTx = ref({
  title: '',
  amount: null as number | null,
  type: 'expense',
  category: '',
  transaction_date: new Date().toISOString().slice(0, 10),
  description: '',
})

// Expanded categories
const expenseCategories = [
  'Event Expenses',
  'Office Supplies',
  'Food & Beverage',
  'Transportation',
  'Technology',
  'Marketing / Printing',
  'Dues / Fees',
  'Venue / Facility',
  'Equipment',
  'Awards / Gifts',
  'Travel & Lodging',
  'Uniforms / Apparel',
  'Other',
]

const incomeCategories = [
  'Dues Collected',
  'Fundraising',
  'Cash Sale',
  'Sponsorship',
  'University Allocation',
  'Donations',
  'Grants',
  'Ticket Sales',
  'Merchandise Sales',
  'Interest / Investment',
  'Other',
]

const allCategories = computed(() => newTx.value.type === 'income' ? incomeCategories : expenseCategories)
const allFilterCategories = [...new Set([...expenseCategories, ...incomeCategories])]

onMounted(async () => { await loadTransactions() })

function currentUserId() {
  const authUser = authStore.user as any
  return userStore.id ?? authUser?.id ?? authUser?.user_id ?? null
}

async function resolveClubId() {
  if (clubStore.id) return clubStore.id

  const userId = currentUserId()
  if (!userId) throw new Error('You must be logged in to manage transactions.')

  const membership = await feathersClient.service('ClubMembership').find({
    query: { userid: userId, is_active: true, $limit: 1 }
  })
  const rows = membership.data ?? membership
  const clubId = rows[0]?.clubid

  if (!clubId) throw new Error('No active club membership found.')
  return clubId
}

async function loadTransactions() {
  loading.value = true
  try {
    const clubId = await resolveClubId()
    const result = await feathersClient.service('transactions').find({
      query: { club: clubId, $limit: 500, $sort: { transaction_date: -1 } }
    })
    transactions.value = Array.isArray(result) ? result : result.data ?? []
  } catch (e: any) {
    showSnack('Failed to load transactions.', 'error')
  } finally {
    loading.value = false
  }
}

const filteredTransactions = computed(() => transactions.value.filter((tx) => {
  const q = searchQuery.value.toLowerCase()
  const matchSearch = !q || tx.title?.toLowerCase().includes(q) || tx.category?.toLowerCase().includes(q) || tx.description?.toLowerCase().includes(q)
  const matchCat = !filterCategory.value || tx.category === filterCategory.value
  const matchType = !filterType.value || tx.type === filterType.value
  return matchSearch && matchCat && matchType
}))

function signedAmount(tx: any) {
  const amount = Number(tx.amount) || 0
  return tx.type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
}

const totalBalance = computed(() => transactions.value.reduce((sum, tx) => sum + signedAmount(tx), 0))
const totalIncome = computed(() => transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0))
const totalExpenses = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0))

async function submitTransaction() {
  if (!formValid.value) return
  formLoading.value = true
  try {
    const userId = currentUserId()
    if (!userId) throw new Error('You must be logged in to add a transaction.')

    const clubId = await resolveClubId()
    const created = await feathersClient.service('transactions').create({
      club: clubId,
      created_by: userId,
      type: newTx.value.type,
      title: newTx.value.title,
      amount: Math.abs(Number(newTx.value.amount)),
      description: newTx.value.description || undefined,
      transaction_date: newTx.value.transaction_date,
      category: newTx.value.category,
    })
    transactions.value.unshift(created)
    addDialog.value = false
    resetForm()
    showSnack('Transaction added!', 'success')
  } catch (e: any) {
    showSnack(e?.message || 'Failed to add transaction.', 'error')
  } finally {
    formLoading.value = false
  }
}

function confirmDelete(tx: any) { deleteTarget.value = tx; deleteDialog.value = true }

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await feathersClient.service('transactions').remove(deleteTarget.value.id)
    transactions.value = transactions.value.filter(t => t.id !== deleteTarget.value.id)
    showSnack('Transaction deleted.', 'info')
  } catch { showSnack('Failed to delete.', 'error') }
  finally { deleteDialog.value = false; deleteTarget.value = null }
}

function resetForm() {
  newTx.value = {
    title: '', amount: null, type: 'expense', category: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    description: '',
  }
}

function showSnack(message: string, color: string) { snackbar.value = { show: true, message, color } }
function formatCurrency(val: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val) }
function formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
const required = (v: any) => !!v || 'Required.'
const positiveNumber = (v: any) => (!!v && Number(v) > 0) || 'Must be > 0.'
</script>

<template>
  <DashboardLayout>
    <v-container max-width="1100">

      <!-- Page Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Club Finances</h1>
          <p class="text-medium-emphasis mt-1">Track income, expenses, and your club's balance.</p>
        </div>
        <div class="d-flex" style="gap: 10px;">
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-file-chart-outline"
            rounded="lg"
            @click="downloadTransactionReportPDF(filteredTransactions, clubStore.name, { type: filterType, category: filterCategory, search: searchQuery })"
            :disabled="filteredTransactions.length === 0"
          >Download Report</v-btn>
          <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="addDialog = true">
            Add Transaction
          </v-btn>
        </div>
      </div>

      <!-- Summary Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card :color="totalBalance >= 0 ? 'primary' : 'error'" rounded="lg" elevation="3" class="pa-4 text-white">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-overline opacity-80">Total Balance</span>
              <v-icon>mdi-bank</v-icon>
            </div>
            <p class="text-h4 font-weight-bold">{{ formatCurrency(totalBalance) }}</p>
            <p class="text-caption opacity-70 mt-1">All time net</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card rounded="lg" elevation="2" class="pa-4" color="green-lighten-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-overline text-medium-emphasis">Total Income</span>
              <v-icon color="success">mdi-trending-up</v-icon>
            </div>
            <p class="text-h4 font-weight-bold text-success">{{ formatCurrency(totalIncome) }}</p>
            <p class="text-caption text-medium-emphasis mt-1">{{ transactions.filter(t => t.type === 'income').length }} transactions</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card rounded="lg" elevation="2" class="pa-4" color="red-lighten-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-overline text-medium-emphasis">Total Expenses</span>
              <v-icon color="error">mdi-trending-down</v-icon>
            </div>
            <p class="text-h4 font-weight-bold text-error">{{ formatCurrency(totalExpenses) }}</p>
            <p class="text-caption text-medium-emphasis mt-1">{{ transactions.filter(t => t.type === 'expense').length }} transactions</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card elevation="1" rounded="lg" class="pa-4 mb-4">
        <v-row align="center" dense>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="searchQuery"
              label="Search transactions..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined" density="compact" clearable hide-details
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filterCategory"
              :items="['', ...allFilterCategories]"
              label="Category"
              variant="outlined" density="compact" clearable hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn-toggle v-model="filterType" density="compact" rounded="lg" mandatory>
              <v-btn value="" size="small">All</v-btn>
              <v-btn value="income" size="small" color="success">Income</v-btn>
              <v-btn value="expense" size="small" color="error">Expense</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card>

      <!-- Transaction List -->
      <v-card elevation="2" rounded="lg">
        <v-card-title class="px-6 pt-5 pb-2">
          <span class="text-h6">Transactions</span>
          <v-chip class="ml-2" size="small" color="primary" variant="tonal">{{ filteredTransactions.length }}</v-chip>
        </v-card-title>

        <div v-if="loading" class="pa-6">
          <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-two-line" class="mb-2" />
        </div>

        <div v-else-if="filteredTransactions.length === 0" class="text-center py-16">
          <v-icon size="56" color="grey-lighten-1">mdi-cash-off</v-icon>
          <p class="text-h6 mt-3 text-medium-emphasis">No transactions found.</p>
          <v-btn color="primary" variant="text" class="mt-1" @click="addDialog = true">Add your first transaction</v-btn>
        </div>

        <v-list v-else lines="two" class="pa-0">
          <template v-for="(tx, idx) in filteredTransactions" :key="tx.id">
            <v-divider v-if="idx > 0" />
            <v-list-item class="py-3 px-6">
              <template #prepend>
                <v-avatar :color="tx.type === 'income' ? 'success' : 'error'" variant="tonal" size="42">
                  <v-icon size="20">{{ tx.type === 'income' ? 'mdi-arrow-down-circle' : 'mdi-arrow-up-circle' }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">{{ tx.title }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" variant="tonal" color="blue-grey" class="mr-2">{{ tx.category }}</v-chip>
                <span class="text-caption text-medium-emphasis">{{ formatDate(tx.transaction_date) }}</span>
                <span v-if="tx.description" class="text-caption text-medium-emphasis ml-2">· {{ tx.description }}</span>
              </v-list-item-subtitle>
              <template #append>
                <div class="d-flex align-center" style="gap: 8px;">
                  <span :class="['text-h6', 'font-weight-bold', tx.type === 'income' ? 'text-success' : 'text-error']">
                    {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(Number(tx.amount) || 0)) }}
                  </span>
                  <v-btn icon="mdi-receipt" size="small" variant="text" color="primary" @click="downloadTransactionPDF(tx, clubStore.name)" />
                  <v-btn icon="mdi-delete-outline" size="small" variant="text" color="grey" @click="confirmDelete(tx)" />
                </div>
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-container>

    <!-- ── Add Transaction Dialog ── -->
    <v-dialog v-model="addDialog" max-width="580" persistent>
      <v-card rounded="lg">
        <v-card-title class="pa-5 pb-3">
          <v-icon start color="primary">mdi-plus-circle</v-icon> Add Transaction
        </v-card-title>
        <v-divider />

        <v-card-text class="pa-5" style="max-height: 70vh; overflow-y: auto;">
          <v-form v-model="formValid" @submit.prevent="submitTransaction">

            <!-- Type Toggle -->
            <v-btn-toggle v-model="newTx.type" mandatory rounded="lg" class="mb-5 w-100">
              <v-btn value="expense" color="error" style="flex:1">
                <v-icon start>mdi-minus-circle</v-icon>Expense
              </v-btn>
              <v-btn value="income" color="success" style="flex:1">
                <v-icon start>mdi-plus-circle</v-icon>Income
              </v-btn>
            </v-btn-toggle>

            <!-- Basic Info -->
            <p class="text-overline text-primary mb-3">Transaction Details</p>
            <v-text-field
              v-model="newTx.title"
              label="Title / Description"
              prepend-inner-icon="mdi-format-title"
              :rules="[required]"
              variant="outlined"
              class="mb-3"
            />

            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newTx.amount"
                  label="Amount ($)"
                  type="number"
                  step="0.01" min="0.01"
                  :rules="[required, positiveNumber]"
                  prepend-inner-icon="mdi-currency-usd"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="newTx.transaction_date"
                  label="Date"
                  type="date"
                  :rules="[required]"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-select
              v-model="newTx.category"
              :items="allCategories"
              label="Category"
              prepend-inner-icon="mdi-tag-outline"
              :rules="[required]"
              variant="outlined"
            />

            <v-divider class="my-4" />

            <p class="text-overline text-primary mb-3">Description</p>
            <v-textarea
              v-model="newTx.description"
              label="Description (optional)"
              prepend-inner-icon="mdi-note-text"
              variant="outlined"
              rows="2"
              hide-details
            />

          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="addDialog = false; resetForm()">Cancel</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            rounded="lg"
            :loading="formLoading"
            :disabled="!formValid"
            prepend-icon="mdi-check"
            @click="submitTransaction"
          >Save Transaction</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Delete Dialog ── -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pa-5">Delete Transaction?</v-card-title>
        <v-card-text class="pb-2">
          Are you sure you want to delete <strong>{{ deleteTarget?.title }}</strong>? This cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn color="error" prepend-icon="mdi-delete" @click="doDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </DashboardLayout>
</template>
