<script setup lang="ts">
  import Icon from '@/assets/clubhub_logo.png'
</script>

<template>
  <nav class="top-nav">
    <div class="nav-left">
      <img src= {Icon} alt="ClubHub Logo" class="logo" />
    </div>

    <ul class="nav-links">
      <li><a href="#">Dashboard</a></li>
      <li><a href="#">Events</a></li>
      <li><a href="#">Tasks</a></li>
      <li><a href="#">Finances</a></li>
      <li><a href="#">Forms</a></li>
      <li><a href="#">Members</a></li>
    </ul>


    <div class="nav-right">
      <button class="profile-btn">Profile</button>
    </div>
  </nav>
</template>

