SETUP SCRIPT FOR IMPORTS, FUNCTION DECLARATION, GLOBAL VARIABLES, ETC
<script setup lang="ts">
  import Icon from './components/icon.vue'
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
                    <h1>Welcome to ClubHub</h1>
                    <h4>Your club management solution</h4>
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
                    <h2>Our CS 426 Senior Project in Computer Science, Spring 2025, at UNR's CSE Department.</h2>
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
                  <h1>About our Project</h1>
                </span>
              </v-card-title>
              <v-card-text class="bg-surface mt-10 text-center">
                <P>
                  TOOK THE ABSTRACT FROM OUR LAST PA. WILL DEFINETLY NEED WORK
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
                  <h1>About Team 1</h1>
                </span>
              </v-card-title>
            </v-card>
         
        </v-row>
      </v-container>

      <v-container fluid>
        <v-row class = "mb-15 d-flex justify-center">
          
            <v-card class=" mr-4 ml-4 mt-15 bg-white rounded-xl" elevation="12" height="150" width="300">
              <v-card-title class="d-flex justify-center text-center bg-primary">
                <span>
                  <h3>Daxton Johnson</h3>
                </span>
              </v-card-title>

              <v-card-text class="mt-5 text-center">
                <p>Full-Stack Developer;
                  Manages containerization and backend connectivity
                </p>
              </v-card-text>
            </v-card>

            <v-card class=" mr-4 ml-4 mt-15 bg-white rounded-xl" elevation="12" height="150" width="300">
              <v-card-title class="d-flex justify-center text-center bg-primary">
                <span>
                  <h3>Arwen Antes</h3>
                </span>
              </v-card-title>

              <v-card-text class="mt-5 text-center">
                <p>Full-Stack Developer</p>
              </v-card-text>
            </v-card>

            <v-card class=" mr-4 ml-4 mt-15 bg-white rounded-xl" elevation="12" height="150" width="300">
              <v-card-title class="d-flex justify-center text-center bg-primary">
                <span>
                  <h3>Aween Ali</h3>
                </span>
              </v-card-title>

              <v-card-text class="mt-5 text-center">
                <p>Full-Stack Developer</p>
              </v-card-text>
            </v-card>
         
        </v-row>

        <v-row class = "mb-15 d-flex justify-center">
          
            <v-card class=" mr-4 ml-4 mt-5 bg-white rounded-xl" elevation="12" height="150" width="300">
              <v-card-title class="d-flex justify-center text-center bg-primary">
                <span>
                  <h3>Dominic Palmieri</h3>
                </span>
              </v-card-title>

              <v-card-text class="mt-5 text-center">
                <p>Full-Stack Developer</p>
              </v-card-text>
            </v-card>

            <v-card class=" mr-4 ml-4 mt-5 bg-white rounded-xl" elevation="12" height="150" width="300">
              <v-card-title class="d-flex justify-center text-center bg-primary">
                <span>
                  <h3>Bill Doherty</h3>
                </span>
              </v-card-title>

              <v-card-text class="mt-5 text-center">
                <p>Staff Advisor, UNR Faculty</p>
              </v-card-text>
            </v-card>
        </v-row>
      </v-container>

      <v-container fluid>
        <v-row class = "d-flex justify-center">
          
            <v-card class=" mt-15 mb-10 bg-white" flat color="transparent" height="300" width="800">
              <v-card-title class=" d-flex justify-center rounded-xl bg-primary">
                <span class="font-weight-bold text-h4">
                  <h2>Resources</h2>
                </span>
              </v-card-title>
              <v-card-text class="bg-surface mt-10 text-center">
                <P>
          
                </P>
              </v-card-text>
            </v-card>
         
        </v-row>
      </v-container>
      
    </v-main>
  </v-app>
</template>

<style scoped></style>