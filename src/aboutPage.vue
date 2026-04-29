SETUP SCRIPT FOR IMPORTS, FUNCTION DECLARATION, GLOBAL VARIABLES, ETC
SETUP SCRIPT FOR IMPORTS, FUNCTION DECLARATION, GLOBAL VARIABLES, ETC
<script setup lang="ts">
  const devs = [
    {
      name: 'Daxton Johnson',
      role: 'Full Stack Developer · Containerization',
      roleColor: 'primary',
      initials: 'DJ',
    },
    {
      name: 'Arwen Antes',
      role: 'Frontend Developer · Database',
      roleColor: 'primary',
      initials: 'AA',
    },
    {
      name: 'Aween Ali',
      role: 'Full Stack Developer',
      roleColor: 'primary',
      initials: 'AA',
    },
    {
      name: 'Dominic Palmieri',
      role: 'Full Stack Developer',
      roleColor: 'primary',
      initials: 'DP',
    },
  ]
  const advisor = {
    name: 'Dr. Bill Doherty',
    role: 'Faculty Advisor',
    department: 'Department of Computer Science & Engineering',
  }

  const techStack = [
  { name: 'Vue 3', icon: 'mdi-vuejs', color: '#42b883' },
  { name: 'Vuetify', icon: 'mdi-vuetify', color: '#1867C0' },
  { name: 'TypeScript', icon: 'mdi-language-typescript', color: '#3178C6' },
  { name: 'Feathers.js', icon: 'mdi-feather', color: '#555555' },
  { name: 'Node.js', icon: 'mdi-nodejs', color: '#539E43' },
  { name: 'PostgreSQL', icon: 'mdi-database', color: '#336791' },
  { name: 'Docker', icon: 'mdi-docker', color: '#2496ED' },
  { name: 'Pinia', icon: 'mdi-fruit-pineapple', color: '#FFD859' },
]
</script>


