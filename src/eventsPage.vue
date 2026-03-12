<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { feathersClient } from '@/backendAPI'


interface Club {
      id:   number
      name: string
      tags: string[]
}

interface Event {
      id:             number
      club:           number
      name:           string
      description:    string
      location:       string
      start_datetime: string
      end_datetime:   string
      clubName?:      string
      clubTags?:      string[]
}

const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const dateFrom = ref('')
const dateTo = ref('')
const events = ref<Event[]>([])
const clubs  = ref<Club[]>([])
const expanded = ref<string[]>([])

const headers = [
    { title: 'Event', key: 'name', sortable: true },
    { title: 'Club',  key: 'clubName', sortable: true },
    { title: 'Date',  key: 'start_datetime', sortable: true },
]

// ── Tag options ───────────────────────────────────────────────────────────────

const allTags = [
    { label: 'Academic', value: 'academic' },
    { label: 'Activism', value: 'activism' },
    { label: 'Athletic', value: 'athletic' },
    { label: 'Career Development', value: 'career_dev' },
    { label: 'Civic', value: 'civic' },
    { label: 'Community Service', value: 'community_svc' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Crafts & Arts', value: 'crafts_arts' },
    { label: 'Cultural / Language', value: 'cultural_lang' },
    { label: 'Dance', value: 'dance' },
    { label: 'Environment', value: 'environment' },
    { label: 'Faith', value: 'faith' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Greek Life', value: 'greek_life' },
    { label: 'Health', value: 'health' },
    { label: 'Honor Societies', value: 'honor_societies' },
    { label: 'Leadership', value: 'leadership' },
    { label: 'Literary',  value: 'literary' },
    { label: 'Martial Arts', value: 'martial_arts' },
    { label: 'Media', value: 'media' },
    { label: 'Music', value: 'music' },
    { label: 'Outdoor Recreation', value: 'outdoor_rec' },
    { label: 'Political', value: 'political' },
    { label: 'Pre-Professional', value: 'pre_professional' },
    { label: 'Research', value: 'research' },
    { label: 'Social', value: 'social' },
    { label: 'Competitive Sports', value: 'sports_comp' },
    { label: 'Non-Competitive Sports', value: 'sports_noncomp' },
    { label: 'Intramural Sports', value: 'sports_intramural' },
    { label: 'STEM', value: 'stem' },
    { label: 'Student Government', value: 'student_gov'},
]

async function fetchEvents() {
      loading.value = true
      error.value   = ''

      try {
            const clubRes = await (feathersClient.service('Club') as any).find({
                  query: { $select: ['id', 'name', 'tags'], $limit: 500 }
            })
            clubs.value = clubRes.data as Club[]
            const clubMap = new Map<number, Club>(
                  (clubs.value).map((c: Club) => [c.id, c])
            )
            const eventQuery: Record<string, any> = {
                        $sort:  { start_datetime: 1 },
                        $limit: 500
            }

            if (dateFrom.value) {
                  eventQuery.start_datetime = {
                        ...eventQuery.start_datetime,
                        $gte: new Date(dateFrom.value).toISOString()
                  }
            }
            if (dateTo.value) {
                  eventQuery.start_datetime = {
                        ...eventQuery.start_datetime,
                        $lte: new Date(dateTo.value + 'T23:59:59').toISOString()
                  }
            }
            if (selectedTags.value.length > 0) {
                  const matchingClubIds = clubs.value
                  .filter((c: Club) => c.tags?.some((t: string) => selectedTags.value.includes(t)))
                  .map((c: Club) => c.id)
                  if (matchingClubIds.length === 0) {
                        events.value = []
                        loading.value = false
                        return
                  }
                  eventQuery.club = { $in: matchingClubIds }
            }

            const eventRes = await (feathersClient.service('Event') as any).find({ query: eventQuery })
            events.value = (eventRes.data as any[]).map((e: any): Event => {
                  const club = clubMap.get(e.club as number)
                  return {
                        id: e.id,
                        club: e.club,
                        name: e.name,
                        description: e.description,
                        location: e.location,
                        start_datetime: e.start_datetime,
                        end_datetime: e.end_datetime,
                        clubName: club?.name ?? 'Unknown Club',
                        clubTags: club?.tags ?? []
                  }
            })
      } 
      catch (err: any) {
            error.value = err.message ?? 'Failed to load events.'
            console.error('EVENT FETCH ERROR:', err)
      } 
      finally {
            loading.value = false
      }
}

function applyFilters() { fetchEvents() }
function clearFilters() {
      selectedTags.value = []
      dateFrom.value     = ''
      dateTo.value       = ''
      searchQuery.value  = ''
      fetchEvents()
}

function formatDatetime(iso: string) {
      if (!iso) return '—'
      return new Date(iso).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit'
      })
}

