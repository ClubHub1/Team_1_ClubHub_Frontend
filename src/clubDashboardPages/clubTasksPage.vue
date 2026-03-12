<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { feathersClient } from '../backendAPI'
import useClubStore from '../stores/clubStore'
import { getTasks, type Task } from '@/services/tasks'

const clubStore = useClubStore()
const view = ref<'list' | 'form'>('list')

const tasks        = ref<Task[]>([])
const tasksLoading = ref(false)
const tasksError   = ref<string | null>(null)

const priorityColor: Record<string, string> = {
    Low: 'green', Medium: 'blue', High: 'orange'
}
const statusColor: Record<string, string> = {
    'Not Started': 'grey', 'In Progress': 'blue', 'Completed': 'green'
}

async function loadTasks() {
    tasksLoading.value = true
    tasksError.value   = null
    try {
        tasks.value = await getTasks()
    } catch (err) {
        tasksError.value = 'Failed to load tasks.'
        console.error(err)
    } finally {
        tasksLoading.value = false
    }
}

const editingTask = ref<Task | null>(null)

function editTask(task: Task) {
    editingTask.value = task
    Object.assign(taskForm, {
        title:       task.title,
        description: task.description,
        priority:    task.priority,
        status:      task.status,
        due_date:    task.due_date,
    })
    view.value = 'form'
}

function clearTaskForm() {
    editingTask.value = null
    Object.assign(taskForm, {
        title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: ''
    })
    taskFormSuccess.value = false
    taskFormError.value   = ''
}

function openCreateForm() {
    clearTaskForm()
    view.value = 'form'
}

function backToList() {
    clearTaskForm()
    view.value = 'list'
}

const taskForm = reactive({
    title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: ''
})
const taskFormValid   = ref(false)
const taskFormLoading = ref(false)
const taskFormError   = ref('')
const taskFormSuccess = ref(false)
const taskPriorities = ['Low', 'Medium', 'High']
const taskStatuses   = ['Not Started', 'In Progress', 'Completed']

async function submitTask() {
    if (!taskFormValid.value) return
    taskFormLoading.value = true
    taskFormError.value   = ''
    taskFormSuccess.value = false

    try {
        const now = new Date().toISOString()
        if (editingTask.value) {
            await (feathersClient.service('Task') as any).patch(editingTask.value.id, {
                title: taskForm.title,
                description: taskForm.description,
                priority: taskForm.priority,
                status: taskForm.status,
                due_date: taskForm.due_date,
                updated_at: now,
            })
        } else {
            await (feathersClient.service('Task') as any).create({
                club: String(clubStore.id),
                title: taskForm.title,
                description: taskForm.description,
                priority: taskForm.priority,
                status: taskForm.status,
                due_date: taskForm.due_date,
                created_at: now,
                updated_at: now,
            })
        }

        taskFormSuccess.value = true
        await loadTasks()
    } catch (err) {
        taskFormError.value = 'Failed to save task. Please try again.'
        console.error(err)
    } finally {
        taskFormLoading.value = false
    }
}

onMounted(loadTasks)
</script>

<template>
    <div v-if="view === 'list'">
        <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
                Tasks
                <div class="d-flex ga-2">
                    <v-btn size="small" variant="tonal" prepend-icon="mdi-refresh" @click="loadTasks">
                        Refresh
                    </v-btn>
                    <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="openCreateForm">
                        Create Task
                    </v-btn>
                </div>
            </v-card-title>
            <v-card-text>
                <v-alert v-if="tasksError" type="error" variant="tonal" class="mb-4">
                    {{ tasksError }}
                </v-alert>
                <v-data-table
                    :items="tasks"
                    :loading="tasksLoading"
                    loading-text="Loading tasks..."
                    :headers="[
                        { title: 'Title',     key: 'title' },
                        { title: 'Priority',  key: 'priority' },
                        { title: 'Status',    key: 'status' },
                        { title: 'Days Left', key: 'daysUntilDue' },
                        { title: 'Actions',   key: 'actions', sortable: false },
                    ]"
                    density="compact"
                >
                    <template #item.priority="{ item }">
                        <v-chip :color="priorityColor[item.priority] ?? 'grey'" size="x-small" variant="tonal">
                            {{ item.priority }}
                        </v-chip>
                    </template>
                    <template #item.status="{ item }">
                        <v-chip :color="statusColor[item.status] ?? 'grey'" size="x-small" variant="tonal">
                            {{ item.status }}
                        </v-chip>
                    </template>
                    <template #item.daysUntilDue="{ item }">
                        <v-chip
                            :color="String(item.daysUntilDue) === 'overdue' ? 'red' : Number(item.daysUntilDue) <= 3 ? 'orange' : 'green'"
                            size="x-small"
                            variant="tonal"
                        >
                            {{ String(item.daysUntilDue) === 'overdue' ? 'Overdue' : `${item.daysUntilDue}d` }}
                        </v-chip>
                    </template>
                    <template #item.actions="{ item }">
                        <v-btn
                            icon="mdi-pencil-outline"
                            size="x-small"
                            variant="text"
                            color="primary"
                            @click="editTask(item)"
                        />
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>

    <div v-else>
        <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
                {{ editingTask ? 'Edit Task' : 'Create Task' }}
                <v-btn size="small" variant="text" prepend-icon="mdi-arrow-left" @click="backToList">
                    Back to Tasks
                </v-btn>
            </v-card-title>
            <v-card-text>

                <v-alert
                    v-if="taskFormSuccess"
                    type="success"
                    variant="tonal"
                    class="mb-4"
                    closable
                    @click:close="taskFormSuccess = false"
                >
                    Task {{ editingTask ? 'updated' : 'created' }} successfully!
                </v-alert>
                <v-alert v-if="taskFormError" type="error" variant="tonal" class="mb-4">
                    {{ taskFormError }}
                </v-alert>

                <v-form v-model="taskFormValid" @submit.prevent="submitTask">
                    <v-text-field
                        v-model="taskForm.title"
                        label="Title"
                        :rules="[v => !!v || 'Title is required']"
                        required
                    />
                    <v-textarea
                        v-model="taskForm.description"
                        label="Description"
                        rows="3"
                    />
                    <v-row>
                        <v-col cols="6">
                            <v-select
                                v-model="taskForm.priority"
                                :items="taskPriorities"
                                label="Priority"
                                prepend-inner-icon="mdi-flag-outline"
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                v-model="taskForm.status"
                                :items="taskStatuses"
                                label="Status"
                                prepend-inner-icon="mdi-list-status"
                            />
                        </v-col>
                    </v-row>
                    <v-text-field
                        v-model="taskForm.due_date"
                        label="Due Date"
                        type="date"
                        prepend-inner-icon="mdi-calendar"
                    />
                    <v-row class="mt-2">
                        <v-col>
                            <v-btn type="submit" color="primary" :loading="taskFormLoading">
                                {{ editingTask ? 'Save Changes' : 'Create Task' }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>
        </v-card>
    </div>

</template>