MAIN PAGE STRUCTURE BEGINS HERE
<template>
  <v-app>
    <v-main style="min-height: 100vh; display: flex; flex-direction: column;">
      <v-container fluid class = "ma-0 pa-0">
        <v-row dense no-gutters>
          <v-col cols="12">
            <!-- PAGE BANNER PATH HERE -->

            <v-card
              color="surface-variant"
              image= /homepageBG.png
              height="350"
              rounded="0"
            >
              <v-card-title style="background-color: rgba(0, 0, 0, 0.5); color: white;" class="d-flex mt-15 justify-center mb-5">
                <span class="font-weight-bold text-h4">
                  <div class="text-center mt-10">
                    <h1>By students, for students.</h1>
                    <h4>Meet the team behind ClubHub</h4>
                  </div>
                </span>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid class = "ma-0 pa-0">
        <v-row dense>
          <v-col cols="12">
            <v-card
              color=#041E42
              height="100"
              rounded="0"
              transition
            >
              <v-card-title>
                  <div class="text-center mt-5 font-italic">
                    <h2>CS 456 - Team 1 - Spring 2026</h2>
                  </div>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- END TITLE/HEADER STRUCTURE -->
        
      <!-- BASIC STRUCTURE FOR A NEW SECTION WITH THE SAME FORMATTING STARTS HERE -->
      <v-container fluid>
        <v-row class = "d-flex justify-center">
          
            <v-card class=" mt-15 mb-10 bg-white" flat color="transparent" height="300" width="1200">
              <v-card-title class=" d-flex justify-center rounded-xl bg-primary">
                <span class="font-weight-bold text-h4">
                  <h1>About ClubHub</h1>
                </span>
              </v-card-title>
              <v-card-text class="bg-surface mt-10 text-center">
                <P>
        Our webpage ClubHub will be a tool that can help and assist club officers on 
      campus with organizational duties and management by addressing the lack of 
      an effective, centralized webpage for officers and leaders of on campus clubs 
      and organizations, aiming to provide success through efficient leadership. 
      We intend to satisfy these needs by designing an accessible UI and frontend, 
      streamlined functions and information storage for essential club information 
      such as finances, supplemental forms, contacts, and events, and the continued 
      improvement of a backend API to allow for seamless communication between the 
      database and frontend. This document will go more over about the project, its 
      significance, changes, and impacts, along with how responsibilities and 
      risks are monitored and managed throughout the team. 
                </P>
              </v-card-text>
            </v-card>
         
        </v-row>
      </v-container>
      <!-- AND ENDS HERE; TO MAKE A NEW SECTION, COPY AND PASTE ABOVE/BELOW -->

      <v-container fluid>
        <v-row class = "d-flex justify-center">
          
            <v-card class=" mt-15 bg-white" flat color="transparent" width="700">
              <v-card-title class="d-flex justify-center text-center rounded-xl bg-primary">
                <span>
                  <h1>Meet the Team</h1>
                </span>
              </v-card-title>
            </v-card>
         
        </v-row>
      </v-container>

      <v-container fluid>
        <v-row class="mb-6 d-flex justify-center">
          <v-col
            v-for="dev in devs"
            :key="dev.name"
            cols="12" sm="6" md="3"
            class="d-flex justify-center"
          >
            <v-card
              class="mt-10 rounded-xl developer-card"
              elevation="12"
              width="260"
            >
              <v-card-title class="d-flex justify-center text-center bg-primary py-4">
                <div class="d-flex flex-column align-center ga-2">
                  <v-avatar size="52" color="white">
                    <span class="text-body-1 font-weight-bold" style="color: #041E42">
                      {{ dev.initials }}
                    </span>
                  </v-avatar>
                  <span class="text-body-1 font-weight-bold text-white">{{ dev.name }}</span>
                </div>
              </v-card-title>

              <v-card-text class="text-center pt-4">
                <v-chip
                  :color="dev.roleColor"
                  size="small"
                  label
                  variant="tonal"
                  class="mb-3"
                >
                  {{ dev.role }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mb-15 d-flex justify-center">
          <v-col cols="12" sm="8" md="4" class="d-flex justify-center">
            <v-card
              class="mt-5 rounded-xl advisor-card"
              elevation="12"
              width="500"
            >
              <v-card-title class="d-flex justify-center text-center bg-primary py-4">
                <div class="d-flex flex-column align-center ga-2">
                  <v-avatar size="52" color="white">
                  </v-avatar>
                  <span class="text-body-1 font-weight-bold text-white">{{ advisor.name }}</span>
                </div>
              </v-card-title>

              <v-card-text class="text-center pt-4">
                <v-chip
                  color="amber-darken-2"
                  size="small"
                  label
                  variant="tonal"
                  class="mb-2"
                >
                  {{ advisor.role }}
                </v-chip>
                <p class="text-body-2 text-medium-emphasis mt-2">
                  {{ advisor.department }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-sheet color="grey-lighten-4" class="py-12">
        <v-container fluid>
          <v-row class="d-flex justify-center mb-6">
            <v-card class="bg-white" flat color="transparent" width="700">
              <v-card-title class="d-flex justify-center text-center rounded-xl bg-primary">
                <h2 class="text-h5">Built With</h2>
              </v-card-title>
            </v-card>
          </v-row>
          <v-row class="d-flex justify-center" style="gap: 16px; flex-wrap: wrap;">
            <v-card
              v-for="tech in techStack"
              :key="tech.name"
              class="rounded-xl tech-card d-flex flex-column align-center justify-center pa-5"
              elevation="4"
              width="130"
              height="110"
            >
              <v-icon :color="tech.color" size="36" class="mb-2">{{ tech.icon }}</v-icon>
              <span class="text-body-2 font-weight-bold text-center">{{ tech.name }}</span>
            </v-card>
          </v-row>
        </v-container>
      </v-sheet>
 
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-card class="mt-15 mb-10 bg-white" flat color="transparent" height="300" width="800">
            <v-card-title class="d-flex justify-center rounded-xl bg-primary">
              <span class="font-weight-bold text-h4">Resources</span>
            </v-card-title>
            <v-card-text class="bg-surface mt-10 text-center">
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
 
    </v-main>
  </v-app>
</template>
 
<style scoped>
.developer-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.developer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(4, 30, 66, 0.15) !important;
}
.advisor-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.advisor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(4, 30, 66, 0.15) !important;
}
.tech-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(4, 30, 66, 0.12) !important;
}
</style>