function tagLabel(value: string) {
      return allTags.find(t => t.value === value)?.label ?? value
}
onMounted(fetchEvents)
</script>

<template>
    <v-app>
        <v-main>
            <v-container class="py-8">
                  <v-row justify="center" class="mb-6">
                        <v-col cols="12" sm="8">
                              <h1 class="text-h4 font-weight-bold mb-4">Search for Upcoming Events</h1>
                              <v-text-field
                                    v-model="searchQuery"
                                    label="Search by event name, club, or location"
                                    prepend-inner-icon="mdi-magnify"
                                    clearable
                                    hide-details
                                    variant="outlined"
                              />
                        </v-col>
                  </v-row>

                  <v-row>
                        <v-col cols="12" md="3">
                        <v-card elevation="2" rounded="lg" class="pa-4">
                              <div class="d-flex align-center justify-space-between mb-1">
                                    <h3 class="text-h6">Filters</h3>
                                    <v-btn variant="text" size="small" color="grey-darken-1" @click="clearFilters">Clear all</v-btn>
                              </div>
                              <v-divider class="mb-4" />
                              <v-autocomplete
                                    v-model="selectedTags"
                                    :items="allTags"
                                    item-title="label"
                                    item-value="value"
                                    multiple
                                    chips
                                    closable-chips
                                    clearable
                                    label="Filter by Tags"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    class="mb-4"
                              />
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
                              <v-btn color="primary" block @click="applyFilters" :loading="loading">Apply Filters</v-btn>
                        </v-card>
                  </v-col>

                  <v-col cols="12" md="9">
                        <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>
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
                              class="elevation-2"
                              rounded="lg"
                        >
                              <template #item.start_datetime="{ item }">{{ formatDatetime(item.start_datetime) }}</template>
                              <template #expanded-row="{ columns, item }">
                                    <tr>
                                          <td :colspan="columns.length" class="pa-0">
                                          <v-card flat rounded="0" color="grey-lighten-4" class="pa-5">
                                                <v-row>
                                                      <v-col cols="12" md="8">
                                                            <div class="text-overline text-medium-emphasis mb-1">Details</div>
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
                                                            <div v-if="item.description" class="text-body-2 text-medium-emphasis">
                                                                  {{ item.description }}
                                                            </div>
                                                            <div v-else class="text-body-2 text-disabled">
                                                                  No description provided.
                                                            </div>
                                                      </v-col>

                                                      <v-col cols="12" md="4">
                                                            <div class="text-overline text-medium-emphasis mb-2">Club Tags</div>
                                                            <div v-if="item.clubTags?.length" class="d-flex flex-wrap ga-1">
                                                                  <v-chip
                                                                        v-for="tag in item.clubTags"
                                                                        :key="tag"
                                                                        size="small"
                                                                        label
                                                                        color="primary"
                                                                        variant="tonal"
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

                        <p class="text-caption text-medium-emphasis mt-2 ml-1">
                            Click any row to see full event details.
                        </p>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>