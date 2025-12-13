<script setup>
    import TopNav from './TopNav.vue'
</script>

<template>
    <TopNav />
    <main class="dashboardContainer">
        <slot />
    </main>
</template>