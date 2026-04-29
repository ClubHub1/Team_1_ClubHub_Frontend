<template>
    <v-container>
        <v-toolbar flat height="100" color="primary" dark>
            <v-toolbar-title class="mr-5 flex text-center text-h2 font-weight-bold">Your Clubs</v-toolbar-title>
        </v-toolbar>

        <v-row justify="center" class="mt-4" dense>
            <v-col cols="12" v-if="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-col>

            <v-col cols="12" v-else-if="error">
                <v-alert type="error" dense outlined>{{ error }}</v-alert>
            </v-col>

            <v-col cols="12" v-else-if="clubs.length === 0">
                <v-card outlined>
                    <v-card-text>No clubs found.</v-card-text>
                </v-card>
            </v-col>

            <v-container fluid>
                <v-row class="mb-6 d-flex justify-center">
                    <v-col v-for="(club, index) in clubs" :key="index" outlined
                        cols="12" sm="6" md="3"
                        class="d-flex justify-center">
                        <v-card width="400">
                            <v-card-title class="font-weight-bold text-center headline">{{ club.name }}</v-card-title>
                            <v-card-text class="text--secondary text-center">
                                {{ club.description || "No description provided." }}
                            </v-card-text>
                            <v-img v-if="club.logo_url" class="mx-auto" rounded="lg"
                                :width="200"
                                :src="`http://localhost:42063${club.logo_url}`"
                            ></v-img>
                            <v-icon v-else 
                                class="mb-15 mx-auto"
                                icon="mdi-image-off-outline"
                                size="x-large"
                            ></v-icon>
                            <v-card-actions class="justify-center">
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="goToManage(index)">Manage</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-row>
        <v-row justify="center" class="mt-10">
            <v-btn color="primary" to='/registerClub'>Register A New Club Here!</v-btn>
        </v-row>
    </v-container>
</template>

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
        //console.log(userStore.id)
        const res = await(feathersClient.service("ClubMembership").find({
            query: {
                $select: ['clubid'],
                userid: userStore.id
            }
        }))
        //console.log(res)
        const clubIds = res.data;
        //console.log(clubIds)
        const ids = []
        for(const clubId of clubIds){
            ids.push(clubId.clubid)
        }
        const clubRes = await(feathersClient.service("Club").find({
            query: {
                club_id: {
                    $in: ids
                }
            }
        }))

        console.log(clubRes)

        if (!res) throw new Error(res.statusText)
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

<style scoped>
.v-toolbar {
    border-radius: 4px;
}
.v-card {
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>