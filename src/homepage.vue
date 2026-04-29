<script setup lang="ts">
import Icon from './components/icon.vue'
</script>

<template>
  <v-app>
    <v-main>
      <!-- Hero Banner -->
      <div style="position: relative; background: #041E42; overflow: hidden;">
        <v-img
          src="src/assets/homepageBG.png"
          cover
          style="position: absolute; inset: 0; opacity: 0.3;"
        />
        <div class="d-flex flex-column align-center justify-center px-4 px-sm-10 hero-inner">
          <h1 class="font-weight-bold text-white text-center mb-2 mb-sm-3 hero-title">Welcome to ClubHub</h1>
          <p class="text-white text-center mb-6 mb-sm-8 hero-subtitle" style="opacity: 0.8;">Your club management solution</p>
          <v-btn
            color="white"
            variant="flat"
            rounded="lg"
            append-icon="mdi-chevron-right"
            to="/register"
            class="hero-btn"
            style="color: #041E42; font-weight: 600;"
          >Register Today</v-btn>
        </div>
      </div>

      <!-- Tagline Strip -->
      <div style="background: #041E42; padding: 16px 24px;">
        <p class="text-center text-white font-italic text-body-1 text-sm-h6 ma-0">Your Club. All in one place.</p>
      </div>

      <!-- Feature Sections -->
      <v-container class="py-8 py-md-12" max-width="1100">

        <v-row class="mb-6 mb-md-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h6 text-md-h5 font-weight-bold">Everything your club needs</h2>
            <p class="text-medium-emphasis mt-1 text-body-2 text-sm-body-1">Manage events, members, finances, and more — all from one place.</p>
          </v-col>
        </v-row>

        <!-- Events Section -->
        <v-row align="center" class="mb-8 mb-md-12">
          <v-col cols="12" md="6" class="mb-4 mb-md-0">
            <v-card rounded="xl" elevation="4" style="overflow: hidden;">
              <v-img src="src/assets/clubFair2.png" cover :height="$vuetify.display.smAndDown ? 200 : 300" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <div class="pa-2 pa-md-4">
              <v-chip color="primary" variant="tonal" size="small" class="mb-3">Events</v-chip>
              <h2 class="text-h5 text-md-h4 font-weight-bold mb-3">Discover what's happening on campus</h2>
              <p class="text-medium-emphasis text-body-2 text-sm-body-1 mb-5">
                Celebrate Pack culture through events hosted by clubs and organizations.
                View upcoming events, see details, and get involved.
              </p>
              <v-btn
                variant="flat"
                color="primary"
                rounded="lg"
                prepend-icon="mdi-calendar"
                to="/events"
                :size="$vuetify.display.smAndDown ? 'default' : 'large'"
                :block="$vuetify.display.smAndDown"
              >Explore Events</v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-8 mb-md-12" />

        <!-- Clubs Section -->
        <v-row align="center" class="mb-8 mb-md-12">
          <v-col cols="12" md="6" order="2" order-md="1">
            <div class="pa-2 pa-md-4">
              <v-chip color="primary" variant="tonal" size="small" class="mb-3">Clubs & Orgs</v-chip>
              <h2 class="text-h5 text-md-h4 font-weight-bold mb-3">Find your community</h2>
              <p class="text-medium-emphasis text-body-2 text-sm-body-1 mb-5">
                Find fun, friends, and your own Pack pride through clubs and organizations on campus.
                Browse by interest, tag, or name.
              </p>
              <v-btn
                variant="flat"
                color="primary"
                rounded="lg"
                prepend-icon="mdi-account-group"
                to="/clubs"
                :size="$vuetify.display.smAndDown ? 'default' : 'large'"
                :block="$vuetify.display.smAndDown"
              >Explore Clubs & Organizations</v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" order="1" order-md="2" class="mb-4 mb-md-0">
            <v-card rounded="xl" elevation="4" style="overflow: hidden;">
              <v-img src="src/assets/clubsOrgsImage.png" cover :height="$vuetify.display.smAndDown ? 200 : 300" />
            </v-card>
          </v-col>
        </v-row>

        <!-- Stats Row -->
        <v-row>
          <v-col cols="12" sm="4" class="mb-3 mb-sm-0">
            <v-card rounded="lg" elevation="2" class="pa-5 pa-md-6 text-center">
              <v-icon size="32" color="primary" class="mb-2">mdi-account-group</v-icon>
              <p class="text-h5 text-md-h4 font-weight-bold">100+</p>
              <p class="text-medium-emphasis text-body-2">Active Clubs</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4" class="mb-3 mb-sm-0">
            <v-card rounded="lg" elevation="2" class="pa-5 pa-md-6 text-center">
              <v-icon size="32" color="primary" class="mb-2">mdi-calendar-check</v-icon>
              <p class="text-h5 text-md-h4 font-weight-bold">Events</p>
              <p class="text-medium-emphasis text-body-2">All Semester Long</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="pa-5 pa-md-6 text-center">
              <v-icon size="32" color="primary" class="mb-2">mdi-school</v-icon>
              <p class="text-h5 text-md-h4 font-weight-bold">UNR</p>
              <p class="text-medium-emphasis text-body-2">University of Nevada, Reno</p>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.hero-title {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
.hero-subtitle {
  font-size: clamp(0.95rem, 2.5vw, 1.25rem);
}
.hero-inner {
  position: relative;
  z-index: 1;
  min-height: clamp(220px, 40vw, 420px);
  padding-top: clamp(40px, 8vw, 80px);
  padding-bottom: clamp(40px, 8vw, 80px);
}
.hero-btn {
  min-width: clamp(160px, 30vw, 220px);
  font-size: clamp(0.8rem, 2vw, 1rem);
}
</style>