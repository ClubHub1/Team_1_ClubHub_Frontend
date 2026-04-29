<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
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
import attendancePage from './attendancePage.vue'
import LogoUpload from './components/LogoUpload.vue'
import resourceCheckout from './resourceCheckouts.vue'

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

    const memberList: any[] = []

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

    if (usersRes) {
      const userData = usersRes.data
      for (let i = 0; i < userData.length; i++) {
        memberList.push({
          memberFName: userData[i].first_name, memberLName: userData[i].last_name,
          memberEmail: userData[i].email, membershipID: memberArray[i].id, memberRole: memberArray[i].role
        })
      }
    }
  }
}

const emailRules = [
  (v: string) => !!v || 'E-mail is required.',
  (v: string) => /^[a-z0-9._%+-]+@unr\.edu$/i.test(v) || 'Must be a valid UNR email (@unr.edu).',
]

onMounted(setPermissions)

const sections = [
  { id: 'dashboard', label: 'Club Dashboard', icon: 'mdi-view-dashboard-variant-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary', 'member'] },
  { id: 'createEvent', label: 'Create Event', icon: 'mdi-calendar-plus', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary'] },
  { id: 'createAnnouncement', label: 'Announcement', icon: 'mdi-bullhorn-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary'] },
  { id: 'members', label: 'Members', icon: 'mdi-account-multiple', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary'] },
  { id: 'finances', label: 'Finances', icon: 'mdi-cash-multiple', roles: ['advisor', 'president', 'treasurer'] },
  { id: 'tasks', label: 'Tasks', icon: 'mdi-clipboard-check-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary', 'member'] },
  { id: 'createTask', label: 'Create Task', icon: 'mdi-clipboard-plus-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary'] },
  { id: 'editTask', label: 'Edit Tasks', icon: 'mdi-clipboard-edit-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary'] },
  { id: 'forms', label: 'Club Forms', icon: 'mdi-clipboard', roles: ['advisor', 'president', 'vice_pres', 'treasurer'] },
  { id: 'submissions', label: 'Form Submissions', icon: 'mdi-file-document-multiple-outline', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary', 'member'] },
  { id: 'attendance', label: 'Attendance', icon: 'mdi-account-check', roles: ['advisor', 'president', 'vice_pres', 'treasurer', 'secretary', 'member'] },
  { id: 'settings', label: 'Settings', icon: 'mdi-cog', roles: ['advisor', 'president'] },
]

const activeSections = computed(() => sections.filter(item => item.roles.includes(memberStore.role)))
const selected = ref('dashboard')

const announcementForm = reactive({ title: '', message: '' })

function submitAnnouncement() {
  console.log('Create Announcement', { ...announcementForm })
  Object.assign(announcementForm, { title: '', message: '' })
}

