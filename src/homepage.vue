SETUP SCRIPT FOR IMPORTS, FUNCTION DECLARATION, GLOBAL VARIABLES, ETC
<script setup lang="ts">
  import Icon from './components/icon.vue'
  function iconClicked() {
    //Future implementation will direct user back to homepage when CH logo is clicked
  }
  const links = [
    'Home',
    'About Us',
    'Team',
    'Services',
    'Contact Us',
  ]
</script>


MAIN PAGE STRUCTURE BEGINS HERE
<template>
  <v-app>
    <!-- App bar displayed at the top of the page -->
    <v-app-bar :elevation="6" color=#B2B2B2>
      <template v-slot:prepend>
        <v-icon icon = "$chLogo" size=65 @click="iconClicked"/>
      </template>
      <v-divider :thickness="5" class="mx3" inset vertical />

      <v-app-bar-title class="text-h4 font-weight-bold">ClubHub</v-app-bar-title>

      <template v-slot:append>
        <v-btn append-icon="mdi-account">Login</v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
    <v-main style="min-height: 100vh; display: flex; flex-direction: column;">
      <v-container fluid class = "ma-0 pa-0">
        <v-row dense no-gutters>
          <v-col cols="12">
            <v-card
              color="surface-variant"
              image= src/assets/homepageBG.png
              height="350"
              rounded="0"
            >
            <v-card-title class="mt-16 mb-15">
                <div class="text-center">
                  <h1>Welcome to ClubHub</h1>
                  <h4>Your club management solution</h4>
                </div>
            </v-card-title>
            <v-card-actions class="justify-center">
              <v-btn
                class="mt-auto"
                append-icon="mdi-chevron-right"
                color="blue-lighten-2"
                text="Register a Club"
                variant="outlined"
                width="300"
                ></v-btn>
            </v-card-actions>
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
            >
              <v-card-title>
                  <div class="text-center mt-5 font-italic">
                    <h2>Your Club. All in one place.</h2>
                  </div>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-card 
            class = "mt-15 ml-15 mr-10 rounded-xl"
            height="300"
            width="400"
            elevation="20"
            >
              <v-img
              :width="400"
              :height="300"
              src=src/assets/clubFair2.png
              cover
              ></v-img>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="mt-15 mr-10 ml-10 bg-white" flat color="transparent" height="300">
              <v-card-title class="text-center rounded-xl bg-primary">
                <h1>Events</h1>
              </v-card-title>
              <v-card-text class="bg-surface mt-10 text-center">
                <P>Celebrate Pack culture through events hosted by clubs and organizations. View available and upcoming events and RSVP here!
                </P>
              </v-card-text>
              <v-card-actions class="mt-10 justify-center">
                <v-btn
                  class="mt-auto rounded-lg"
                  variant="outlined"
                  color="#041E42"
                  height="50"
                  width="200"
                >
                  Explore Events
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-card class="mt-15 ml-10 mr-10 bg-white" flat color="transparent" height="300">
              <v-card-title class="bg-primary rounded-xl text-center">
                <h1>Clubs and Orgs</h1>
              </v-card-title>
              <v-card-text class="bg-surface mt-10 text-center">
                <P>Find fun, friends, and your own Pack pride through clubs and organizations on campus. 
                </P>
              </v-card-text>
              <v-card-actions class="mt-10 justify-center">
                <v-btn
                  class="mt-auto rounded-lg"
                  variant="outlined"
                  color="#041E42"
                  height="50"
                  width="350"
                >
                  Explore Clubs and Organizations
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card 
              class = "mt-15 ml-15 rounded-xl" 
              width="400" 
              height="300"
              elevation="20"
            >
              <v-img
              :width="400"
              :height="300"
              cover
              src=src/assets/clubsOrgsImage.png
              ></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
     <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 mt-15" color="surface-light">
    <v-btn
      v-for="link in links"
      :key="link"
      :text="link"
      variant="text"
      rounded
    ></v-btn>
    <div class="flex-1-0-100 text-center mt-2">
      {{ new Date().getFullYear() }} — <strong>ClubHub</strong>
    </div>
  </v-footer>
  </v-app>
</template>

<style scoped></style>
