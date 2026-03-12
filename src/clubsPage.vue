<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './components/icon.vue'

const router = useRouter()

const searchQuery = ref("")
const selectedTags = ref<string[]>([])
const selectedStatus = ref<string[]>([])
const allTags = ref(["Sports", "Technology", "Arts", "Community", "Academic",
  "Competitive", "Volunteering", "Gaming", "Coding", "Music",
  "Strategy", "Leadership", "Cultural", "Health & Wellness", "Engineering",
  "Business", "Science", "Pre-Med", "Law", "Environmental"])

const clubs = ref<any[]>([])
const loading = ref(false)

const headers = [
  { title: "Club Name", key: "name", sortable: true },
  { title: "Status", key: "activity_status", sortable: true },
  { title: "Description", key: "description", sortable: false },
]

// Fetch clubs from backend
onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3030/Club?$limit=1000')
    const data = await res.json()
    clubs.value = Array.isArray(data) ? data : data.data ?? []
  } catch (e) {
    console.error('Failed to load clubs:', e)
  } finally {
    loading.value = false
  }
})

const filteredClubs = computed(() => {
  return clubs.value.filter(club => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || club.name?.toLowerCase().includes(q) ||
      club.description?.toLowerCase().includes(q)
    const matchStatus = selectedStatus.value.length === 0 ||
      selectedStatus.value.includes(club.activity_status)
    return matchSearch && matchStatus
  })
})

const activeFilterCount = computed(() =>
  selectedStatus.value.length + selectedTags.value.length
)

function clearFilters() {
  selectedStatus.value = []
  selectedTags.value = []
  searchQuery.value = ''
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8">
            <h1 class="text-h4 mb-2">Discover Clubs and Organizations</h1>
            <p class="text-medium-emphasis mb-4">
              {{ clubs.length }} clubs available at UNR
            </p>

            <v-text-field
              v-model="searchQuery"
              label="Find a club"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              variant="outlined" />
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <!-- Filters Sidebar -->
          <v-col cols="12" md="3">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center justify-space-between mb-2">
                <h3 class="text-h6">Filters</h3>
                <v-chip v-if="activeFilterCount > 0" size="small" color="primary"
                  @click="clearFilters" closable>
                  {{ activeFilterCount }} active
                </v-chip>
              </div>
              <v-divider class="my-3" />

              <p class="text-overline text-medium-emphasis mb-2">Status</p>
              <div class="d-flex flex-wrap gap-2 mb-4">
                <v-chip
                  v-for="s in ['Active', 'Inactive']" :key="s"
                  :variant="selectedStatus.includes(s) ? 'flat' : 'outlined'"
                  :color="selectedStatus.includes(s) ? 'primary' : 'default'"
                  size="small" class="cursor-pointer"
                  @click="selectedStatus.includes(s)
                    ? selectedStatus.splice(selectedStatus.indexOf(s), 1)
                    : selectedStatus.push(s)">
                  {{ s }}
                </v-chip>
              </div>

              <v-divider class="mb-3" />
              <p class="text-overline text-medium-emphasis mb-2">Tags</p>
              <v-autocomplete
                v-model="selectedTags"
                :items="allTags"
                multiple
                chips
                closable-chips
                clearable
                density="compact"
                variant="outlined"
                label="Filter by interest"
                hide-details />

              <v-btn v-if="activeFilterCount > 0" class="mt-4" variant="text"
                color="error" block prepend-icon="mdi-close" @click="clearFilters">
                Clear All
              </v-btn>
            </v-card>
          </v-col>

          <!-- Club Table -->
          <v-col cols="12" md="9">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-body-2 text-medium-emphasis">
                Showing <strong>{{ filteredClubs.length }}</strong> of {{ clubs.length }} clubs
              </span>
            </div>

            <v-data-table
              :headers="headers"
              :items="filteredClubs"
              :loading="loading"
              item-value="id"
              class="elevation-2"
              :items-per-page="25">

              <template #item.activity_status="{ item }">
                <v-chip
                  :color="item.activity_status === 'Active' ? 'success' : 'grey'"
                  size="small" variant="flat">
                  {{ item.activity_status }}
                </v-chip>
              </template>

              <template #item.description="{ item }">
                <span class="text-body-2">
                  {{ item.description || '—' }}
                </span>
              </template>

              <template #no-data>
                <div class="text-center py-8">
                  <v-icon size="48" color="grey-lighten-1">mdi-magnify-close</v-icon>
                  <p class="mt-2 text-medium-emphasis">No clubs match your search.</p>
                  <v-btn variant="text" color="primary" @click="clearFilters">Clear filters</v-btn>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
