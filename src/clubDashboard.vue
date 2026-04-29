<script setup lang="ts">
    import { ref, reactive, computed, VueElement, onMounted } from 'vue'
    import { useAuthStore } from './stores/auth'
    import useClubStore from './stores/clubStore'
    import { feathersClient } from './backendAPI'
    import useMemberStore from './stores/memberStore'
    import useUserStore from './stores/user'
    import { type Task } from '@/services/tasks'
    import ClubEventsPage from './clubEventsPage.vue'
    import financesPage from './financesPage.vue'
    import pCardRequest from './pCardRequest.vue'
    import travelRequest from './travelRequest.vue'
    import TravelRequest from './travelRequest.vue'
    import attendancePage from './attendancePage.vue'
    import LogoUpload from './components/LogoUpload.vue'

    const auth = useAuthStore()
    const clubStore = useClubStore()
    const memberStore = useMemberStore()
    const userStore = useUserStore()

    const USERROLE = ''
    const role = ref('Select Role')
    const email = ref('')
    const error = ref('')

    const loading = ref(false)
    const valid = ref(false)

    const memberList = []

    const logoUrl = `http://localhost:42063${clubStore.logo_url}`

    async function setPermissions(){
        console.log(logoUrl);
        const res = await(feathersClient.service("ClubMembership").find({
            query:{
                $select:['role', 'id'],
                userid: userStore.id,
                clubid: clubStore.id
            }
        })).catch(err =>{
            console.log('SERVER THREW ERROR RETRIEVING MEMBERSHIP ENTRY: ', err)
        })

        if(res){
            const memberInfo = res.data
            console.log('CURRENT MEMBERINFO: ', memberInfo[0].role, ' ', memberInfo[0].id)

            memberStore.setRole(memberInfo[0].role)
            memberStore.setId(memberInfo[0].id)
        }
        
        const memberRes = await(feathersClient.service("ClubMembership").find({
            query: {
                clubid: clubStore.id,
                $sort: {
                    userid: -1
                }
            }
        })).catch(err =>{
            error.value = err
            console.log(error)
        })

        const userIds = []

        if(memberRes){
            console.log(memberRes)
            const memberArray = memberRes.data
            for(const member of memberArray){
                userIds.push(member.userid)
            }

            console.log('USER IDS: ', userIds)

            const usersRes = await(feathersClient.service("User").find({
                query:{
                    $sort: {
                        id: -1
                    },
                    id: {
                        $in: userIds
                    }
                }
            })).catch(err=>{
                error.value = err
                console.log(error)
            })

            if(usersRes){
                console.log(usersRes)
                const userData = usersRes.data

                console.log(userData)

                for(let i = 0; i < userData.length; i++){
                    memberList.push({
                        memberFName: userData[i].first_name,
                        memberLName: userData[i].last_name,
                        memberEmail: userData[i].email,
                        membershipID: memberArray[i].id,
                        memberRole: memberArray[i].role
                    });
                }

                console.log(memberList)
            }
        }
    }

    const emailRules = [
        (value: string) => {
        if (value) return true
        return 'E-mail is required.'
        },
        (value: string) => {
        if (/^[a-z0-9._%+-]+@unr\.edu$/i.test(value)) return true
        return 'E-mail must be valid and school issued ("@unr").'
        },
    ]

    onMounted(setPermissions)

    const sections = [
        { id: 'dashboard', label: 'Club Dashboard', icon: 'mdi-view-dashboard-variant-outline', roles:['advisor','president', 'vice_pres', 'treasurer', 'secretary', 'member']},
        { id: 'createEvent', label: 'Create Event', icon: 'mdi-calendar-plus', roles:['advisor', 'president', 'vice_pres', 'treasurer', 'secretary']},
        { id: 'createAnnouncement', label: 'Create Announcement', icon: 'mdi-bullhorn-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary']},
        { id: 'members', label: 'Members', icon: 'mdi-account-multiple', roles:['advisor', 'president', 'vice_pres', 'treasurer', 'secretary']},
        { id: 'finances', label: 'Finances', icon: 'mdi-cash-multiple', roles:['advisor', 'president', 'treasurer']},
        { id: 'tasks', label: 'Tasks', icon: 'mdi-clipboard-check-outline', roles:['advisor', 'president', 'vice_pres', 'treasurer', 'secretary', 'member']},
        { id: 'createTask', label: 'Create Task', icon: 'mdi-clipboard-plus-outline', roles:['advisor', 'president', 'vice_pres', 'treasurer', 'secretary']},
        { id: 'editTask', label: 'Edit Tasks', icon: 'mdi-clipboard-edit-outline', roles:['advisor', 'president', 'vice_pres', 'treasurer', 'secretary']},
        { id: 'forms', label: 'Club Forms', icon: 'mdi-clipboard', roles:['advisor', 'president', 'vice_pres', 'treasurer']},
        { id: 'attendance', label: 'Attendance', icon: 'mdi-account-check', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary', 'Member'] },
        { id: 'settings', label: 'Settings', icon:'mdi-cog', roles:['advisor', 'president']},
    ]

    const activeSections = computed(() => {
        console.log('AUTHENTICATED USER ROLE: ', memberStore.role)
        console.log(sections)
        return sections.filter(item => item.roles.includes(memberStore.role))
    });

    console.log(activeSections.value)

    const selected = ref('dashboard')

    const announcementForm = reactive({ title: '', message: '' })

    const members = ref([])

    const transactions = ref([
        { id: 1, date: '2026-02-01', description: 'Membership fees', amount: 200 },
        { id: 2, date: '2026-02-15', description: 'Poster printing', amount: -40 }
    ])

    const balance = computed(() => transactions.value.reduce((s, t) => s + t.amount, 0))

    function submitAnnouncement() {
        // TODO: wire to backend API
        console.log('Create Announcement', { ...announcementForm })
        Object.assign(announcementForm, { title: '', message: '' })
    }

    const taskForm = reactive({ title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
    const taskFormValid = ref(false)
    const taskFormLoading = ref(false)
    const taskFormError = ref('')
    const taskFormSuccess = ref(false)

    const taskPriorities = ['Low', 'Medium', 'High']
    const taskStatuses = ['Not Started', 'In Progress', 'Complete']

    async function submitTask() {
        if (!taskFormValid.value) return
        taskFormLoading.value = true
        taskFormError.value = ''
        taskFormSuccess.value = false
        try {
            const now = new Date().toISOString()
            await feathersClient.service('Task').create({
                club: String(clubStore.id),
                title: taskForm.title,
                due_date: taskForm.due_date,
                description: taskForm.description,
                created_at: now,
                updated_at: now,
                priority: taskForm.priority,
                status: taskForm.status,
            })
            taskFormSuccess.value = true
            Object.assign(taskForm, { title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
        } catch (err) {
            taskFormError.value = 'Failed to create task. Please try again.'
            console.error(err)
        } finally {
            taskFormLoading.value = false
        }
    }

    function addTransaction() {
        const id = transactions.value.length + 1
        transactions.value.push({ id, date: new Date().toISOString().slice(0, 10), description: 'New tx', amount: 0 })
    }

    function manageMember(id: number) {
        console.log('MANAGING MEMBER WITH MEMBERSHIP ID:', id)
    }

    async function addMember(){
        if (!valid.value) return

        error.value = ''
        loading.value = true

        if(role.value != 'Member'){
            const res = await(feathersClient.service('ClubMembership')).find({
                query: {
                    clubid: clubStore.id,
                    role: role.value
                }
            })
            console.log('MEMBERADD RES: ', res)
            if(res.data.length >= 1){
                error.value = 'Role is already taken in this organization!'
                loading.value = false;
                return
            } else {
                console.log("ROLE NOT TAKEN")
            }
        }

        for(const member of memberList){
            if(member.memberEmail == email.value){
                error.value = 'The user with this email is already a member!'
                loading.value = false;
                return
            } else {
                console.log("USER NOT A MEMBER")
            }
        }

        console.log(email.value)
        const res = await(feathersClient.service("User").find({
            query:{
                $select: ['id', 'email'],
                email: email.value,
            }
        }))
        console.log(res)
        if(res.data.length == 1){
            console.log(res.data[0])
            const newMember = await(feathersClient.service("ClubMembership")._create({
                clubid: clubStore.id,
                userid: res.data[0].id,
                role: role.value,
                is_active: true,
                dues_paid: false,
            }))
            console.log(newMember)
            selected.value = "members"
        } else {
            console.log("User does not exist in the system- check their email")
        }
    }

    function cellPropHandler({item, column}){
        if (item.memberRole == 'president' && column.title == 'Role') {
            return { class: 'bg-error rounded px-2 py-1' };
        }
        return null;
    }

    const tasks = ref<Task[]>([])
    const tasksLoading = ref(false)
    const tasksError = ref<string | null>(null)

    const priorityColor: Record<string, string> = {
        Low: 'green', Medium: 'blue', High: 'orange'
    }
    const statusColor: Record<string, string> = {
        'Not Started': 'grey', 'In Progress': 'blue', 'Complete': 'green'
    }

    async function loadTasks() {
        tasksLoading.value = true
        tasksError.value = null
        try {
            const res = await feathersClient.service('Task').find({
                query: {
                    club: String(clubStore.id),
                }
            })
            const now = new Date()
            tasks.value = res.data.map((task: any) => {
                const due = new Date(task.due_date)
                const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                return {
                    ...task,
                    daysUntilDue: diffDays < 0 ? 'overdue' : diffDays
                }
            })
        } catch (err) {
            tasksError.value = 'Failed to load tasks.'
            console.error(err)
        } finally {
            tasksLoading.value = false
        }
    }

    function handleNavClick(sectionId: string) {
        selected.value = sectionId
        if (sectionId === 'tasks') loadTasks()
        if (sectionId === 'editTask') loadTasks()
    }

    const editTaskForm = reactive({ id: null as number | null, title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
    const editTaskValid = ref(false)
    const editTaskLoading = ref(false)
    const editTaskError = ref('')
    const editTaskSuccess = ref('')
    const selectedTask = ref<Task | null>(null)

    function selectTaskForEdit(task: Task) {
        selectedTask.value = task
        Object.assign(editTaskForm, {
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            due_date: task.due_date,
        })
        editTaskError.value = ''
        editTaskSuccess.value = ''
    }

    async function saveTaskEdit() {
        if (!editTaskValid.value || !editTaskForm.id) return
        editTaskLoading.value = true
        editTaskError.value = ''
        editTaskSuccess.value = ''
        try {
            const now = new Date().toISOString()
            await feathersClient.service('Task').patch(editTaskForm.id, {
                title: editTaskForm.title,
                description: editTaskForm.description,
                priority: editTaskForm.priority,
                status: editTaskForm.status,
                due_date: editTaskForm.due_date,
                updated_at: now,
            })
            editTaskSuccess.value = 'Task updated successfully!'
            await loadTasks()
        } catch (err) {
            editTaskError.value = 'Failed to update task. Please try again.'
            console.error(err)
        } finally {
            editTaskLoading.value = false
        }
    }

    async function deleteTask(id: number) {
        if (!confirm('Are you sure you want to delete this task?')) return
        try {
            await feathersClient.service('Task').remove(id)
            if (selectedTask.value?.id === id) {
                selectedTask.value = null
                Object.assign(editTaskForm, { id: null, title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
            }
            await loadTasks()
        } catch (err) {
            editTaskError.value = 'Failed to delete task. Please try again.'
            console.error(err)
        }
    }

</script>

<template>
    <v-app>
        <v-navigation-drawer expand-on-hover permanent rail width="260" app>
            <v-list>
                <v-list-item
                    v-for="s in activeSections"
                    :key="s.id"
                    :value="s.id"
                    @click="handleNavClick(s.id)"
                    :active="selected === s.id"
                    :prepend-icon="s.icon"
                >
                    <v-list-item-title>{{ s.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="primary">
            <v-toolbar-title><span class="font-weight-bold">{{ clubStore.name }}</span> — Manage your organization</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container class="pa-6">
                <div v-if="selected === 'dashboard'">
                    <v-row justify="center">
                        <h1 class="mt-8">Welcome to your club's management page!</h1>
                        <p class="text-center mt-8">Here you can view and create events or tasks, manage your club's members and invite new ones, and edit your club's finances! Hover over the navigation bar on the left to get started.</p>
                    </v-row>
                </div>

                <div v-if="selected === 'createEvent'">
                    <club-events-page></club-events-page>
                </div>

                <div v-if="selected === 'createAnnouncement'" class="mt-6">
                    <v-card>
                        <v-card-title>Create Announcement</v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field v-model="announcementForm.title" label="Title" />
                                <v-textarea v-model="announcementForm.message" label="Message" rows="4" />
                                <v-row class="mt-4">
                                    <v-col>
                                        <v-btn color="primary" @click="submitAnnouncement">Publish</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'members'" class="mt-6">
                    <v-card>
                        <v-card-title>Members</v-card-title>
                        <v-card-text>
                            <v-data-table :cell-props="cellPropHandler" :items="memberList" :headers="[{title:'First Name',key:'memberFName'},{title:'Last Name',key:'memberLName'},{title:'Role',key:'memberRole',},{title:'Email',key:'memberEmail'},{title:'Actions',key:'actions'}]">
                                <template #item.actions="{ item }">
                                    <v-btn class="ml-3" icon="mdi-cog" height="30" width="30" @click="manageMember(item.membershipID)"></v-btn>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                    <v-row justify="center" class="mt-15">
                        <v-btn color="primary" class="justify-center" @click="selected = 'memberAdd'">
                            Add Members
                        </v-btn>
                    </v-row>
                </div>

                <div v-if="selected === 'memberAdd'" class="mt-6">
                    <v-form v-model="valid" class="mt-7" @submit.prevent="addMember">
              
                        <v-row>
                            <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                            class="mr-6 mb-5"
                            />
                        </v-row>

                        <v-row>
                            <v-menu>
                                <template v-slot:activator="{props}"> 
                                    <v-btn v-if="role == 'Select Role'" v-bind="props" color="primary">{{ role }}</v-btn>
                                    <v-btn v-if="role == 'president'" v-bind="props" color="purple-darken-3">{{ role }}</v-btn>
                                    <v-btn v-if="role == 'vice_pres'" v-bind="props" color="cyan-darken-1">{{ role }}</v-btn>
                                    <v-btn v-if="role == 'treasurer'" v-bind="props" color="amber-lighten-1">{{ role }}</v-btn>
                                    <v-btn v-if="role == 'secretary'" v-bind="props" color="green-darken-3">{{ role }}</v-btn>
                                    <v-btn v-if="role == 'Member'" v-bind="props" color="blue-grey-lighten-1">{{ role }}</v-btn>
                                </template>

                                <v-list>
                                    <v-list-item @click="role = 'president'" :active="role==='president'">president</v-list-item>
                                    <v-list-item @click="role = 'vice_pres'" :active="role==='vice_pres'">vice_pres</v-list-item>
                                    <v-list-item @click="role = 'treasurer'" :active="role==='treasurer'">treasurer</v-list-item>
                                    <v-list-item @click="role = 'secretary'" :active="role==='secretary'">secretary</v-list-item>
                                    <v-list-item @click="role = 'member'" :active="role==='member'">Member</v-list-item>
                                </v-list>
                            </v-menu>
                        </v-row>

                        <v-row v-if="error" class="mt-10">
                            <v-alert type="error" variant="tonal" class="mr-6">{{ error }}</v-alert>
                        </v-row>

                        <v-row class="justify-center">
                            <v-btn type="submit" class="mt-7 bg-primary" width="150" :loading="loading">
                                Add Member
                            </v-btn>
                        </v-row>
                    </v-form>
                </div>

                <div v-if="selected === 'finances'" class="mt-6">
                    <finances-page></finances-page>
                </div>

                <div v-if="selected === 'settings'" class="mt-6">
                    <v-card>
                        <v-card-title>Settings</v-card-title>
                        <v-card-text>
                            <div>Manage club settings, roles, and integration options here.</div>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'tasks'" class="mt-6">
                    <v-card>
                        <v-card-title class="d-flex align-center justify-space-between">
                            Tasks
                            <v-btn size="small" variant="tonal" prepend-icon="mdi-refresh" @click="loadTasks">Refresh</v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-alert v-if="tasksError" type="error" variant="tonal" class="mb-4">{{ tasksError }}</v-alert>
                            <v-data-table
                                :items="tasks"
                                :loading="tasksLoading"
                                loading-text="Loading tasks..."
                                :headers="[
                                    { title: 'Title', key: 'title' },
                                    { title: 'Priority', key: 'priority' },
                                    { title: 'Status', key: 'status' },
                                    { title: 'Days Left', key: 'daysUntilDue' },
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
                                        :color="item.daysUntilDue === 'overdue' ? 'red' : Number(item.daysUntilDue) <= 3 ? 'orange' : 'green'"
                                        size="x-small"
                                        variant="tonal"
                                    >
                                        {{ item.daysUntilDue === 'overdue' ? 'Overdue' : `${item.daysUntilDue}d` }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'createTask'" class="mt-6">
                    <v-card>
                        <v-card-title>Create Task</v-card-title>
                        <v-card-text>
                            <v-alert v-if="taskFormSuccess" type="success" variant="tonal" class="mb-4" closable @click:close="taskFormSuccess = false">
                                Task created successfully!
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
                                        <v-btn type="submit" color="primary" :loading="taskFormLoading">Create Task</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'editTask'" class="mt-6">
                    <v-row>
                        <!-- Task list for selection -->
                        <v-col cols="12" md="5">
                            <v-card height="100%">
                                <v-card-title>Select a Task</v-card-title>
                                <v-card-text>
                                    <v-alert v-if="tasksError" type="error" variant="tonal" class="mb-3">{{ tasksError }}</v-alert>
                                    <v-list lines="two" select-strategy="single-leaf">
                                        <v-list-item
                                            v-for="task in tasks"
                                            :key="task.id"
                                            :title="task.title"
                                            :subtitle="task.status"
                                            :active="selectedTask?.id === task.id"
                                            active-color="primary"
                                            @click="selectTaskForEdit(task)"
                                        >
                                            <template #append>
                                                <v-chip :color="priorityColor[task.priority] ?? 'grey'" size="x-small" variant="tonal" class="mr-2">
                                                    {{ task.priority }}
                                                </v-chip>
                                                <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click.stop="deleteTask(task.id)" />
                                            </template>
                                        </v-list-item>
                                        <v-list-item v-if="tasks.length === 0 && !tasksLoading">
                                            <v-list-item-title class="text-grey">No tasks found for this club.</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <!-- Edit form -->
                        <v-col cols="12" md="7">
                            <v-card height="100%">
                                <v-card-title>Edit Task</v-card-title>
                                <v-card-text>
                                    <div v-if="!selectedTask" class="text-grey mt-4">
                                        Select a task on the left to edit it.
                                    </div>
                                    <div v-else>
                                        <v-alert v-if="editTaskSuccess" type="success" variant="tonal" class="mb-4" closable @click:close="editTaskSuccess = ''">
                                            {{ editTaskSuccess }}
                                        </v-alert>
                                        <v-alert v-if="editTaskError" type="error" variant="tonal" class="mb-4">
                                            {{ editTaskError }}
                                        </v-alert>
                                        <v-form v-model="editTaskValid" @submit.prevent="saveTaskEdit">
                                            <v-text-field
                                                v-model="editTaskForm.title"
                                                label="Title"
                                                :rules="[v => !!v || 'Title is required']"
                                                required
                                            />
                                            <v-textarea
                                                v-model="editTaskForm.description"
                                                label="Description"
                                                rows="3"
                                            />
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-select
                                                        v-model="editTaskForm.priority"
                                                        :items="taskPriorities"
                                                        label="Priority"
                                                        prepend-inner-icon="mdi-flag-outline"
                                                    />
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-select
                                                        v-model="editTaskForm.status"
                                                        :items="taskStatuses"
                                                        label="Status"
                                                        prepend-inner-icon="mdi-list-status"
                                                    />
                                                </v-col>
                                            </v-row>
                                            <v-text-field
                                                v-model="editTaskForm.due_date"
                                                label="Due Date"
                                                type="date"
                                                prepend-inner-icon="mdi-calendar"
                                            />
                                            <v-row class="mt-2">
                                                <v-col>
                                                    <v-btn type="submit" color="primary" :loading="editTaskLoading">Save Changes</v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <div v-if="selected === 'attendance'">
                    <ClubAttendancePage />
                </div>

                <div v-if="selected==='forms'">

                    <v-btn @click="selected='pcard'">
                        P Card Form
                    </v-btn>

                    <v-btn class="ml-14" @click="selected='travelreq'">
                        Travel Request Form
                    </v-btn>

                </div>

                <div v-if="selected==='pcard'">
                    <p-card-request></p-card-request>

                </div>

                <div v-if="selected==='travelreq'">
                    <travel-request></travel-request>

                </div>

                <div v-if="selected === 'manageMember'" class="mt-6">
                    <v-card>
                        <v-card-title>Settings</v-card-title>
                        <v-card-text>
                            <div>Manage club settings, roles, and integration options here.</div>
                        </v-card-text>
                    </v-card>
                </div>

            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped>
.mt-6 { margin-top: 24px; }
</style>

<style scoped>
.club-logo {
    max-width: 200px;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
} 
</style>