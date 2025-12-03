<script setup lang="ts">
      import { ref } from 'vue'
      import { useRouter } from 'vue-router'
      import Icon from './components/icon.vue'

      const router = useRouter()

      function iconClicked() {
            //direct back to homepage
      }

      const links = [
      'Home',
      'About Us',
      'Team',
      'Services',
      'Contact Us',
      ]
</script>


<template>
      <v-app>
            <v-main>
                  <v-container>
                        <v-row justify="center">
                              <v-col cols="10" sm="8" md="6">
                                    <h1 class="text-h4 mb-4">Discover Clubs and Organizations</h1>
                                    <v-text-field 
                                    label="Find a club"
                                    prepend-inner-icon="mdi-magnify"
                                    clearable
                                    single-line
                                    hide-details></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="8" md="6">
                                    <v-select 
                                    v-model="selectedCategory"
                                    :items="categories"
                                    lable="Category"
                                    clearable></v-select>
                              </v-col>
                        </v-row>

                        <v-row>
                              <v-col cols="12">
                                    <v-data-table
                                    :headers="headers"
                                    :items="filteredItems"
                                    :search="searchQuery"></v-data-table>
                              </v-col>
                        </v-row>
                  </v-container>
            </v-main>
      </v-app>
</template>

