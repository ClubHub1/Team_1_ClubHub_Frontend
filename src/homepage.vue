<script setup lang="ts">
import Icon from './components/icon.vue'
</script>

<template>
  <v-app>
    <v-main>
      <!-- Hero Banner -->
      <div class="hero-banner" style="position: relative; min-height: 420px; background: #041E42; overflow: hidden;">
        <v-img
          src="src/assets/homepageBG.png"
          cover
          style="position: absolute; inset: 0; opacity: 0.3;"
        />
        <div style="position: relative; z-index: 1;" class="d-flex flex-column align-center justify-center" style="min-height: 420px; padding: 80px 24px 60px;">
          <h1 class="text-h3 font-weight-bold text-white text-center mb-3">Welcome to ClubHub</h1>
          <p class="text-h6 text-white text-center mb-8" style="opacity: 0.8;">Your all-in-one club management solution for UNR.</p>
          <div class="d-flex gap-4 flex-wrap justify-center">
            <v-btn
              color="white"
              variant="flat"
              size="large"
              rounded="lg"
              prepend-icon="mdi-account-plus"
              to="/register"
              style="color: #041E42; font-weight: 600;"
            >Register Today</v-btn>
            <v-btn
              variant="outlined"
              size="large"
              rounded="lg"
              prepend-icon="mdi-magnify"
              to="/clubs"
              style="color: white; border-color: rgba(255,255,255,0.6);"
            >Explore Clubs</v-btn>
          </div>
        </div>
      </div>

      <!-- Tagline Strip -->
      <div style="background: #041E42; padding: 18px 24px;">
        <p class="text-center text-white font-italic text-h6 ma-0">Your Club. All in one place.</p>
      </div>

      <!-- Feature Cards -->
      <v-container class="py-12" max-width="1100">
        <v-row class="mb-4">
          <v-col cols="12" class="text-center mb-6">
            <h2 class="text-h5 font-weight-bold">Everything your club needs</h2>
            <p class="text-medium-emphasis mt-1">Manage events, members, finances, and more — all from one place.</p>
          </v-col>
        </v-row>

        <!-- Events Section -->
        <v-row align="center" class="mb-12">
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="4" style="overflow: hidden;" height="300">
              <v-img src="src/assets/clubFair2.png" cover height="300" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <div class="pa-4">
              <v-chip color="primary" variant="tonal" size="small" class="mb-3">Events</v-chip>
              <h2 class="text-h4 font-weight-bold mb-3">Discover what's happening on campus</h2>
              <p class="text-medium-emphasis text-body-1 mb-6">
                Celebrate Pack culture through events hosted by clubs and organizations.
                View upcoming events, see details, and get involved.
              </p>
              <v-btn
                variant="flat"
                color="primary"
                size="large"
                rounded="lg"
                prepend-icon="mdi-calendar"
                to="/events"
              >Explore Events</v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-12" />

        <!-- Clubs Section -->
        <v-row align="center" class="mb-12">
          <v-col cols="12" md="6" order="2" order-md="1">
            <div class="pa-4">
              <v-chip color="primary" variant="tonal" size="small" class="mb-3">Clubs & Orgs</v-chip>
              <h2 class="text-h4 font-weight-bold mb-3">Find your community</h2>
              <p class="text-medium-emphasis text-body-1 mb-6">
                Find fun, friends, and your own Pack pride through clubs and organizations on campus.
                Browse by interest, tag, or name.
              </p>
              <v-btn
                variant="flat"
                color="primary"
                size="large"
                rounded="lg"
                prepend-icon="mdi-account-group"
                to="/clubs"
              >Explore Clubs & Organizations</v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" order="1" order-md="2">
            <v-card rounded="xl" elevation="4" style="overflow: hidden;" height="300">
              <v-img src="src/assets/clubsOrgsImage.png" cover height="300" />
            </v-card>
          </v-col>
        </v-row>

        <!-- Stats Row -->
        <v-row>
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="pa-6 text-center">
              <v-icon size="36" color="primary" class="mb-3">mdi-account-group</v-icon>
              <p class="text-h4 font-weight-bold">100+</p>
              <p class="text-medium-emphasis">Active Clubs</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="pa-6 text-center">
              <v-icon size="36" color="primary" class="mb-3">mdi-calendar-check</v-icon>
              <p class="text-h4 font-weight-bold">Events</p>
              <p class="text-medium-emphasis">All Semester Long</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="pa-6 text-center">
              <v-icon size="36" color="primary" class="mb-3">mdi-school</v-icon>
              <p class="text-h4 font-weight-bold">UNR</p>
              <p class="text-medium-emphasis">University of Nevada, Reno</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>