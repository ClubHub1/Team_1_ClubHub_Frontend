<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { feathersClient } from './backendAPI'

const router = useRouter()
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const selectedStatus = ref<string[]>([])
const clubs = ref<any[]>([])
const loading = ref(false)

const allTags = ref(['Sports', 'Technology', 'Arts', 'Community', 'Academic',
  'Competitive', 'Volunteering', 'Gaming', 'Coding', 'Music',
  'Strategy', 'Leadership', 'Cultural', 'Health & Wellness', 'Engineering',
  'Business', 'Science', 'Pre-Med', 'Law', 'Environmental'])

const headers = [
  { title: 'Club Name', key: 'name', sortable: true },
  { title: 'Status', key: 'activity_status', sortable: true },
  { title: 'Tags', key: 'tags', sortable: false },
  { title: 'Description', key: 'description', sortable: false },
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await feathersClient.service('Club').find({ query: { $limit: 25 } })
    clubs.value = Array.isArray(res.data) ? res.data : res.data ?? []
  } catch (e) {
    console.error('Failed to load clubs:', e)
  } finally {
    loading.value = false
  }
})

const filteredClubs = computed(() => {
  return clubs.value.filter(club => {
    const q = searchQuery.value.toLowerCase()
    const tags = normalizeTags(club.tags)
    const matchSearch = !q ||
      club.name?.toLowerCase().includes(q) ||
      club.description?.toLowerCase().includes(q) ||
      tags.some(tag => tag.toLowerCase().includes(q))
    const matchStatus = selectedStatus.value.length === 0 || selectedStatus.value.includes(club.activity_status)
    const matchTags = selectedTags.value.length === 0 || selectedTags.value.some(tag => tags.includes(tag))
    return matchSearch && matchStatus && matchTags
  })
})

const activeFilterCount = computed(() => selectedStatus.value.length + selectedTags.value.length)

function clearFilters() {
  selectedStatus.value = []
  selectedTags.value = []
  searchQuery.value = ''
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String)
  if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(Boolean)
  return []
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-8" max-width="1200">

        <!-- Page Header -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold">Discover Clubs & Organizations</h1>
            <p class="text-medium-emphasis mt-1">{{ clubs.length }} clubs available at UNR</p>
          </div>
        </div>

        <!-- Search Bar -->
        <v-card elevation="1" rounded="lg" class="pa-4 mb-6">
          <v-text-field
            v-model="searchQuery"
            label="Search clubs by name or description..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-card>

        <v-row>
          <!-- Filters Sidebar -->
          <v-col cols="12" md="3">
            <v-card elevation="2" rounded="lg" class="pa-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6">Filters</h3>
                <v-chip
                  v-if="activeFilterCount > 0"
                  size="small"
                  color="primary"
                  variant="tonal"
                  closable
                  @click:close="clearFilters"
                >{{ activeFilterCount }} active</v-chip>
              </div>
              <v-divider class="mb-4" />

              <p class="text-overline text-primary mb-2">Status</p>
              <div class="d-flex flex-wrap gap-2 mb-5">
                <v-chip
                  v-for="s in ['Active', 'Inactive']"
                  :key="s"
                  :variant="selectedStatus.includes(s) ? 'flat' : 'outlined'"
                  :color="selectedStatus.includes(s) ? 'primary' : 'default'"
                  size="small"
                  class="cursor-pointer"
                  @click="selectedStatus.includes(s)
                    ? selectedStatus.splice(selectedStatus.indexOf(s), 1)
                    : selectedStatus.push(s)"
                >{{ s }}</v-chip>
              </div>

              <v-divider class="mb-4" />
              <p class="text-overline text-primary mb-2">Tags</p>
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
                hide-details
              />

              <v-btn
                v-if="activeFilterCount > 0"
                class="mt-4"
                variant="text"
                color="error"
                block
                prepend-icon="mdi-close"
                @click="clearFilters"
              >Clear All</v-btn>
            </v-card>
          </v-col>

          <!-- Club Table -->
          <v-col cols="12" md="9">
            <v-card elevation="2" rounded="lg">
              <v-card-title class="px-6 pt-5 pb-2">
                <span class="text-h6">Clubs</span>
                <v-chip class="ml-2" size="small" color="primary" variant="tonal">
                  {{ filteredClubs.length }} of {{ clubs.length }}
                </v-chip>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="filteredClubs"
                :loading="loading"
                item-value="club_id"
                :items-per-page="25"
                rounded="lg"
              >
                <template #item.activity_status="{ item }">
                  <v-chip
                    :color="item.activity_status === 'Active' ? 'success' : 'grey'"
                    size="small"
                    variant="tonal"
                  >{{ item.activity_status }}</v-chip>
                </template>

                <template #item.tags="{ item }">
                  <div v-if="normalizeTags(item.tags).length" class="d-flex flex-wrap ga-1 py-1">
                    <v-chip
                      v-for="tag in normalizeTags(item.tags)"
                      :key="tag"
                      size="x-small"
                      color="primary"
                      variant="tonal"
                    >{{ tag }}</v-chip>
                  </div>
                  <span v-else class="text-body-2 text-disabled">—</span>
                </template>

                <template #item.description="{ item }">
                  <span class="text-body-2 text-medium-emphasis">{{ item.description || '—' }}</span>
                </template>

                <template #no-data>
                  <div class="text-center py-10">
                    <v-icon size="52" color="grey-lighten-1">mdi-magnify-close</v-icon>
                    <p class="mt-3 text-medium-emphasis">No clubs match your search.</p>
                    <v-btn variant="text" color="primary" @click="clearFilters">Clear filters</v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
