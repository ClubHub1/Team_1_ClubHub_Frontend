<script setup>
    defineProps({
        message:String
    })
</script>

<template>
    <div class="emptyState">
        <p>{{ message }}</p>
    </div>
</template>
