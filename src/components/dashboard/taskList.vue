hardcoded task list for dashboard view 

<script setup>
    import TaskCard from './taskCard.vue'
    import EmptyState from '@/components/dashboard/emptyState.vue'
    //MOCK DATA - to be replaced with API call
    const tasks = [
    {
        id: 1,
        title: 'Finish finance request',
        'status': 'In Progress',
    },
    {
        id: 2,
        title: 'Prepare for club fair',
        'status': 'Not Started',
    },
    {
        id: 3,
        title: 'Update event calendar',
        'status': 'Completed',
    },
    ]
</script>

<template>
    <div>
        <TaskCard
        v-for="task in Tasks"
        :key="task.id"
        :task="task"
        />
        <EmptyState v-if="tasks.length === 0" message="No tasks available. Add a new task to get started!" />
    </div>
</template>