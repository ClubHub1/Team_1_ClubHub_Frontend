<script setup>
    const props = defineProps({
        clubEvent: Object
    })

    const formatDate = new Date(props.event.date).toLocaleDateString(
        'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    )
</script>

<template>
    <div class="eventCard">
        <div class="eventMain">
            <div class="eventTitle">{{ clubEvent.title }}</div>
            <div class="eventDetails">
                <div class="eventDate">{{ formatDate }}</div>
                <div class="eventTime">{{ clubEvent.time }}</div>
                <div class="eventLocation">{{ clubEvent.location }}</div>
            </div>
        </div>
    </div>
    <button class="eventAction">Edit</button>
</template>
