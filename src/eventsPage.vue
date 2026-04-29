<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { feathersClient } from '@/backendAPI'

interface Club { club_id: number; name: string; tags: string[] }
interface Event {
  id: number; club: number; name: string; description: string;
  location: string; start_datetime: string; end_datetime: string;
  clubName?: string; clubTags?: string[]
}

const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const dateFrom = ref('')
const dateTo = ref('')
const events = ref<Event[]>([])
const clubs = ref<Club[]>([])
const expanded = ref<string[]>([])

const headers = [
  { title: 'Event', key: 'name', sortable: true },
  { title: 'Club', key: 'clubName', sortable: true },
  { title: 'Date', key: 'start_datetime', sortable: true },
]

const allTags = [
  { label: 'Academic', value: 'academic' }, { label: 'Athletic', value: 'athletic' },
  { label: 'Career Development', value: 'career_dev' }, { label: 'Community Service', value: 'community_svc' },
  { label: 'Cultural / Language', value: 'cultural_lang' }, { label: 'Gaming', value: 'gaming' },
  { label: 'Health', value: 'health' }, { label: 'Leadership', value: 'leadership' },
  { label: 'Music', value: 'music' }, { label: 'Outdoor Recreation', value: 'outdoor_rec' },
  { label: 'Social', value: 'social' }, { label: 'STEM', value: 'stem' },
  { label: 'Technology', value: 'technology' }, { label: 'Arts', value: 'crafts_arts' },
]

