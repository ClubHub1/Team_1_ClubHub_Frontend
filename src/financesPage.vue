<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue'
import { feathersClient } from '@/backendAPI'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
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
  title: '', amount: null as number | null, type: 'expense',
  category: '', transaction_date: new Date().toISOString().slice(0, 10), notes: '',
})

const expenseCategories = ['Event Expenses','Office Supplies','Food & Beverage','Transportation','Technology','Marketing','Dues / Fees','Other']
const incomeCategories = ['Dues Collected','Fundraising','Sponsorship','University Allocation','Donations','Other']
const allCategories = computed(() => newTx.value.type === 'income' ? incomeCategories : expenseCategories)
const allFilterCategories = [...new Set([...expenseCategories, ...incomeCategories])]

onMounted(async () => { await loadTransactions() })

async function loadTransactions() {
  loading.value = true
  try {
    const user = authStore.user
    const membership = await feathersClient.service('Club Membership').find({
      query: { userid: user.user_id, is_active: true, $limit: 1 }
    })
    const rows = membership.data ?? membership
    const clubId = rows[0]?.clubid
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
  const matchSearch = !q || tx.title?.toLowerCase().includes(q) || tx.category?.toLowerCase().includes(q)
  const matchCat = !filterCategory.value || tx.category === filterCategory.value
  const matchType = !filterType.value ||
    (filterType.value === 'income' && tx.amount > 0) ||
    (filterType.value === 'expense' && tx.amount < 0)
  return matchSearch && matchCat && matchType
}))

const totalBalance = computed(() => transactions.value.reduce((sum, tx) => sum + Number(tx.amount), 0))
const totalIncome = computed(() => transactions.value.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0))
const totalExpenses = computed(() => transactions.value.filter(t => t.amount < 0).reduce((s, t) => s + Number(t.amount), 0))

async function submitTransaction() {
  if (!formValid.value) return
  formLoading.value = true
  try {
    const user = authStore.user
    const membership = await feathersClient.service('Club Membership').find({
      query: { userid: user.user_id, is_active: true, $limit: 1 }
    })
    const rows = membership.data ?? membership
    const clubId = rows[0]?.clubid
    const signedAmount = newTx.value.type === 'expense' ? -Math.abs(newTx.value.amount!) : Math.abs(newTx.value.amount!)
    const created = await feathersClient.service('transactions').create({
      club: clubId, created_by: user.user_id, title: newTx.value.title,
      amount: signedAmount, category: newTx.value.category,
      transaction_date: newTx.value.transaction_date, notes: newTx.value.notes,
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
    await feathersClient.service('transactions').remove(deleteTarget.value.transaction_id)
    transactions.value = transactions.value.filter(t => t.transaction_id !== deleteTarget.value.transaction_id)
    showSnack('Transaction deleted.', 'info')
  } catch { showSnack('Failed to delete.', 'error') }
  finally { deleteDialog.value = false; deleteTarget.value = null }
}

function resetForm() {
  newTx.value = { title: '', amount: null, type: 'expense', category: '',
    transaction_date: new Date().toISOString().slice(0, 10), notes: '' }
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
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Club Finances</h1>
          <p class="text-medium-emphasis mt-1">Track income, expenses, and your club's balance.</p>
        </div>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="addDialog = true">Add Transaction</v-btn>
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
            <p class="text-caption text-medium-emphasis mt-1">{{ transactions.filter(t => t.amount > 0).length }} transactions</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card rounded="lg" elevation="2" class="pa-4" color="red-lighten-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-overline text-medium-emphasis">Total Expenses</span>
              <v-icon color="error">mdi-trending-down</v-icon>
            </div>
            <p class="text-h4 font-weight-bold text-error">{{ formatCurrency(totalExpenses) }}</p>
            <p class="text-caption text-medium-emphasis mt-1">{{ transactions.filter(t => t.amount < 0).length }} transactions</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card elevation="1" rounded="lg" class="pa-4 mb-4">
        <v-row align="center" dense>
          <v-col cols="12" sm="5">
            <v-text-field v-model="searchQuery" label="Search transactions..."
              prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable hide-details />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select v-model="filterCategory" :items="['', ...allFilterCategories]"
              label="Category" variant="outlined" density="compact" clearable hide-details />
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
          <template v-for="(tx, idx) in filteredTransactions" :key="tx.transaction_id">
            <v-divider v-if="idx > 0" />
            <v-list-item class="py-3 px-6">
              <template #prepend>
                <v-avatar :color="tx.amount > 0 ? 'success' : 'error'" variant="tonal" size="42">
                  <v-icon size="20">{{ tx.amount > 0 ? 'mdi-arrow-down-circle' : 'mdi-arrow-up-circle' }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">{{ tx.title }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" variant="tonal" color="blue-grey" class="mr-2">{{ tx.category }}</v-chip>
                <span class="text-caption text-medium-emphasis">{{ formatDate(tx.transaction_date) }}</span>
                <span v-if="tx.notes" class="text-caption text-medium-emphasis ml-2">· {{ tx.notes }}</span>
              </v-list-item-subtitle>
              <template #append>
                <div class="d-flex align-center gap-3">
                  <span :class="['text-h6','font-weight-bold', tx.amount > 0 ? 'text-success' : 'text-error']">
                    {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                  </span>
                  <v-btn icon="mdi-delete-outline" size="small" variant="text" color="grey" @click="confirmDelete(tx)" />
                </div>
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-container>

    <!-- Add Dialog -->
    <v-dialog v-model="addDialog" max-width="520" persistent>
      <v-card rounded="lg">
        <v-card-title class="pa-5 pb-3">
          <v-icon start color="primary">mdi-plus-circle</v-icon> Add Transaction
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-form v-model="formValid" @submit.prevent="submitTransaction">
            <v-btn-toggle v-model="newTx.type" mandatory rounded="lg" class="mb-5 w-100">
              <v-btn value="expense" color="error" style="flex:1"><v-icon start>mdi-minus-circle</v-icon>Expense</v-btn>
              <v-btn value="income" color="success" style="flex:1"><v-icon start>mdi-plus-circle</v-icon>Income</v-btn>
            </v-btn-toggle>
            <v-text-field v-model="newTx.title" label="Title" :rules="[required]" variant="outlined" class="mb-3" />
            <v-row dense>
              <v-col cols="6">
                <v-text-field v-model.number="newTx.amount" label="Amount ($)" type="number"
                  step="0.01" min="0.01" :rules="[required, positiveNumber]"
                  prepend-inner-icon="mdi-currency-usd" variant="outlined" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="newTx.transaction_date" label="Date" type="date"
                  :rules="[required]" variant="outlined" />
              </v-col>
            </v-row>
            <v-select v-model="newTx.category" :items="allCategories" label="Category"
              :rules="[required]" variant="outlined" class="mb-3" />
            <v-textarea v-model="newTx.notes" label="Notes (optional)" variant="outlined" rows="2" hide-details />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="addDialog = false; resetForm()">Cancel</v-btn>
          <v-spacer />
          <v-btn color="primary" :loading="formLoading" :disabled="!formValid"
            @click="submitTransaction" prepend-icon="mdi-check">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pa-5">Delete Transaction?</v-card-title>
        <v-card-text class="pb-2">
          Are you sure you want to delete <strong>{{ deleteTarget?.title }}</strong>? This cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn color="error" @click="doDelete" prepend-icon="mdi-delete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">{{ snackbar.message }}</v-snackbar>
  </DashboardLayout>
</template>
