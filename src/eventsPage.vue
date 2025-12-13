<script setup lang="ts">
      import { onMounted, ref } from 'vue'
      import { useRouter } from 'vue-router'
      import Icon from './components/icon.vue'

      const router = useRouter()

      function iconClicked() {
            //direct back to homepage
            router.push('/')
      }

      const links = [
      'Home',
      'About Us',
      'Team',
      'Services',
      'Contact Us',
      ]

      const searchQuery = ref("")
      const selectedTags = ref<string[]>([])
      const selectedDate = ref<[string, string] | null>(null)

      const allTags = ref(["Sports", "Technology", "Arts", "Community", "Academic", 
                        "Competitive", "Volunteering", "Gaming", "Coding", "Music", 
                        "Strategy", "Leadership"])

      const clubs = ref([])

      const headers = [
            {title: "Club Name", key: "name"},
            {title: "Tags", key: "tags"},
            {title: "Description", key: "description"},
      ]

//Add logic for filter + fetching from backend

</script>


<template>
      <v-app>
            <v-main>
                  <v-container>
                        <v-row justify="center">
                              <v-col cols="12" sm="8">
                                    <h1 class="text-h4 mb-4">Search for Upcoming Events</h1>
                                    
                                    <v-text-field
                                    v-model="searchQuery" 
                                    label="Find an event"
                                    prepend-inner-icon="mdi-magnify"
                                    clearable
                                    hide-details></v-text-field>
                              </v-col>
                        </v-row>
                        <v-row class="mt-6">
                              <v-col cols="12" md="3">
                                    <v-card class="pa-4" elevation="2">
                                          <h3 class="text-h6">Filters</h3>
                                          <v-divider class="my-3"></v-divider>

                                          <v-autocomplete
                                          v-model="selectedTags"
                                          :items="allTags"
                                          multiple
                                          chips
                                          clearable
                                          label="Filter by Tags"
                                          />

                                          <v-text-field
                                          v-model="selectedDate"
                                          label="Filter by Date"
                                          prepend-inner-icon="mdi-calendar"
                                          type="date"
                                          clearable
                                          class="mt-4"
                                          />
                                          </v-card>
                              </v-col>

                              <v-col cols="12" md="9">
                                    <v-data-table
                                    :headers="headers"
                                    :items="clubs"
                                    :search="searchQuery"
                                    class="elevation-2"></v-data-table>
                              </v-col>
                        </v-row> 
                  </v-container>
            </v-main>
      </v-app>
</template>