async function fetchEvents() {
  loading.value = true
  error.value = ''
  try {
    const clubRes = await (feathersClient.service('Club') as any).find({
      query: { $select: ['club_id', 'name'], $limit: 500 }
    })
    clubs.value = clubRes.data as Club[]
    const clubMap = new Map<number, Club>(clubs.value.map((c: Club) => [c.club_id, c]))

    const eventQuery: Record<string, any> = { $sort: { start_datetime: 1 }, $limit: 500 }
    if (dateFrom.value) eventQuery.start_datetime = { ...eventQuery.start_datetime, $gte: new Date(dateFrom.value).toISOString() }
    if (dateTo.value) eventQuery.start_datetime = { ...eventQuery.start_datetime, $lte: new Date(dateTo.value + 'T23:59:59').toISOString() }
    if (selectedTags.value.length > 0) {
      const matchingClubIds = clubs.value.filter((c: Club) => c.tags?.some((t: string) => selectedTags.value.includes(t))).map((c: Club) => c.club_id)
      if (!matchingClubIds.length) { events.value = []; return }
      eventQuery.club = { $in: matchingClubIds }
    }

    const eventRes = await (feathersClient.service('Event') as any).find({ query: eventQuery })
    events.value = (eventRes.data as any[]).map((e: any): Event => {
      const club = clubMap.get(e.club as number)
      return { id: e.id, club: e.club, name: e.name, description: e.description, location: e.location, start_datetime: e.start_datetime, end_datetime: e.end_datetime, clubName: club?.name ?? 'Unknown Club', clubTags: club?.tags ?? [] }
    })
  } catch (err: any) {
    error.value = err.message ?? 'Failed to load events.'
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  selectedTags.value = []; dateFrom.value = ''; dateTo.value = ''; searchQuery.value = ''
  fetchEvents()
}

function formatDatetime(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function tagLabel(value: string) {
  return allTags.find(t => t.value === value)?.label ?? value
}

onMounted(fetchEvents)
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-8" max-width="1200">

        <!-- Page Header -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold">Upcoming Events</h1>
            <p class="text-medium-emphasis mt-1">Browse and discover campus events from clubs and organizations.</p>
          </div>
        </div>

        <!-- Search -->
        <v-card elevation="1" rounded="lg" class="pa-4 mb-6">
          <v-text-field
            v-model="searchQuery"
            label="Search by event name, club, or location..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-card>

        <v-row>
          <!-- Filters -->
          <v-col cols="12" md="3">
            <v-card elevation="2" rounded="lg" class="pa-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6">Filters</h3>
                <v-btn variant="text" size="small" color="grey-darken-1" @click="clearFilters">Clear all</v-btn>
              </div>
              <v-divider class="mb-4" />

              <p class="text-overline text-primary mb-2">Tags</p>
              <v-autocomplete
                v-model="selectedTags"
                :items="allTags"
                item-title="label"
                item-value="value"
                multiple chips closable-chips clearable
                label="Filter by category"
                density="compact"
                variant="outlined"
                hide-details
                class="mb-4"
              />

              <p class="text-overline text-primary mb-2">Date Range</p>
              <v-text-field
                v-model="dateFrom"
                label="From date"
                prepend-inner-icon="mdi-calendar-start"
                type="date"
                clearable
                density="compact"
                variant="outlined"
                hide-details
                class="mb-3"
              />
              <v-text-field
                v-model="dateTo"
                label="To date"
                prepend-inner-icon="mdi-calendar-end"
                type="date"
                clearable
                density="compact"
                variant="outlined"
                hide-details
                class="mb-4"
                :min="dateFrom"
              />
              <v-btn color="primary" block rounded="lg" @click="fetchEvents" :loading="loading">
                Apply Filters
              </v-btn>
            </v-card>
          </v-col>

          <!-- Events Table -->
          <v-col cols="12" md="9">
            <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>

            <v-card elevation="2" rounded="lg">
              <v-card-title class="px-6 pt-5 pb-2">
                <span class="text-h6">Events</span>
                <v-chip class="ml-2" size="small" color="primary" variant="tonal">{{ events.length }}</v-chip>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="events"
                :search="searchQuery"
                :loading="loading"
                loading-text="Loading events..."
                no-data-text="No events found."
                item-value="id"
                show-expand
                expand-on-click
                v-model:expanded="expanded"
              >
                <template #item.start_datetime="{ item }">
                  {{ formatDatetime(item.start_datetime) }}
                </template>

                <template #expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length" class="pa-0">
                      <v-card flat color="grey-lighten-5" class="pa-5 ma-2 rounded-lg">
                        <v-row>
                          <v-col cols="12" md="8">
                            <p class="text-overline text-primary mb-2">Event Details</p>
                            <div class="d-flex align-center ga-2 mb-2">
                              <v-icon size="16" color="grey-darken-1">mdi-map-marker</v-icon>
                              <span class="text-body-2">{{ item.location || '—' }}</span>
                            </div>
                            <div class="d-flex align-center ga-2 mb-2">
                              <v-icon size="16" color="grey-darken-1">mdi-clock-start</v-icon>
                              <span class="text-body-2">Starts: {{ formatDatetime(item.start_datetime) }}</span>
                            </div>
                            <div class="d-flex align-center ga-2 mb-3">
                              <v-icon size="16" color="grey-darken-1">mdi-clock-end</v-icon>
                              <span class="text-body-2">Ends: {{ formatDatetime(item.end_datetime) }}</span>
                            </div>
                            <p class="text-body-2 text-medium-emphasis">
                              {{ item.description || 'No description provided.' }}
                            </p>
                          </v-col>
                          <v-col cols="12" md="4">
                            <p class="text-overline text-primary mb-2">Club Tags</p>
                            <div v-if="item.clubTags?.length" class="d-flex flex-wrap ga-1">
                              <v-chip
                                v-for="tag in item.clubTags"
                                :key="tag"
                                size="small" label color="primary" variant="tonal"
                              >{{ tagLabel(tag) }}</v-chip>
                            </div>
                            <span v-else class="text-body-2 text-disabled">No tags.</span>
                          </v-col>
                        </v-row>
                      </v-card>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>

            <p class="text-caption text-medium-emphasis mt-2 ml-1">Click any row to see full event details.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>