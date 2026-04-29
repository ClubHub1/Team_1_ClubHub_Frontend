<script setup lang="ts">
import Icon from './components/icon.vue'

const team = [
  { name: 'Daxton Johnson', role: 'Full-Stack Developer', detail: 'Manages containerization and backend connectivity', icon: 'mdi-server' },
  { name: 'Arwen Antes', role: 'Full-Stack Developer', detail: 'Frontend & backend integration', icon: 'mdi-code-tags' },
  { name: 'Aween Ali', role: 'Full-Stack Developer', detail: 'Frontend & backend integration', icon: 'mdi-code-tags' },
  { name: 'Dominic Palmieri', role: 'Full-Stack Developer', detail: 'Frontend & backend integration', icon: 'mdi-code-tags' },
  { name: 'Bill Doherty', role: 'Staff Advisor', detail: 'UNR Faculty', icon: 'mdi-school' },
]
</script>

<template>
  <v-app>
    <v-main>
      <!-- Hero Banner -->
      <div style="position: relative; min-height: 320px; background: #041E42; overflow: hidden;">
        <v-img
          src="/homepageBG.png"
          cover
          style="position: absolute; inset: 0; opacity: 0.2;"
        />
        <div class="d-flex flex-column align-center justify-center" style="position: relative; z-index: 1; min-height: 320px; padding: 60px 24px;">
          <h1 class="text-h3 font-weight-bold text-white text-center mb-2">By students, for students.</h1>
          <p class="text-white text-center text-h6" style="opacity: 0.75;">Meet the team behind ClubHub</p>
        </div>
      </div>

      <!-- Tagline strip -->
      <div style="background: #041E42; padding: 16px 24px;">
        <p class="text-center text-white font-italic text-h6 ma-0">CS 426 — Team 1 — Spring 2026</p>
      </div>

      <!-- About Section -->
      <v-container max-width="1000" class="py-12">

        <v-card elevation="2" rounded="lg" class="pa-8 mb-10">
          <div class="text-center mb-4">
            <v-icon color="primary" size="28" class="mb-2">mdi-information-outline</v-icon>
            <h2 class="text-h5 font-weight-bold">About ClubHub</h2>
          </div>
          <v-divider class="mb-5" />
          <p class="text-body-1 text-medium-emphasis" style="line-height: 1.8;">
            ClubHub is a tool designed to help and assist club officers on campus with organizational duties and management
            by addressing the lack of an effective, centralized platform for officers and leaders of on-campus clubs and
            organizations, aiming to provide success through efficient leadership. We provide an accessible UI, streamlined
            functions and information storage for essential club information such as finances, supplemental forms, contacts,
            and events, along with a backend API for seamless communication between the database and frontend.
          </p>
        </v-card>

        <!-- Team Section -->
        <v-card elevation="2" rounded="lg" class="pa-8 mb-6">
          <div class="text-center mb-4">
            <v-icon color="primary" size="28" class="mb-2">mdi-account-group</v-icon>
            <h2 class="text-h5 font-weight-bold mb-1">About Team 1</h2>
            <p class="text-medium-emphasis">The developers behind ClubHub</p>
          </div>
          <v-divider class="mb-6" />
          <v-row>
            <v-col
              v-for="member in team"
              :key="member.name"
              cols="12" sm="6" md="4"
            >
              <v-card rounded="lg" elevation="1" class="pa-5 text-center" variant="outlined">
                <v-avatar color="primary" variant="tonal" size="56" class="mb-4">
                  <v-icon :icon="member.icon" size="28" color="primary" />
                </v-avatar>
                <h3 class="text-body-1 font-weight-bold mb-1">{{ member.name }}</h3>
                <v-chip size="small" color="primary" variant="tonal" class="mb-2">{{ member.role }}</v-chip>
                <p class="text-caption text-medium-emphasis mt-2">{{ member.detail }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Resources -->
        <v-card elevation="2" rounded="lg" class="pa-8 mt-10">
          <div class="text-center mb-4">
            <v-icon color="primary" size="28" class="mb-2">mdi-book-open-outline</v-icon>
            <h2 class="text-h5 font-weight-bold">Resources</h2>
          </div>
          <v-divider class="mb-5" />
          <p class="text-medium-emphasis">Additional resources and documentation will be listed here.</p>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>