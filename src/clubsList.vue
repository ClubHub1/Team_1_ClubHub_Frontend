

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { feathersClient } from './backendAPI'
import useUserStore from './stores/user'
import useClubStore from './stores/clubStore'

const clubStore = useClubStore()
const userStore = useUserStore()
const clubs = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

async function fetchClubs() {
  try {
    const res = await feathersClient.service('ClubMembership').find({
      query: { $select: ['clubid'], userid: userStore.id }
    })
    const ids = res.data.map(m => m.clubid)
    const clubRes = await feathersClient.service('Club').find({
      query: { club_id: { $in: ids } }
    })
    clubs.value = clubRes.data
  } catch (e) {
    error.value = e.message || 'Failed to load clubs.'
  } finally {
    loading.value = false
  }
}

function goToManage(id) {
    //console.log(id)
    console.log(clubs.value[0])
    clubStore.setName(clubs.value[id].name)
    clubStore.setDescription(clubs.value[id].description)
    clubStore.setId(clubs.value[id].club_id)
    clubStore.setLogoUrl(clubs.value[id].logo_url)
    router.push(`/clubDash`)
}

onMounted(fetchClubs)
</script>

<template>
  <v-container class="py-8" max-width="1000">

    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Your Clubs</h1>
        <p class="text-medium-emphasis mt-1">Manage and access your club organizations.</p>
      </div>
      <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" to="/registerClub">
        Register New Club
      </v-btn>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Error -->
    <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>

    <!-- Empty state -->
    <v-card v-else-if="clubs.length === 0" elevation="2" rounded="lg" class="pa-10 text-center">
      <v-icon size="56" color="grey-lighten-1" class="mb-4">mdi-account-group-outline</v-icon>
      <h3 class="text-h6 mb-2">No clubs yet</h3>
      <p class="text-medium-emphasis mb-6">You're not a member of any clubs. Register a new one or join an existing club.</p>
      <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" to="/registerClub">Register a Club</v-btn>
    </v-card>

    <!-- Club Cards -->
    <v-row v-else>
      <v-col
        v-for="(club, index) in clubs"
        :key="index"
        cols="12" sm="6" md="4"
      >
        <v-card rounded="lg" elevation="2" class="d-flex flex-column" style="height: 350px;">
          <v-card-text class="flex-grow-1 pa-5">
            <div class="d-flex align-start mb-3">
              <v-avatar color="primary" variant="tonal" size="40" class="mr-3 mt-1">
                <v-icon color="primary">mdi-account-group</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-body-1 font-weight-bold">{{ club.name }}</h3>
                <v-chip size="x-small" color="success" variant="tonal" class="mt-1">
                  {{ club.activity_status || 'Active' }}
                </v-chip>
              </div>
            </div>
            <p class="text-body-2 text-medium-emphasis" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{ club.description || 'No description provided.' }}
            </p>
          </v-card-text>
          <v-img v-if="club.logo_url" class="mx-auto mb-5" rounded="lg"
            :width="200"
            :max-height="300"
            :src="`http://localhost:42063${club.logo_url}`"
            ></v-img>
            <v-icon v-else 
                class="mb-15 mx-auto"
                icon="mdi-image-off-outline"
                size="x-large"
            ></v-icon>
          <v-card-actions class="pa-4 pt-0">
            <v-spacer />
            <v-btn color="primary" variant="flat" rounded="lg" size="small" prepend-icon="mdi-cog" @click="goToManage(index)">
              Manage
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>