// Tasks
const taskForm = reactive({ title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
const taskFormValid = ref(false)
const taskFormLoading = ref(false)
const taskFormError = ref('')
const taskFormSuccess = ref(false)
const taskPriorities = ['Low', 'Medium', 'High']
const taskStatuses = ['Not Started', 'In Progress', 'Complete']
const tasks = ref<Task[]>([])
const tasksLoading = ref(false)
const tasksError = ref<string | null>(null)
const priorityColor: Record<string, string> = { Low: 'green', Medium: 'blue', High: 'orange' }
const statusColor: Record<string, string> = { 'Not Started': 'grey', 'In Progress': 'blue', 'Complete': 'green' }

async function submitTask() {
  if (!taskFormValid.value) return
  taskFormLoading.value = true
  taskFormError.value = ''
  taskFormSuccess.value = false
  try {
    const now = new Date().toISOString()
    await feathersClient.service('Task').create({
      club: String(clubStore.id), title: taskForm.title, due_date: taskForm.due_date,
      description: taskForm.description, created_at: now, updated_at: now,
      priority: taskForm.priority, status: taskForm.status,
    })
    taskFormSuccess.value = true
    Object.assign(taskForm, { title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
  } catch (err) {
    taskFormError.value = 'Failed to create task. Please try again.'
  } finally {
    taskFormLoading.value = false
  }
}

async function loadTasks() {
  tasksLoading.value = true
  tasksError.value = null
  try {
    const res = await feathersClient.service('Task').find({ query: { club: String(clubStore.id) } })
    const now = new Date()
    tasks.value = res.data.map((task: any) => {
      const due = new Date(task.due_date)
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return { ...task, daysUntilDue: diffDays < 0 ? 'overdue' : diffDays }
    })
  } catch (err) {
    tasksError.value = 'Failed to load tasks.'
  } finally {
    tasksLoading.value = false
  }
}

function handleNavClick(sectionId: string) {
  selected.value = sectionId
  if (sectionId === 'tasks' || sectionId === 'editTask') loadTasks()
  if (sectionId === 'submissions') loadSubmissions()
}

// Edit task
const editTaskForm = reactive({ id: null as number | null, title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' })
const editTaskValid = ref(false)
const editTaskLoading = ref(false)
const editTaskError = ref('')
const editTaskSuccess = ref('')
const selectedTask = ref<Task | null>(null)

function selectTaskForEdit(task: Task) {
  selectedTask.value = task
  Object.assign(editTaskForm, { id: task.id, title: task.title, description: task.description, priority: task.priority, status: task.status, due_date: task.due_date })
  editTaskError.value = ''
  editTaskSuccess.value = ''
}

async function saveTaskEdit() {
  if (!editTaskValid.value || !editTaskForm.id) return
  editTaskLoading.value = true
  editTaskError.value = ''
  editTaskSuccess.value = ''
  try {
    await feathersClient.service('Task').patch(editTaskForm.id, {
      title: editTaskForm.title, description: editTaskForm.description,
      priority: editTaskForm.priority, status: editTaskForm.status,
      due_date: editTaskForm.due_date, updated_at: new Date().toISOString(),
    })
    editTaskSuccess.value = 'Task updated successfully!'
    await loadTasks()
  } catch (err) {
    editTaskError.value = 'Failed to update task. Please try again.'
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
    editTaskError.value = 'Failed to delete task.'
  }
}

async function addMember() {
  if (!valid.value) return
  error.value = ''
  loading.value = true

  if (role.value !== 'Member') {
    const res = await feathersClient.service('ClubMembership').find({ query: { clubid: clubStore.id, role: role.value } })
    if (res.data.length >= 1) { error.value = 'Role is already taken in this organization!'; loading.value = false; return }
  }
  for (const member of memberList) {
    if (member.memberEmail === email.value) { error.value = 'User is already a member!'; loading.value = false; return }
  }
  const res = await feathersClient.service('User').find({ query: { $select: ['id', 'email'], email: email.value } })
  if (res.data.length === 1) {
    await feathersClient.service('ClubMembership')._create({
      clubid: clubStore.id, userid: res.data[0].id, role: role.value, is_active: true, dues_paid: false,
    })
    selected.value = 'members'
  } else {
    error.value = 'User does not exist in the system.'
  }
  loading.value = false
}

function manageMember(id: number) { console.log('MANAGING MEMBER WITH MEMBERSHIP ID:', id) }

// ── Form Submissions ──
const selectedSubmission = ref<any>(null)
const newComment = ref('')
const submissions = ref<any[]>([])
const submissionsLoading = ref(false)

const formTypeMap: Record<string, { icon: string; color: string }> = {
  'P-Card Request':     { icon: 'mdi-credit-card-outline',       color: 'warning' },
  'Travel Request':     { icon: 'mdi-airplane',                  color: 'success' },
  'Resource Checkout':  { icon: 'mdi-package-variant-closed',    color: 'primary' },
}

async function loadSubmissions() {
  submissionsLoading.value = true
  try {
    const [pcards, travels, resources] = await Promise.all([
      feathersClient.service('p-card-requests').find({ query: { club: clubStore.id, : { created_at: -1 } } }),
      feathersClient.service('travel-requests').find({ query: { club: clubStore.id, : { created_at: -1 } } }),
      feathersClient.service('resource-checkouts').find({ query: { club: clubStore.id, : { created_at: -1 } } }),
    ])
    const map = (arr: any[], type: string) => arr.map((r: any) => ({
      id: r.id ?? r._id,
      formName: type === 'P-Card Request' ? 'ASUN/CSE Credit Card Request'
               : type === 'Travel Request' ? 'ASUN/CSE Travel Request'
               : 'ASUN Club Resource Checkout',
      formType: type,
      status: r.status ?? 'Submitted',
      statusColor: r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'error' : r.status === 'Returned' ? 'grey' : 'warning',
      progress: r.status === 'Approved' || r.status === 'Returned' ? 100 : 60,
      icon: formTypeMap[type].icon,
      submittedDate: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
      lastUpdated: r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
      comments: r.comments ?? [],
    }))
    submissions.value = [
      ...map(pcards.data ?? [], 'P-Card Request'),
      ...map(travels.data ?? [], 'Travel Request'),
      ...map(resources.data ?? [], 'Resource Checkout'),
    ]
  } catch (e) {
    console.error('Failed to load submissions:', e)
  } finally {
    submissionsLoading.value = false
  }
}

async function postComment() {
  if (!newComment.value.trim() || !selectedSubmission.value) return
  const comment = {
    id: Date.now(),
    author: userStore.firstName + ' ' + userStore.lastName,
    isAdmin: false,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    text: newComment.value.trim(),
  }
  try {
    await feathersClient.service('submission-comments').create({
      submission_id: selectedSubmission.value.id,
      form_type: selectedSubmission.value.formType,
      author: comment.author,
      text: comment.text,
    })
  } catch (e) {
    console.error('Failed to save comment:', e)
  }
  selectedSubmission.value.comments.push(comment)
  newComment.value = ''
}

function cellPropHandler({ item, column }: any) {
  if (item.memberRole === 'president' && column.title === 'Role') return { class: 'bg-error rounded px-2 py-1' }
  return null
}

const roleColors: Record<string, string> = {
  'president': 'purple-darken-3', 'vice_pres': 'cyan-darken-1',
  'treasurer': 'amber-darken-1', 'secretary': 'green-darken-3', 'Member': 'blue-grey'
}
</script>

<template>
  <v-app>
    <!-- Side Navigation -->
    <v-navigation-drawer expand-on-hover permanent rail width="260" app>
      <v-list nav>
        <v-list-item
          v-for="s in activeSections"
          :key="s.id"
          :value="s.id"
          @click="handleNavClick(s.id)"
          :active="selected === s.id"
          active-color="primary"
          :prepend-icon="s.icon"
          rounded="lg"
        >
          <v-list-item-title>{{ s.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar app color="primary" elevation="2">
      <v-toolbar-title>
        <span class="font-weight-bold">{{ clubStore.name }}</span>
        <span class="text-body-2 ml-2" style="opacity: 0.8;">— Club Management</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="pa-8" max-width="1200">

        <!-- ─── Dashboard ─── -->
        <div v-if="selected === 'dashboard'">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">Club Dashboard</h1>
              <p class="text-medium-emphasis mt-1">Welcome to your club's management page.</p>
            </div>
          </div>
          <v-row>
            <v-col v-for="s in activeSections.filter(s => s.id !== 'dashboard')" :key="s.id" cols="12" sm="6" md="4">
              <v-card rounded="lg" elevation="2" class="pa-5 cursor-pointer" @click="handleNavClick(s.id)" hover>
                <div class="d-flex align-center mb-3">
                  <v-avatar color="primary" variant="tonal" size="44" class="mr-3">
                    <v-icon :icon="s.icon" color="primary" />
                  </v-avatar>
                  <span class="text-body-1 font-weight-medium">{{ s.label }}</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ─── Create Event ─── -->
        <div v-if="selected === 'createEvent'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Create Event</h1>
            <p class="text-medium-emphasis mt-1">Schedule a new event for your club members.</p>
          </div>
          <club-events-page />
        </div>

        <!-- ─── Announcement ─── -->
        <div v-if="selected === 'createAnnouncement'">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">Create Announcement</h1>
              <p class="text-medium-emphasis mt-1">Publish a message to all club members.</p>
            </div>
          </div>
          <v-card elevation="2" rounded="lg">
            <v-card-text class="pa-6">
              <p class="text-overline text-primary mb-3">Announcement Details</p>
              <v-text-field v-model="announcementForm.title" label="Title" prepend-inner-icon="mdi-format-title" variant="outlined" class="mb-4" />
              <v-textarea v-model="announcementForm.message" label="Message" prepend-inner-icon="mdi-text-box" variant="outlined" rows="5" />
              <div class="d-flex justify-end mt-4">
                <v-btn color="primary" rounded="lg" prepend-icon="mdi-bullhorn" @click="submitAnnouncement">Publish</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- ─── Members ─── -->
        <div v-if="selected === 'members'">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">Members</h1>
              <p class="text-medium-emphasis mt-1">View and manage club members.</p>
            </div>
            <v-btn color="primary" rounded="lg" prepend-icon="mdi-account-plus" @click="selected = 'memberAdd'">Add Member</v-btn>
          </div>
          <v-card elevation="2" rounded="lg">
            <v-data-table
              :cell-props="cellPropHandler"
              :items="memberList"
              :headers="[{title:'First Name',key:'memberFName'},{title:'Last Name',key:'memberLName'},{title:'Role',key:'memberRole'},{title:'Email',key:'memberEmail'},{title:'Actions',key:'actions'}]"
            >
              <template #item.memberRole="{ item }">
                <v-chip :color="roleColors[item.memberRole] ?? 'grey'" size="small" variant="tonal">{{ item.memberRole }}</v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-btn icon="mdi-cog" size="small" variant="text" color="grey" @click="manageMember(item.membershipID)" />
              </template>
            </v-data-table>
          </v-card>
        </div>

        <!-- ─── Add Member ─── -->
        <div v-if="selected === 'memberAdd'">
          <div class="mb-6">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2 pl-0" @click="selected = 'members'">Back to Members</v-btn>
            <h1 class="text-h4 font-weight-bold">Add Member</h1>
            <p class="text-medium-emphasis mt-1">Invite a student to join your club.</p>
          </div>
          <v-card elevation="2" rounded="lg">
            <v-card-text class="pa-6">
              <p class="text-overline text-primary mb-3">Member Information</p>
              <v-form v-model="valid" @submit.prevent="addMember">
                <v-text-field v-model="email" :rules="emailRules" label="UNR Email Address" prepend-inner-icon="mdi-email-outline" variant="outlined" class="mb-4" required />

                <p class="text-overline text-primary mb-3">Assign Role</p>
                <div class="d-flex flex-wrap gap-2 mb-5">
                  <v-chip
                    v-for="r in ['president', 'vice_pres', 'treasurer', 'secretary', 'Member']"
                    :key="r"
                    :variant="role === r ? 'flat' : 'outlined'"
                    :color="role === r ? (roleColors[r] ?? 'primary') : 'default'"
                    class="cursor-pointer"
                    @click="role = r"
                  >{{ r }}</v-chip>
                </div>

                <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">{{ error }}</v-alert>

                <div class="d-flex justify-end">
                  <v-btn type="submit" color="primary" rounded="lg" :loading="loading" :disabled="!valid || role === 'Select Role'" prepend-icon="mdi-account-plus">
                    Add Member
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </div>

        <!-- ─── Finances ─── -->
        <div v-if="selected === 'finances'">
          <finances-page />
        </div>

        <!-- ─── Tasks View ─── -->
        <div v-if="selected === 'tasks'">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">Tasks</h1>
              <p class="text-medium-emphasis mt-1">Track outstanding tasks for your club.</p>
            </div>
            <v-btn size="small" variant="outlined" prepend-icon="mdi-refresh" @click="loadTasks">Refresh</v-btn>
          </div>
          <v-alert v-if="tasksError" type="error" variant="tonal" rounded="lg" class="mb-4">{{ tasksError }}</v-alert>
          <v-card elevation="2" rounded="lg">
            <v-data-table :items="tasks" :loading="tasksLoading" loading-text="Loading tasks..." :headers="[{title:'Title',key:'title'},{title:'Priority',key:'priority'},{title:'Status',key:'status'},{title:'Days Left',key:'daysUntilDue'}]" density="compact">
              <template #item.priority="{ item }">
                <v-chip :color="priorityColor[item.priority] ?? 'grey'" size="x-small" variant="tonal">{{ item.priority }}</v-chip>
              </template>
              <template #item.status="{ item }">
                <v-chip :color="statusColor[item.status] ?? 'grey'" size="x-small" variant="tonal">{{ item.status }}</v-chip>
              </template>
              <template #item.daysUntilDue="{ item }">
                <v-chip :color="item.daysUntilDue === 'overdue' ? 'red' : Number(item.daysUntilDue) <= 3 ? 'orange' : 'green'" size="x-small" variant="tonal">
                  {{ item.daysUntilDue === 'overdue' ? 'Overdue' : `${item.daysUntilDue}d` }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </div>

        <!-- ─── Create Task ─── -->
        <div v-if="selected === 'createTask'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Create Task</h1>
            <p class="text-medium-emphasis mt-1">Add a new task for your club to track.</p>
          </div>
          <v-card elevation="2" rounded="lg">
            <v-card-text class="pa-6">
              <v-alert v-if="taskFormSuccess" type="success" variant="tonal" rounded="lg" class="mb-4" closable @click:close="taskFormSuccess = false">Task created successfully!</v-alert>
              <v-alert v-if="taskFormError" type="error" variant="tonal" rounded="lg" class="mb-4">{{ taskFormError }}</v-alert>
              <v-form v-model="taskFormValid" @submit.prevent="submitTask">
                <p class="text-overline text-primary mb-3">Task Details</p>
                <v-text-field v-model="taskForm.title" label="Title" :rules="[v => !!v || 'Title is required']" prepend-inner-icon="mdi-format-title" variant="outlined" class="mb-3" required />
                <v-textarea v-model="taskForm.description" label="Description" prepend-inner-icon="mdi-text-box" variant="outlined" rows="3" class="mb-3" />
                <v-divider class="mb-4" />
                <p class="text-overline text-primary mb-3">Priority & Status</p>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-select v-model="taskForm.priority" :items="taskPriorities" label="Priority" prepend-inner-icon="mdi-flag-outline" variant="outlined" />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select v-model="taskForm.status" :items="taskStatuses" label="Status" prepend-inner-icon="mdi-list-status" variant="outlined" />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="taskForm.due_date" label="Due Date" type="date" prepend-inner-icon="mdi-calendar" variant="outlined" />
                  </v-col>
                </v-row>
                <div class="d-flex justify-end mt-2">
                  <v-btn type="submit" color="primary" rounded="lg" :loading="taskFormLoading" prepend-icon="mdi-plus">Create Task</v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </div>

        <!-- ─── Edit Tasks ─── -->
        <div v-if="selected === 'editTask'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Edit Tasks</h1>
            <p class="text-medium-emphasis mt-1">Select a task to update or delete it.</p>
          </div>
          <v-row>
            <v-col cols="12" md="5">
              <v-card elevation="2" rounded="lg" height="100%">
                <v-card-title class="px-6 pt-5 pb-2 text-h6">Select a Task</v-card-title>
                <v-card-text class="pa-0">
                  <v-alert v-if="tasksError" type="error" variant="tonal" class="ma-4">{{ tasksError }}</v-alert>
                  <v-list lines="two" nav>
                    <v-list-item
                      v-for="task in tasks" :key="task.id"
                      :title="task.title" :subtitle="task.status"
                      :active="selectedTask?.id === task.id"
                      active-color="primary" rounded="lg"
                      @click="selectTaskForEdit(task)"
                    >
                      <template #append>
                        <v-chip :color="priorityColor[task.priority] ?? 'grey'" size="x-small" variant="tonal" class="mr-2">{{ task.priority }}</v-chip>
                        <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click.stop="deleteTask(task.id)" />
                      </template>
                    </v-list-item>
                    <v-list-item v-if="tasks.length === 0 && !tasksLoading">
                      <v-list-item-title class="text-medium-emphasis">No tasks found for this club.</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <v-card elevation="2" rounded="lg" height="100%">
                <v-card-text class="pa-6">
                  <div v-if="!selectedTask" class="text-center py-10">
                    <v-icon size="48" color="grey-lighten-1">mdi-cursor-pointer</v-icon>
                    <p class="text-medium-emphasis mt-3">Select a task on the left to edit it.</p>
                  </div>
                  <div v-else>
                    <p class="text-h6 font-weight-bold mb-4">Editing: {{ selectedTask.title }}</p>
                    <v-alert v-if="editTaskSuccess" type="success" variant="tonal" rounded="lg" class="mb-4" closable @click:close="editTaskSuccess = ''">{{ editTaskSuccess }}</v-alert>
                    <v-alert v-if="editTaskError" type="error" variant="tonal" rounded="lg" class="mb-4">{{ editTaskError }}</v-alert>
                    <v-form v-model="editTaskValid" @submit.prevent="saveTaskEdit">
                      <v-text-field v-model="editTaskForm.title" label="Title" :rules="[v => !!v || 'Title is required']" prepend-inner-icon="mdi-format-title" variant="outlined" class="mb-3" required />
                      <v-textarea v-model="editTaskForm.description" label="Description" prepend-inner-icon="mdi-text-box" variant="outlined" rows="3" class="mb-3" />
                      <v-row>
                        <v-col cols="6">
                          <v-select v-model="editTaskForm.priority" :items="taskPriorities" label="Priority" prepend-inner-icon="mdi-flag-outline" variant="outlined" />
                        </v-col>
                        <v-col cols="6">
                          <v-select v-model="editTaskForm.status" :items="taskStatuses" label="Status" prepend-inner-icon="mdi-list-status" variant="outlined" />
                        </v-col>
                      </v-row>
                      <v-text-field v-model="editTaskForm.due_date" label="Due Date" type="date" prepend-inner-icon="mdi-calendar" variant="outlined" class="mb-4" />
                      <div class="d-flex justify-end">
                        <v-btn type="submit" color="primary" rounded="lg" :loading="editTaskLoading" prepend-icon="mdi-content-save">Save Changes</v-btn>
                      </div>
                    </v-form>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ─── Attendance ─── -->
        <div v-if="selected === 'attendance'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Attendance</h1>
            <p class="text-medium-emphasis mt-1">Track member attendance for club events.</p>
          </div>
          <attendance-page />
        </div>

        <!-- ─── Forms ─── -->
        <div v-if="selected === 'forms'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Club Forms</h1>
            <p class="text-medium-emphasis mt-1">Submit financial and travel request forms.</p>
          </div>
          <v-row>
            <v-col cols="12" sm="6">
              <v-card rounded="lg" elevation="2" class="pa-6 cursor-pointer" hover @click="selected = 'pcard'">
                <v-avatar color="primary" variant="tonal" size="52" class="mb-4">
                  <v-icon size="28" color="primary">mdi-credit-card-outline</v-icon>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold mb-1">P-Card Request</h3>
                <p class="text-medium-emphasis text-body-2">Submit a purchase card reimbursement or pre-approval request.</p>
                <v-btn class="mt-4" color="primary" variant="tonal" rounded="lg" prepend-icon="mdi-arrow-right" @click="selected = 'pcard'">Open Form</v-btn>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card rounded="lg" elevation="2" class="pa-6 cursor-pointer" hover @click="selected = 'travelreq'">
                <v-avatar color="primary" variant="tonal" size="52" class="mb-4">
                  <v-icon size="28" color="primary">mdi-airplane</v-icon>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold mb-1">Travel Request</h3>
                <p class="text-medium-emphasis text-body-2">Submit a travel request for club-related trips and events.</p>
                <v-btn class="mt-4" color="primary" variant="tonal" rounded="lg" prepend-icon="mdi-arrow-right" @click="selected = 'travelreq'">Open Form</v-btn>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card rounded="lg" elevation="2" class="pa-6 cursor-pointer" hover @click="selected = 'resourcecheckout'">
                <v-avatar color="primary" variant="tonal" size="52" class="mb-4">
                  <v-icon size="28" color="primary">mdi-package-variant-closed</v-icon>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold mb-1">Resource Checkout</h3>
                <p class="text-medium-emphasis text-body-2">Request ASUN club resources for your event.</p>
                <v-btn class="mt-4" color="primary" variant="tonal" rounded="lg" prepend-icon="mdi-arrow-right" @click="selected = 'resourcecheckout'">Open Form</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-if="selected === 'pcard'">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4 pl-0" @click="selected = 'forms'">Back to Forms</v-btn>
          <p-card-request />
        </div>

        <div v-if="selected === 'travelreq'">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4 pl-0" @click="selected = 'forms'">Back to Forms</v-btn>
          <travel-request />
        </div>

        <!-- ─── Resource Checkout ─── -->
        <div v-if="selected === 'resourcecheckout'">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4 pl-0" @click="selected = 'forms'">Back to Forms</v-btn>
          <resource-checkout />
        </div>

        <!-- ─── Form Submissions ─── -->
        <div v-if="selected === 'submissions'">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">Form Submissions</h1>
              <p class="text-medium-emphasis mt-1">Track the status of all submitted forms.</p>
            </div>
          </div>

          <v-row>
            <!-- Submissions List -->
            <v-col cols="12" md="7">
              <v-card elevation="2" rounded="lg">
                <v-card-title class="px-6 pt-5 pb-2 text-h6">Submissions</v-card-title>
                <v-card-text class="pa-0">
                  <div v-if="submissionsLoading" class="pa-6">
                    <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-two-line" class="mb-2" />
                  </div>
                  <div v-else-if="submissions.length === 0" class="text-center py-10">
                    <v-icon size="48" color="grey-lighten-1">mdi-file-document-outline</v-icon>
                    <p class="text-medium-emphasis mt-3">No submissions yet.</p>
                  </div>
                  <v-list v-else lines="two" nav class="pa-2">
                    <v-list-item
                      v-for="sub in submissions"
                      :key="sub.id"
                      :active="selectedSubmission?.id === sub.id"
                      active-color="primary"
                      rounded="lg"
                      class="mb-1"
                      @click="selectedSubmission = sub"
                    >
                      <template #prepend>
                        <v-avatar :color="sub.statusColor" variant="tonal" size="40">
                          <v-icon :icon="sub.icon" size="20" :color="sub.statusColor" />
                        </v-avatar>
                      </template>
                      <v-list-item-title class="font-weight-medium">{{ sub.formName }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip size="x-small" :color="sub.statusColor" variant="tonal" class="mr-2">{{ sub.status }}</v-chip>
                        <span class="text-caption">{{ sub.submittedDate }}</span>
                      </v-list-item-subtitle>
                      <template #append>
                        <v-icon size="16" color="grey">mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Submission Detail + Comments -->
            <v-col cols="12" md="5">
              <div v-if="!selectedSubmission" class="text-center py-16">
                <v-icon size="48" color="grey-lighten-1">mdi-cursor-pointer</v-icon>
                <p class="text-medium-emphasis mt-3">Select a submission to view details.</p>
              </div>

              <template v-else>
                <!-- Detail Card -->
                <v-card elevation="2" rounded="lg" class="mb-4">
                  <v-card-text class="pa-5">
                    <div class="d-flex align-center justify-space-between mb-4">
                      <h3 class="text-h6 font-weight-bold">{{ selectedSubmission.formName }}</h3>
                      <v-chip :color="selectedSubmission.statusColor" variant="tonal" size="small">{{ selectedSubmission.status }}</v-chip>
                    </div>

                    <p class="text-overline text-primary mb-2">Progress</p>
                    <v-progress-linear
                      :model-value="selectedSubmission.progress"
                      :color="selectedSubmission.statusColor"
                      rounded height="8" class="mb-1"
                    />
                    <p class="text-caption text-medium-emphasis mb-4">{{ selectedSubmission.progress }}% complete</p>

                    <v-divider class="mb-3" />
                    <p class="text-overline text-primary mb-2">Details</p>
                    <div class="d-flex align-center ga-2 mb-2">
                      <v-icon size="16" color="grey">mdi-calendar</v-icon>
                      <span class="text-body-2">Submitted: {{ selectedSubmission.submittedDate }}</span>
                    </div>
                    <div class="d-flex align-center ga-2 mb-2">
                      <v-icon size="16" color="grey">mdi-update</v-icon>
                      <span class="text-body-2">Last updated: {{ selectedSubmission.lastUpdated }}</span>
                    </div>
                    <div class="d-flex align-center ga-2">
                      <v-icon size="16" color="grey">mdi-file-outline</v-icon>
                      <span class="text-body-2">Form type: {{ selectedSubmission.formType }}</span>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- Comments Card -->
                <v-card elevation="2" rounded="lg">
                  <v-card-title class="px-5 pt-4 pb-2 text-body-1 font-weight-bold">
                    <v-icon start color="primary" size="18">mdi-comment-multiple-outline</v-icon>
                    Discussion
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <!-- Existing comments -->
                    <div v-if="selectedSubmission.comments.length === 0" class="text-center py-4">
                      <p class="text-caption text-medium-emphasis">No comments yet. Be the first to leave one.</p>
                    </div>
                    <div v-else class="mb-4">
                      <div
                        v-for="comment in selectedSubmission.comments"
                        :key="comment.id"
                        class="d-flex ga-3 mb-4"
                      >
                        <v-avatar :color="comment.isAdmin ? 'warning' : 'primary'" size="32" variant="tonal">
                          <span class="text-caption font-weight-bold">{{ comment.author[0] }}</span>
                        </v-avatar>
                        <div class="flex-grow-1">
                          <div class="d-flex align-center ga-2 mb-1">
                            <span class="text-body-2 font-weight-bold">{{ comment.author }}</span>
                            <v-chip v-if="comment.isAdmin" size="x-small" color="warning" variant="tonal">Staff</v-chip>
                            <span class="text-caption text-medium-emphasis">{{ comment.date }}</span>
                          </div>
                          <v-card variant="tonal" :color="comment.isAdmin ? 'warning' : 'primary'" rounded="lg" class="pa-3">
                            <p class="text-body-2 ma-0">{{ comment.text }}</p>
                          </v-card>
                        </div>
                      </div>
                    </div>

                    <!-- New comment input -->
                    <v-divider class="mb-3" />
                    <div class="d-flex ga-2 align-start">
                      <v-avatar color="primary" size="32" variant="tonal">
                        <span class="text-caption font-weight-bold">D</span>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <v-textarea
                          v-model="newComment"
                          placeholder="Write a message..."
                          variant="outlined"
                          density="compact"
                          rows="2"
                          hide-details
                          class="mb-2"
                        />
                        <div class="d-flex justify-end ga-2">
                          <v-btn size="small" variant="text" color="grey" @click="newComment = ''">Cancel</v-btn>
                          <v-btn size="small" color="primary" rounded="lg" :disabled="!newComment.trim()" @click="postComment">Post</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </template>
            </v-col>
          </v-row>
        </div>

        <!-- ─── Settings ─── -->
        <div v-if="selected === 'settings'">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Settings</h1>
            <p class="text-medium-emphasis mt-1">Manage club settings, roles, and integrations.</p>
          </div>
          <v-card elevation="2" rounded="lg" class="pa-6">
            <p class="text-medium-emphasis">Settings panel coming soon.</p>
          </v-card>
        </div>

      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
</style>

<style scoped>
.club-logo {
    max-width: 200px;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
} 
</style>