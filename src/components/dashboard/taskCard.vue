setup for taskCard component to display individual task details

<script setup>
    const props = defineProps({
        task: {
            type: Object,
            required: true
        }
    })

    const readStatus = 
        {
            'Not Started': 'not-started',
            'In Progress': 'in-progress',
            'Completed': 'completed'
        }[props.task.status]
</script>

<template>
    <div class="taskCard" :class="taskStatus">
        <div class="taskTitle">{{ task.title }}</div
        <div class="taskStatus" {{ readStatus }}</div>
        </div>
</template>
