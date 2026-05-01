import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import useClubStore from './stores/clubStore';
import { feathersClient } from './backendAPI';
import useMemberStore from './stores/memberStore';
import useUserStore from './stores/user';
import ClubEventsPage from './clubEventsPage.vue';
import financesPage from './financesPage.vue';
import pCardRequest from './pCardRequest.vue';
import travelRequest from './travelRequest.vue';
import attendancePage from './attendancePage.vue';
import resourceCheckout from './resourceCheckouts.vue';
const auth = useAuthStore();
const clubStore = useClubStore();
const memberStore = useMemberStore();
const userStore = useUserStore();
const USERROLE = '';
const role = ref('Select Role');
const email = ref('');
const error = ref('');
const loading = ref(false);
const valid = ref(false);
const memberList = [];
const logoUrl = `http://localhost:42063${clubStore.logo_url}`;
async function setPermissions() {
    console.log(logoUrl);
    const res = await (feathersClient.service("ClubMembership").find({
        query: {
            $select: ['role', 'id'],
            userid: userStore.id,
            clubid: clubStore.id
        }
    })).catch(err => {
        console.log('SERVER THREW ERROR RETRIEVING MEMBERSHIP ENTRY: ', err);
    });
    if (res) {
        const memberInfo = res.data;
        console.log('CURRENT MEMBERINFO: ', memberInfo[0].role, ' ', memberInfo[0].id);
        memberStore.setRole(memberInfo[0].role);
        memberStore.setId(memberInfo[0].id);
    }
    const memberRes = await (feathersClient.service("ClubMembership").find({
        query: {
            clubid: clubStore.id,
            $sort: {
                userid: -1
            }
        }
    })).catch(err => {
        error.value = err;
        console.log(error);
    });
    const userIds = [];
    if (memberRes) {
        console.log(memberRes);
        const memberArray = memberRes.data;
        for (const member of memberArray) {
            userIds.push(member.userid);
        }
        console.log('USER IDS: ', userIds);
        const usersRes = await (feathersClient.service("User").find({
            query: {
                $sort: {
                    id: -1
                },
                id: {
                    $in: userIds
                }
            }
        })).catch(err => {
            error.value = err;
            console.log(error);
        });
        if (usersRes) {
            const userData = usersRes.data;
            for (let i = 0; i < userData.length; i++) {
                memberList.push({
                    memberFName: userData[i].first_name, memberLName: userData[i].last_name,
                    memberEmail: userData[i].email, membershipID: memberArray[i].id, memberRole: memberArray[i].role
                });
            }
        }
    }
}
const emailRules = [
    (v) => !!v || 'E-mail is required.',
    (v) => /^[a-z0-9._%+-]+@unr\.edu$/i.test(v) || 'Must be a valid UNR email (@unr.edu).',
];
onMounted(setPermissions);
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
];
const activeSections = computed(() => sections.filter(item => item.roles.includes(memberStore.role)));
const selected = ref('dashboard');
const announcementForm = reactive({ title: '', message: '' });
function submitAnnouncement() {
    console.log('Create Announcement', { ...announcementForm });
    Object.assign(announcementForm, { title: '', message: '' });
}
// Tasks
const taskForm = reactive({ title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' });
const taskFormValid = ref(false);
const taskFormLoading = ref(false);
const taskFormError = ref('');
const taskFormSuccess = ref(false);
const taskPriorities = ['Low', 'Medium', 'High'];
const taskStatuses = ['Not Started', 'In Progress', 'Complete'];
const tasks = ref([]);
const tasksLoading = ref(false);
const tasksError = ref(null);
const priorityColor = { Low: 'green', Medium: 'blue', High: 'orange' };
const statusColor = { 'Not Started': 'grey', 'In Progress': 'blue', 'Complete': 'green' };
async function submitTask() {
    if (!taskFormValid.value)
        return;
    taskFormLoading.value = true;
    taskFormError.value = '';
    taskFormSuccess.value = false;
    try {
        const now = new Date().toISOString();
        await feathersClient.service('Task').create({
            club: String(clubStore.id), title: taskForm.title, due_date: taskForm.due_date,
            description: taskForm.description, created_at: now, updated_at: now,
            priority: taskForm.priority, status: taskForm.status,
        });
        taskFormSuccess.value = true;
        Object.assign(taskForm, { title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' });
    }
    catch (err) {
        taskFormError.value = 'Failed to create task. Please try again.';
    }
    finally {
        taskFormLoading.value = false;
    }
}
async function loadTasks() {
    tasksLoading.value = true;
    tasksError.value = null;
    try {
        const res = await feathersClient.service('Task').find({ query: { club: String(clubStore.id) } });
        const now = new Date();
        tasks.value = res.data.map((task) => {
            const due = new Date(task.due_date);
            const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return { ...task, daysUntilDue: diffDays < 0 ? 'overdue' : diffDays };
        });
    }
    catch (err) {
        tasksError.value = 'Failed to load tasks.';
    }
    finally {
        tasksLoading.value = false;
    }
}
function handleNavClick(sectionId) {
    selected.value = sectionId;
    if (sectionId === 'tasks' || sectionId === 'editTask')
        loadTasks();
    if (sectionId === 'submissions')
        loadSubmissions();
}
// Edit task
const editTaskForm = reactive({ id: null, title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' });
const editTaskValid = ref(false);
const editTaskLoading = ref(false);
const editTaskError = ref('');
const editTaskSuccess = ref('');
const selectedTask = ref(null);
function selectTaskForEdit(task) {
    selectedTask.value = task;
    Object.assign(editTaskForm, { id: task.id, title: task.title, description: task.description, priority: task.priority, status: task.status, due_date: task.due_date });
    editTaskError.value = '';
    editTaskSuccess.value = '';
}
async function saveTaskEdit() {
    if (!editTaskValid.value || !editTaskForm.id)
        return;
    editTaskLoading.value = true;
    editTaskError.value = '';
    editTaskSuccess.value = '';
    try {
        await feathersClient.service('Task').patch(editTaskForm.id, {
            title: editTaskForm.title, description: editTaskForm.description,
            priority: editTaskForm.priority, status: editTaskForm.status,
            due_date: editTaskForm.due_date, updated_at: new Date().toISOString(),
        });
        editTaskSuccess.value = 'Task updated successfully!';
        await loadTasks();
    }
    catch (err) {
        editTaskError.value = 'Failed to update task. Please try again.';
    }
    finally {
        editTaskLoading.value = false;
    }
}
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?'))
        return;
    try {
        await feathersClient.service('Task').remove(id);
        if (selectedTask.value?.id === id) {
            selectedTask.value = null;
            Object.assign(editTaskForm, { id: null, title: '', description: '', priority: 'Medium', status: 'Not Started', due_date: '' });
        }
        await loadTasks();
    }
    catch (err) {
        editTaskError.value = 'Failed to delete task.';
    }
}
async function addMember() {
    if (!valid.value)
        return;
    error.value = '';
    loading.value = true;
    if (role.value !== 'Member') {
        const res = await feathersClient.service('ClubMembership').find({ query: { clubid: clubStore.id, role: role.value } });
        if (res.data.length >= 1) {
            error.value = 'Role is already taken in this organization!';
            loading.value = false;
            return;
        }
    }
    for (const member of memberList) {
        if (member.memberEmail === email.value) {
            error.value = 'User is already a member!';
            loading.value = false;
            return;
        }
    }
    const res = await feathersClient.service('User').find({ query: { $select: ['id', 'email'], email: email.value } });
    if (res.data.length === 1) {
        await feathersClient.service('ClubMembership')._create({
            clubid: clubStore.id, userid: res.data[0].id, role: role.value, is_active: true, dues_paid: false,
        });
        selected.value = 'members';
    }
    else {
        error.value = 'User does not exist in the system.';
    }
    loading.value = false;
}
function manageMember(id) { console.log('MANAGING MEMBER WITH MEMBERSHIP ID:', id); }
// ── Form Submissions ──
const selectedSubmission = ref(null);
const newComment = ref('');
const submissions = ref([]);
const submissionsLoading = ref(false);
const formTypeMap = {
    'P-Card Request': { icon: 'mdi-credit-card-outline', color: 'warning' },
    'Travel Request': { icon: 'mdi-airplane', color: 'success' },
    'Resource Checkout': { icon: 'mdi-package-variant-closed', color: 'primary' },
};
async function loadSubmissions() {
    submissionsLoading.value = true;
    try {
        const [pcards, travels, resources] = await Promise.all([
            feathersClient.service('p-card-requests').find({ query: { club: clubStore.id, $sort: { created_at: -1 } } }),
            feathersClient.service('travel-requests').find({ query: { club: clubStore.id, $sort: { created_at: -1 } } }),
            feathersClient.service('resource-checkouts').find({ query: { club: clubStore.id, $sort: { created_at: -1 } } }),
        ]);
        const map = (arr, type) => arr.map((r) => ({
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
        }));
        submissions.value = [
            ...map(pcards.data ?? [], 'P-Card Request'),
            ...map(travels.data ?? [], 'Travel Request'),
            ...map(resources.data ?? [], 'Resource Checkout'),
        ];
    }
    catch (e) {
        console.error('Failed to load submissions:', e);
    }
    finally {
        submissionsLoading.value = false;
    }
}
async function postComment() {
    if (!newComment.value.trim() || !selectedSubmission.value)
        return;
    const comment = {
        id: Date.now(),
        author: userStore.firstName + ' ' + userStore.lastName,
        isAdmin: false,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: newComment.value.trim(),
    };
    try {
        await feathersClient.service('submission-comments').create({
            submission_id: selectedSubmission.value.id,
            form_type: selectedSubmission.value.formType,
            author: comment.author,
            text: comment.text,
        });
    }
    catch (e) {
        console.error('Failed to save comment:', e);
    }
    selectedSubmission.value.comments.push(comment);
    newComment.value = '';
}
function cellPropHandler({ item, column }) {
    if (item.memberRole === 'president' && column.title === 'Role')
        return { class: 'bg-error rounded px-2 py-1' };
    return null;
}
const roleColors = {
    'president': 'purple-darken-3', 'vice_pres': 'cyan-darken-1',
    'treasurer': 'amber-darken-1', 'secretary': 'green-darken-3', 'Member': 'blue-grey'
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VApp;
/** @type {[typeof __VLS_components.VApp, typeof __VLS_components.vApp, typeof __VLS_components.VApp, typeof __VLS_components.vApp, ]} */ ;
// @ts-ignore
VApp;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = {}.VNavigationDrawer;
/** @type {[typeof __VLS_components.VNavigationDrawer, typeof __VLS_components.vNavigationDrawer, typeof __VLS_components.VNavigationDrawer, typeof __VLS_components.vNavigationDrawer, ]} */ ;
// @ts-ignore
VNavigationDrawer;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    expandOnHover: true,
    permanent: true,
    rail: true,
    width: "260",
    app: true,
}));
const __VLS_8 = __VLS_7({
    expandOnHover: true,
    permanent: true,
    rail: true,
    width: "260",
    app: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
const __VLS_11 = {}.VList;
/** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
// @ts-ignore
VList;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    nav: true,
}));
const __VLS_13 = __VLS_12({
    nav: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.activeSections))) {
    // @ts-ignore
    [activeSections,];
    const __VLS_16 = {}.VListItem;
    /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
    // @ts-ignore
    VListItem;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        key: (s.id),
        value: (s.id),
        active: (__VLS_ctx.selected === s.id),
        activeColor: "primary",
        prependIcon: (s.icon),
        rounded: "lg",
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        key: (s.id),
        value: (s.id),
        active: (__VLS_ctx.selected === s.id),
        activeColor: "primary",
        prependIcon: (s.icon),
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    const __VLS_22 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.handleNavClick(s.id);
                // @ts-ignore
                [selected, handleNavClick,];
            } });
    const { default: __VLS_23 } = __VLS_19.slots;
    const __VLS_24 = {}.VListItemTitle;
    /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
    // @ts-ignore
    VListItemTitle;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_28 } = __VLS_27.slots;
    (s.label);
    var __VLS_27;
    var __VLS_19;
}
var __VLS_14;
var __VLS_9;
const __VLS_29 = {}.VAppBar;
/** @type {[typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, ]} */ ;
// @ts-ignore
VAppBar;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    app: true,
    color: "primary",
    elevation: "2",
}));
const __VLS_31 = __VLS_30({
    app: true,
    color: "primary",
    elevation: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_33 } = __VLS_32.slots;
const __VLS_34 = {}.VToolbarTitle;
/** @type {[typeof __VLS_components.VToolbarTitle, typeof __VLS_components.vToolbarTitle, typeof __VLS_components.VToolbarTitle, typeof __VLS_components.vToolbarTitle, ]} */ ;
// @ts-ignore
VToolbarTitle;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({}));
const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_38 } = __VLS_37.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "font-weight-bold" },
});
(__VLS_ctx.clubStore.name);
// @ts-ignore
[clubStore,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-body-2 ml-2" },
    ...{ style: {} },
});
var __VLS_37;
var __VLS_32;
const __VLS_39 = {}.VMain;
/** @type {[typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ]} */ ;
// @ts-ignore
VMain;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_43 } = __VLS_42.slots;
const __VLS_44 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
VContainer;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ class: "pa-8" },
    maxWidth: "1200",
}));
const __VLS_46 = __VLS_45({
    ...{ class: "pa-8" },
    maxWidth: "1200",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_48 } = __VLS_47.slots;
if (__VLS_ctx.selected === 'dashboard') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center justify-space-between mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_49 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_53 } = __VLS_52.slots;
    for (const [s] of __VLS_getVForSourceType((__VLS_ctx.activeSections.filter(s => s.id !== 'dashboard')))) {
        // @ts-ignore
        [activeSections,];
        const __VLS_54 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
            key: (s.id),
            cols: "12",
            sm: "6",
            md: "4",
        }));
        const __VLS_56 = __VLS_55({
            key: (s.id),
            cols: "12",
            sm: "6",
            md: "4",
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        const { default: __VLS_58 } = __VLS_57.slots;
        const __VLS_59 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        VCard;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
            ...{ 'onClick': {} },
            rounded: "lg",
            elevation: "2",
            ...{ class: "pa-5 cursor-pointer" },
            hover: true,
        }));
        const __VLS_61 = __VLS_60({
            ...{ 'onClick': {} },
            rounded: "lg",
            elevation: "2",
            ...{ class: "pa-5 cursor-pointer" },
            hover: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        let __VLS_63;
        let __VLS_64;
        const __VLS_65 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selected === 'dashboard'))
                        return;
                    __VLS_ctx.handleNavClick(s.id);
                    // @ts-ignore
                    [handleNavClick,];
                } });
        const { default: __VLS_66 } = __VLS_62.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex align-center mb-3" },
        });
        const __VLS_67 = {}.VAvatar;
        /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
        // @ts-ignore
        VAvatar;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
            color: "primary",
            variant: "tonal",
            size: "44",
            ...{ class: "mr-3" },
        }));
        const __VLS_69 = __VLS_68({
            color: "primary",
            variant: "tonal",
            size: "44",
            ...{ class: "mr-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        const { default: __VLS_71 } = __VLS_70.slots;
        const __VLS_72 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            icon: (s.icon),
            color: "primary",
        }));
        const __VLS_74 = __VLS_73({
            icon: (s.icon),
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        var __VLS_70;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-body-1 font-weight-medium" },
        });
        (s.label);
        var __VLS_62;
        var __VLS_57;
    }
    var __VLS_52;
}
if (__VLS_ctx.selected === 'createEvent') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    /** @type {[typeof ClubEventsPage, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(ClubEventsPage, new ClubEventsPage({}));
    const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
}
if (__VLS_ctx.selected === 'createAnnouncement') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center justify-space-between mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_81 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_83 = __VLS_82({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    const { default: __VLS_85 } = __VLS_84.slots;
    const __VLS_86 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        ...{ class: "pa-6" },
    }));
    const __VLS_88 = __VLS_87({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_90 } = __VLS_89.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_91 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        modelValue: (__VLS_ctx.announcementForm.title),
        label: "Title",
        prependInnerIcon: "mdi-format-title",
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_93 = __VLS_92({
        modelValue: (__VLS_ctx.announcementForm.title),
        label: "Title",
        prependInnerIcon: "mdi-format-title",
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [announcementForm,];
    const __VLS_96 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        modelValue: (__VLS_ctx.announcementForm.message),
        label: "Message",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "5",
    }));
    const __VLS_98 = __VLS_97({
        modelValue: (__VLS_ctx.announcementForm.message),
        label: "Message",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    // @ts-ignore
    [announcementForm,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-end mt-4" },
    });
    const __VLS_101 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        color: "primary",
        rounded: "lg",
        prependIcon: "mdi-bullhorn",
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        color: "primary",
        rounded: "lg",
        prependIcon: "mdi-bullhorn",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = ({ click: {} },
        { onClick: (__VLS_ctx.submitAnnouncement) });
    const { default: __VLS_108 } = __VLS_104.slots;
    // @ts-ignore
    [submitAnnouncement,];
    var __VLS_104;
    var __VLS_89;
    var __VLS_84;
}
if (__VLS_ctx.selected === 'members') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center justify-space-between mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_109 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ 'onClick': {} },
        color: "primary",
        rounded: "lg",
        prependIcon: "mdi-account-plus",
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onClick': {} },
        color: "primary",
        rounded: "lg",
        prependIcon: "mdi-account-plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'members'))
                    return;
                __VLS_ctx.selected = 'memberAdd';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_116 } = __VLS_112.slots;
    var __VLS_112;
    const __VLS_117 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_119 = __VLS_118({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    const { default: __VLS_121 } = __VLS_120.slots;
    const __VLS_122 = {}.VDataTable;
    /** @type {[typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, ]} */ ;
    // @ts-ignore
    VDataTable;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        cellProps: (__VLS_ctx.cellPropHandler),
        items: (__VLS_ctx.memberList),
        headers: ([{ title: 'First Name', key: 'memberFName' }, { title: 'Last Name', key: 'memberLName' }, { title: 'Role', key: 'memberRole' }, { title: 'Email', key: 'memberEmail' }, { title: 'Actions', key: 'actions' }]),
    }));
    const __VLS_124 = __VLS_123({
        cellProps: (__VLS_ctx.cellPropHandler),
        items: (__VLS_ctx.memberList),
        headers: ([{ title: 'First Name', key: 'memberFName' }, { title: 'Last Name', key: 'memberLName' }, { title: 'Role', key: 'memberRole' }, { title: 'Email', key: 'memberEmail' }, { title: 'Actions', key: 'actions' }]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    const { default: __VLS_126 } = __VLS_125.slots;
    // @ts-ignore
    [cellPropHandler, memberList,];
    {
        const { 'item.memberRole': __VLS_127 } = __VLS_125.slots;
        const [{ item }] = __VLS_getSlotParameters(__VLS_127);
        const __VLS_128 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            color: (__VLS_ctx.roleColors[item.memberRole] ?? 'grey'),
            size: "small",
            variant: "tonal",
        }));
        const __VLS_130 = __VLS_129({
            color: (__VLS_ctx.roleColors[item.memberRole] ?? 'grey'),
            size: "small",
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        const { default: __VLS_132 } = __VLS_131.slots;
        // @ts-ignore
        [roleColors,];
        (item.memberRole);
        var __VLS_131;
    }
    {
        const { 'item.actions': __VLS_133 } = __VLS_125.slots;
        const [{ item }] = __VLS_getSlotParameters(__VLS_133);
        const __VLS_134 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
            ...{ 'onClick': {} },
            icon: "mdi-cog",
            size: "small",
            variant: "text",
            color: "grey",
        }));
        const __VLS_136 = __VLS_135({
            ...{ 'onClick': {} },
            icon: "mdi-cog",
            size: "small",
            variant: "text",
            color: "grey",
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        let __VLS_138;
        let __VLS_139;
        const __VLS_140 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selected === 'members'))
                        return;
                    __VLS_ctx.manageMember(item.membershipID);
                    // @ts-ignore
                    [manageMember,];
                } });
        var __VLS_137;
    }
    var __VLS_125;
    var __VLS_120;
}
if (__VLS_ctx.selected === 'memberAdd') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    const __VLS_142 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-2 pl-0" },
    }));
    const __VLS_144 = __VLS_143({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-2 pl-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    let __VLS_146;
    let __VLS_147;
    const __VLS_148 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'memberAdd'))
                    return;
                __VLS_ctx.selected = 'members';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_149 } = __VLS_145.slots;
    var __VLS_145;
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_150 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_152 = __VLS_151({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    const { default: __VLS_154 } = __VLS_153.slots;
    const __VLS_155 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
        ...{ class: "pa-6" },
    }));
    const __VLS_157 = __VLS_156({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    const { default: __VLS_159 } = __VLS_158.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_160 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onSubmit': {} },
        modelValue: (__VLS_ctx.valid),
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onSubmit': {} },
        modelValue: (__VLS_ctx.valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    const __VLS_166 = ({ submit: {} },
        { onSubmit: (__VLS_ctx.addMember) });
    const { default: __VLS_167 } = __VLS_163.slots;
    // @ts-ignore
    [valid, addMember,];
    const __VLS_168 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        modelValue: (__VLS_ctx.email),
        rules: (__VLS_ctx.emailRules),
        label: "UNR Email Address",
        prependInnerIcon: "mdi-email-outline",
        variant: "outlined",
        ...{ class: "mb-4" },
        required: true,
    }));
    const __VLS_170 = __VLS_169({
        modelValue: (__VLS_ctx.email),
        rules: (__VLS_ctx.emailRules),
        label: "UNR Email Address",
        prependInnerIcon: "mdi-email-outline",
        variant: "outlined",
        ...{ class: "mb-4" },
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    // @ts-ignore
    [email, emailRules,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex flex-wrap gap-2 mb-5" },
    });
    for (const [r] of __VLS_getVForSourceType((['president', 'vice_pres', 'treasurer', 'secretary', 'Member']))) {
        const __VLS_173 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
            ...{ 'onClick': {} },
            key: (r),
            variant: (__VLS_ctx.role === r ? 'flat' : 'outlined'),
            color: (__VLS_ctx.role === r ? (__VLS_ctx.roleColors[r] ?? 'primary') : 'default'),
            ...{ class: "cursor-pointer" },
        }));
        const __VLS_175 = __VLS_174({
            ...{ 'onClick': {} },
            key: (r),
            variant: (__VLS_ctx.role === r ? 'flat' : 'outlined'),
            color: (__VLS_ctx.role === r ? (__VLS_ctx.roleColors[r] ?? 'primary') : 'default'),
            ...{ class: "cursor-pointer" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        let __VLS_177;
        let __VLS_178;
        const __VLS_179 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selected === 'memberAdd'))
                        return;
                    __VLS_ctx.role = r;
                    // @ts-ignore
                    [roleColors, role, role, role,];
                } });
        const { default: __VLS_180 } = __VLS_176.slots;
        (r);
        var __VLS_176;
    }
    if (__VLS_ctx.error) {
        // @ts-ignore
        [error,];
        const __VLS_181 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }));
        const __VLS_183 = __VLS_182({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_182));
        const { default: __VLS_185 } = __VLS_184.slots;
        (__VLS_ctx.error);
        // @ts-ignore
        [error,];
        var __VLS_184;
    }
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-end" },
    });
    const __VLS_186 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
        type: "submit",
        color: "primary",
        rounded: "lg",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.valid || __VLS_ctx.role === 'Select Role'),
        prependIcon: "mdi-account-plus",
    }));
    const __VLS_188 = __VLS_187({
        type: "submit",
        color: "primary",
        rounded: "lg",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.valid || __VLS_ctx.role === 'Select Role'),
        prependIcon: "mdi-account-plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    const { default: __VLS_190 } = __VLS_189.slots;
    // @ts-ignore
    [valid, role, loading,];
    var __VLS_189;
    var __VLS_163;
    var __VLS_158;
    var __VLS_153;
}
if (__VLS_ctx.selected === 'finances') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    /** @type {[typeof financesPage, ]} */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(financesPage, new financesPage({}));
    const __VLS_192 = __VLS_191({}, ...__VLS_functionalComponentArgsRest(__VLS_191));
}
if (__VLS_ctx.selected === 'tasks') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center justify-space-between mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_195 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
        ...{ 'onClick': {} },
        size: "small",
        variant: "outlined",
        prependIcon: "mdi-refresh",
    }));
    const __VLS_197 = __VLS_196({
        ...{ 'onClick': {} },
        size: "small",
        variant: "outlined",
        prependIcon: "mdi-refresh",
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    let __VLS_199;
    let __VLS_200;
    const __VLS_201 = ({ click: {} },
        { onClick: (__VLS_ctx.loadTasks) });
    const { default: __VLS_202 } = __VLS_198.slots;
    // @ts-ignore
    [loadTasks,];
    var __VLS_198;
    if (__VLS_ctx.tasksError) {
        // @ts-ignore
        [tasksError,];
        const __VLS_203 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }));
        const __VLS_205 = __VLS_204({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_204));
        const { default: __VLS_207 } = __VLS_206.slots;
        (__VLS_ctx.tasksError);
        // @ts-ignore
        [tasksError,];
        var __VLS_206;
    }
    const __VLS_208 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_210 = __VLS_209({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    const { default: __VLS_212 } = __VLS_211.slots;
    const __VLS_213 = {}.VDataTable;
    /** @type {[typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, ]} */ ;
    // @ts-ignore
    VDataTable;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
        items: (__VLS_ctx.tasks),
        loading: (__VLS_ctx.tasksLoading),
        loadingText: "Loading tasks...",
        headers: ([{ title: 'Title', key: 'title' }, { title: 'Priority', key: 'priority' }, { title: 'Status', key: 'status' }, { title: 'Days Left', key: 'daysUntilDue' }]),
        density: "compact",
    }));
    const __VLS_215 = __VLS_214({
        items: (__VLS_ctx.tasks),
        loading: (__VLS_ctx.tasksLoading),
        loadingText: "Loading tasks...",
        headers: ([{ title: 'Title', key: 'title' }, { title: 'Priority', key: 'priority' }, { title: 'Status', key: 'status' }, { title: 'Days Left', key: 'daysUntilDue' }]),
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    const { default: __VLS_217 } = __VLS_216.slots;
    // @ts-ignore
    [tasks, tasksLoading,];
    {
        const { 'item.priority': __VLS_218 } = __VLS_216.slots;
        const [{ item }] = __VLS_getSlotParameters(__VLS_218);
        const __VLS_219 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
            color: (__VLS_ctx.priorityColor[item.priority] ?? 'grey'),
            size: "x-small",
            variant: "tonal",
        }));
        const __VLS_221 = __VLS_220({
            color: (__VLS_ctx.priorityColor[item.priority] ?? 'grey'),
            size: "x-small",
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_220));
        const { default: __VLS_223 } = __VLS_222.slots;
        // @ts-ignore
        [priorityColor,];
        (item.priority);
        var __VLS_222;
    }
    {
        const { 'item.status': __VLS_224 } = __VLS_216.slots;
        const [{ item }] = __VLS_getSlotParameters(__VLS_224);
        const __VLS_225 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
            color: (__VLS_ctx.statusColor[item.status] ?? 'grey'),
            size: "x-small",
            variant: "tonal",
        }));
        const __VLS_227 = __VLS_226({
            color: (__VLS_ctx.statusColor[item.status] ?? 'grey'),
            size: "x-small",
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        const { default: __VLS_229 } = __VLS_228.slots;
        // @ts-ignore
        [statusColor,];
        (item.status);
        var __VLS_228;
    }
    {
        const { 'item.daysUntilDue': __VLS_230 } = __VLS_216.slots;
        const [{ item }] = __VLS_getSlotParameters(__VLS_230);
        const __VLS_231 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
            color: (item.daysUntilDue === 'overdue' ? 'red' : Number(item.daysUntilDue) <= 3 ? 'orange' : 'green'),
            size: "x-small",
            variant: "tonal",
        }));
        const __VLS_233 = __VLS_232({
            color: (item.daysUntilDue === 'overdue' ? 'red' : Number(item.daysUntilDue) <= 3 ? 'orange' : 'green'),
            size: "x-small",
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_232));
        const { default: __VLS_235 } = __VLS_234.slots;
        (item.daysUntilDue === 'overdue' ? 'Overdue' : `${item.daysUntilDue}d`);
        var __VLS_234;
    }
    var __VLS_216;
    var __VLS_211;
}
if (__VLS_ctx.selected === 'createTask') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_236 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_238 = __VLS_237({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    const { default: __VLS_240 } = __VLS_239.slots;
    const __VLS_241 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        ...{ class: "pa-6" },
    }));
    const __VLS_243 = __VLS_242({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    const { default: __VLS_245 } = __VLS_244.slots;
    if (__VLS_ctx.taskFormSuccess) {
        // @ts-ignore
        [taskFormSuccess,];
        const __VLS_246 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
            ...{ 'onClick:close': {} },
            type: "success",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
            closable: true,
        }));
        const __VLS_248 = __VLS_247({
            ...{ 'onClick:close': {} },
            type: "success",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_247));
        let __VLS_250;
        let __VLS_251;
        const __VLS_252 = ({ 'click:close': {} },
            { 'onClick:close': (...[$event]) => {
                    if (!(__VLS_ctx.selected === 'createTask'))
                        return;
                    if (!(__VLS_ctx.taskFormSuccess))
                        return;
                    __VLS_ctx.taskFormSuccess = false;
                    // @ts-ignore
                    [taskFormSuccess,];
                } });
        const { default: __VLS_253 } = __VLS_249.slots;
        var __VLS_249;
    }
    if (__VLS_ctx.taskFormError) {
        // @ts-ignore
        [taskFormError,];
        const __VLS_254 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }));
        const __VLS_256 = __VLS_255({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_255));
        const { default: __VLS_258 } = __VLS_257.slots;
        (__VLS_ctx.taskFormError);
        // @ts-ignore
        [taskFormError,];
        var __VLS_257;
    }
    const __VLS_259 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
        ...{ 'onSubmit': {} },
        modelValue: (__VLS_ctx.taskFormValid),
    }));
    const __VLS_261 = __VLS_260({
        ...{ 'onSubmit': {} },
        modelValue: (__VLS_ctx.taskFormValid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    let __VLS_263;
    let __VLS_264;
    const __VLS_265 = ({ submit: {} },
        { onSubmit: (__VLS_ctx.submitTask) });
    const { default: __VLS_266 } = __VLS_262.slots;
    // @ts-ignore
    [taskFormValid, submitTask,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_267 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
        modelValue: (__VLS_ctx.taskForm.title),
        label: "Title",
        rules: ([v => !!v || 'Title is required']),
        prependInnerIcon: "mdi-format-title",
        variant: "outlined",
        ...{ class: "mb-3" },
        required: true,
    }));
    const __VLS_269 = __VLS_268({
        modelValue: (__VLS_ctx.taskForm.title),
        label: "Title",
        rules: ([v => !!v || 'Title is required']),
        prependInnerIcon: "mdi-format-title",
        variant: "outlined",
        ...{ class: "mb-3" },
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    // @ts-ignore
    [taskForm,];
    const __VLS_272 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        modelValue: (__VLS_ctx.taskForm.description),
        label: "Description",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "3",
        ...{ class: "mb-3" },
    }));
    const __VLS_274 = __VLS_273({
        modelValue: (__VLS_ctx.taskForm.description),
        label: "Description",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "3",
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    // @ts-ignore
    [taskForm,];
    const __VLS_277 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
        ...{ class: "mb-4" },
    }));
    const __VLS_279 = __VLS_278({
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_282 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({}));
    const __VLS_284 = __VLS_283({}, ...__VLS_functionalComponentArgsRest(__VLS_283));
    const { default: __VLS_286 } = __VLS_285.slots;
    const __VLS_287 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
        cols: "12",
        sm: "4",
    }));
    const __VLS_289 = __VLS_288({
        cols: "12",
        sm: "4",
    }, ...__VLS_functionalComponentArgsRest(__VLS_288));
    const { default: __VLS_291 } = __VLS_290.slots;
    const __VLS_292 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    VSelect;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        modelValue: (__VLS_ctx.taskForm.priority),
        items: (__VLS_ctx.taskPriorities),
        label: "Priority",
        prependInnerIcon: "mdi-flag-outline",
        variant: "outlined",
    }));
    const __VLS_294 = __VLS_293({
        modelValue: (__VLS_ctx.taskForm.priority),
        items: (__VLS_ctx.taskPriorities),
        label: "Priority",
        prependInnerIcon: "mdi-flag-outline",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    // @ts-ignore
    [taskForm, taskPriorities,];
    var __VLS_290;
    const __VLS_297 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        cols: "12",
        sm: "4",
    }));
    const __VLS_299 = __VLS_298({
        cols: "12",
        sm: "4",
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    const { default: __VLS_301 } = __VLS_300.slots;
    const __VLS_302 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    VSelect;
    // @ts-ignore
    const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
        modelValue: (__VLS_ctx.taskForm.status),
        items: (__VLS_ctx.taskStatuses),
        label: "Status",
        prependInnerIcon: "mdi-list-status",
        variant: "outlined",
    }));
    const __VLS_304 = __VLS_303({
        modelValue: (__VLS_ctx.taskForm.status),
        items: (__VLS_ctx.taskStatuses),
        label: "Status",
        prependInnerIcon: "mdi-list-status",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_303));
    // @ts-ignore
    [taskForm, taskStatuses,];
    var __VLS_300;
    const __VLS_307 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
        cols: "12",
        sm: "4",
    }));
    const __VLS_309 = __VLS_308({
        cols: "12",
        sm: "4",
    }, ...__VLS_functionalComponentArgsRest(__VLS_308));
    const { default: __VLS_311 } = __VLS_310.slots;
    const __VLS_312 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        modelValue: (__VLS_ctx.taskForm.due_date),
        label: "Due Date",
        type: "date",
        prependInnerIcon: "mdi-calendar",
        variant: "outlined",
    }));
    const __VLS_314 = __VLS_313({
        modelValue: (__VLS_ctx.taskForm.due_date),
        label: "Due Date",
        type: "date",
        prependInnerIcon: "mdi-calendar",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    // @ts-ignore
    [taskForm,];
    var __VLS_310;
    var __VLS_285;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-end mt-2" },
    });
    const __VLS_317 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
        type: "submit",
        color: "primary",
        rounded: "lg",
        loading: (__VLS_ctx.taskFormLoading),
        prependIcon: "mdi-plus",
    }));
    const __VLS_319 = __VLS_318({
        type: "submit",
        color: "primary",
        rounded: "lg",
        loading: (__VLS_ctx.taskFormLoading),
        prependIcon: "mdi-plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_318));
    const { default: __VLS_321 } = __VLS_320.slots;
    // @ts-ignore
    [taskFormLoading,];
    var __VLS_320;
    var __VLS_262;
    var __VLS_244;
    var __VLS_239;
}
if (__VLS_ctx.selected === 'editTask') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_322 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({}));
    const __VLS_324 = __VLS_323({}, ...__VLS_functionalComponentArgsRest(__VLS_323));
    const { default: __VLS_326 } = __VLS_325.slots;
    const __VLS_327 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_328 = __VLS_asFunctionalComponent(__VLS_327, new __VLS_327({
        cols: "12",
        md: "5",
    }));
    const __VLS_329 = __VLS_328({
        cols: "12",
        md: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_328));
    const { default: __VLS_331 } = __VLS_330.slots;
    const __VLS_332 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        elevation: "2",
        rounded: "lg",
        height: "100%",
    }));
    const __VLS_334 = __VLS_333({
        elevation: "2",
        rounded: "lg",
        height: "100%",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    const { default: __VLS_336 } = __VLS_335.slots;
    const __VLS_337 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    VCardTitle;
    // @ts-ignore
    const __VLS_338 = __VLS_asFunctionalComponent(__VLS_337, new __VLS_337({
        ...{ class: "px-6 pt-5 pb-2 text-h6" },
    }));
    const __VLS_339 = __VLS_338({
        ...{ class: "px-6 pt-5 pb-2 text-h6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_338));
    const { default: __VLS_341 } = __VLS_340.slots;
    var __VLS_340;
    const __VLS_342 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
        ...{ class: "pa-0" },
    }));
    const __VLS_344 = __VLS_343({
        ...{ class: "pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_343));
    const { default: __VLS_346 } = __VLS_345.slots;
    if (__VLS_ctx.tasksError) {
        // @ts-ignore
        [tasksError,];
        const __VLS_347 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_348 = __VLS_asFunctionalComponent(__VLS_347, new __VLS_347({
            type: "error",
            variant: "tonal",
            ...{ class: "ma-4" },
        }));
        const __VLS_349 = __VLS_348({
            type: "error",
            variant: "tonal",
            ...{ class: "ma-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_348));
        const { default: __VLS_351 } = __VLS_350.slots;
        (__VLS_ctx.tasksError);
        // @ts-ignore
        [tasksError,];
        var __VLS_350;
    }
    const __VLS_352 = {}.VList;
    /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
    // @ts-ignore
    VList;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
        lines: "two",
        nav: true,
    }));
    const __VLS_354 = __VLS_353({
        lines: "two",
        nav: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    const { default: __VLS_356 } = __VLS_355.slots;
    for (const [task] of __VLS_getVForSourceType((__VLS_ctx.tasks))) {
        // @ts-ignore
        [tasks,];
        const __VLS_357 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        VListItem;
        // @ts-ignore
        const __VLS_358 = __VLS_asFunctionalComponent(__VLS_357, new __VLS_357({
            ...{ 'onClick': {} },
            key: (task.id),
            title: (task.title),
            subtitle: (task.status),
            active: (__VLS_ctx.selectedTask?.id === task.id),
            activeColor: "primary",
            rounded: "lg",
        }));
        const __VLS_359 = __VLS_358({
            ...{ 'onClick': {} },
            key: (task.id),
            title: (task.title),
            subtitle: (task.status),
            active: (__VLS_ctx.selectedTask?.id === task.id),
            activeColor: "primary",
            rounded: "lg",
        }, ...__VLS_functionalComponentArgsRest(__VLS_358));
        let __VLS_361;
        let __VLS_362;
        const __VLS_363 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selected === 'editTask'))
                        return;
                    __VLS_ctx.selectTaskForEdit(task);
                    // @ts-ignore
                    [selectedTask, selectTaskForEdit,];
                } });
        const { default: __VLS_364 } = __VLS_360.slots;
        {
            const { append: __VLS_365 } = __VLS_360.slots;
            const __VLS_366 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            VChip;
            // @ts-ignore
            const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({
                color: (__VLS_ctx.priorityColor[task.priority] ?? 'grey'),
                size: "x-small",
                variant: "tonal",
                ...{ class: "mr-2" },
            }));
            const __VLS_368 = __VLS_367({
                color: (__VLS_ctx.priorityColor[task.priority] ?? 'grey'),
                size: "x-small",
                variant: "tonal",
                ...{ class: "mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_367));
            const { default: __VLS_370 } = __VLS_369.slots;
            // @ts-ignore
            [priorityColor,];
            (task.priority);
            var __VLS_369;
            const __VLS_371 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            VBtn;
            // @ts-ignore
            const __VLS_372 = __VLS_asFunctionalComponent(__VLS_371, new __VLS_371({
                ...{ 'onClick': {} },
                icon: "mdi-delete",
                size: "x-small",
                color: "error",
                variant: "text",
            }));
            const __VLS_373 = __VLS_372({
                ...{ 'onClick': {} },
                icon: "mdi-delete",
                size: "x-small",
                color: "error",
                variant: "text",
            }, ...__VLS_functionalComponentArgsRest(__VLS_372));
            let __VLS_375;
            let __VLS_376;
            const __VLS_377 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!(__VLS_ctx.selected === 'editTask'))
                            return;
                        __VLS_ctx.deleteTask(task.id);
                        // @ts-ignore
                        [deleteTask,];
                    } });
            var __VLS_374;
        }
        var __VLS_360;
    }
    if (__VLS_ctx.tasks.length === 0 && !__VLS_ctx.tasksLoading) {
        // @ts-ignore
        [tasks, tasksLoading,];
        const __VLS_379 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        VListItem;
        // @ts-ignore
        const __VLS_380 = __VLS_asFunctionalComponent(__VLS_379, new __VLS_379({}));
        const __VLS_381 = __VLS_380({}, ...__VLS_functionalComponentArgsRest(__VLS_380));
        const { default: __VLS_383 } = __VLS_382.slots;
        const __VLS_384 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        VListItemTitle;
        // @ts-ignore
        const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
            ...{ class: "text-medium-emphasis" },
        }));
        const __VLS_386 = __VLS_385({
            ...{ class: "text-medium-emphasis" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_385));
        const { default: __VLS_388 } = __VLS_387.slots;
        var __VLS_387;
        var __VLS_382;
    }
    var __VLS_355;
    var __VLS_345;
    var __VLS_335;
    var __VLS_330;
    const __VLS_389 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_390 = __VLS_asFunctionalComponent(__VLS_389, new __VLS_389({
        cols: "12",
        md: "7",
    }));
    const __VLS_391 = __VLS_390({
        cols: "12",
        md: "7",
    }, ...__VLS_functionalComponentArgsRest(__VLS_390));
    const { default: __VLS_393 } = __VLS_392.slots;
    const __VLS_394 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
        elevation: "2",
        rounded: "lg",
        height: "100%",
    }));
    const __VLS_396 = __VLS_395({
        elevation: "2",
        rounded: "lg",
        height: "100%",
    }, ...__VLS_functionalComponentArgsRest(__VLS_395));
    const { default: __VLS_398 } = __VLS_397.slots;
    const __VLS_399 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_400 = __VLS_asFunctionalComponent(__VLS_399, new __VLS_399({
        ...{ class: "pa-6" },
    }));
    const __VLS_401 = __VLS_400({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_400));
    const { default: __VLS_403 } = __VLS_402.slots;
    if (!__VLS_ctx.selectedTask) {
        // @ts-ignore
        [selectedTask,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center py-10" },
        });
        const __VLS_404 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
            size: "48",
            color: "grey-lighten-1",
        }));
        const __VLS_406 = __VLS_405({
            size: "48",
            color: "grey-lighten-1",
        }, ...__VLS_functionalComponentArgsRest(__VLS_405));
        const { default: __VLS_408 } = __VLS_407.slots;
        var __VLS_407;
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-medium-emphasis mt-3" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-h6 font-weight-bold mb-4" },
        });
        (__VLS_ctx.selectedTask.title);
        // @ts-ignore
        [selectedTask,];
        if (__VLS_ctx.editTaskSuccess) {
            // @ts-ignore
            [editTaskSuccess,];
            const __VLS_409 = {}.VAlert;
            /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
            // @ts-ignore
            VAlert;
            // @ts-ignore
            const __VLS_410 = __VLS_asFunctionalComponent(__VLS_409, new __VLS_409({
                ...{ 'onClick:close': {} },
                type: "success",
                variant: "tonal",
                rounded: "lg",
                ...{ class: "mb-4" },
                closable: true,
            }));
            const __VLS_411 = __VLS_410({
                ...{ 'onClick:close': {} },
                type: "success",
                variant: "tonal",
                rounded: "lg",
                ...{ class: "mb-4" },
                closable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_410));
            let __VLS_413;
            let __VLS_414;
            const __VLS_415 = ({ 'click:close': {} },
                { 'onClick:close': (...[$event]) => {
                        if (!(__VLS_ctx.selected === 'editTask'))
                            return;
                        if (!!(!__VLS_ctx.selectedTask))
                            return;
                        if (!(__VLS_ctx.editTaskSuccess))
                            return;
                        __VLS_ctx.editTaskSuccess = '';
                        // @ts-ignore
                        [editTaskSuccess,];
                    } });
            const { default: __VLS_416 } = __VLS_412.slots;
            (__VLS_ctx.editTaskSuccess);
            // @ts-ignore
            [editTaskSuccess,];
            var __VLS_412;
        }
        if (__VLS_ctx.editTaskError) {
            // @ts-ignore
            [editTaskError,];
            const __VLS_417 = {}.VAlert;
            /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
            // @ts-ignore
            VAlert;
            // @ts-ignore
            const __VLS_418 = __VLS_asFunctionalComponent(__VLS_417, new __VLS_417({
                type: "error",
                variant: "tonal",
                rounded: "lg",
                ...{ class: "mb-4" },
            }));
            const __VLS_419 = __VLS_418({
                type: "error",
                variant: "tonal",
                rounded: "lg",
                ...{ class: "mb-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_418));
            const { default: __VLS_421 } = __VLS_420.slots;
            (__VLS_ctx.editTaskError);
            // @ts-ignore
            [editTaskError,];
            var __VLS_420;
        }
        const __VLS_422 = {}.VForm;
        /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
        // @ts-ignore
        VForm;
        // @ts-ignore
        const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
            ...{ 'onSubmit': {} },
            modelValue: (__VLS_ctx.editTaskValid),
        }));
        const __VLS_424 = __VLS_423({
            ...{ 'onSubmit': {} },
            modelValue: (__VLS_ctx.editTaskValid),
        }, ...__VLS_functionalComponentArgsRest(__VLS_423));
        let __VLS_426;
        let __VLS_427;
        const __VLS_428 = ({ submit: {} },
            { onSubmit: (__VLS_ctx.saveTaskEdit) });
        const { default: __VLS_429 } = __VLS_425.slots;
        // @ts-ignore
        [editTaskValid, saveTaskEdit,];
        const __VLS_430 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
            modelValue: (__VLS_ctx.editTaskForm.title),
            label: "Title",
            rules: ([v => !!v || 'Title is required']),
            prependInnerIcon: "mdi-format-title",
            variant: "outlined",
            ...{ class: "mb-3" },
            required: true,
        }));
        const __VLS_432 = __VLS_431({
            modelValue: (__VLS_ctx.editTaskForm.title),
            label: "Title",
            rules: ([v => !!v || 'Title is required']),
            prependInnerIcon: "mdi-format-title",
            variant: "outlined",
            ...{ class: "mb-3" },
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_431));
        // @ts-ignore
        [editTaskForm,];
        const __VLS_435 = {}.VTextarea;
        /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
        // @ts-ignore
        VTextarea;
        // @ts-ignore
        const __VLS_436 = __VLS_asFunctionalComponent(__VLS_435, new __VLS_435({
            modelValue: (__VLS_ctx.editTaskForm.description),
            label: "Description",
            prependInnerIcon: "mdi-text-box",
            variant: "outlined",
            rows: "3",
            ...{ class: "mb-3" },
        }));
        const __VLS_437 = __VLS_436({
            modelValue: (__VLS_ctx.editTaskForm.description),
            label: "Description",
            prependInnerIcon: "mdi-text-box",
            variant: "outlined",
            rows: "3",
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_436));
        // @ts-ignore
        [editTaskForm,];
        const __VLS_440 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        VRow;
        // @ts-ignore
        const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({}));
        const __VLS_442 = __VLS_441({}, ...__VLS_functionalComponentArgsRest(__VLS_441));
        const { default: __VLS_444 } = __VLS_443.slots;
        const __VLS_445 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_446 = __VLS_asFunctionalComponent(__VLS_445, new __VLS_445({
            cols: "6",
        }));
        const __VLS_447 = __VLS_446({
            cols: "6",
        }, ...__VLS_functionalComponentArgsRest(__VLS_446));
        const { default: __VLS_449 } = __VLS_448.slots;
        const __VLS_450 = {}.VSelect;
        /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
        // @ts-ignore
        VSelect;
        // @ts-ignore
        const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
            modelValue: (__VLS_ctx.editTaskForm.priority),
            items: (__VLS_ctx.taskPriorities),
            label: "Priority",
            prependInnerIcon: "mdi-flag-outline",
            variant: "outlined",
        }));
        const __VLS_452 = __VLS_451({
            modelValue: (__VLS_ctx.editTaskForm.priority),
            items: (__VLS_ctx.taskPriorities),
            label: "Priority",
            prependInnerIcon: "mdi-flag-outline",
            variant: "outlined",
        }, ...__VLS_functionalComponentArgsRest(__VLS_451));
        // @ts-ignore
        [taskPriorities, editTaskForm,];
        var __VLS_448;
        const __VLS_455 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_456 = __VLS_asFunctionalComponent(__VLS_455, new __VLS_455({
            cols: "6",
        }));
        const __VLS_457 = __VLS_456({
            cols: "6",
        }, ...__VLS_functionalComponentArgsRest(__VLS_456));
        const { default: __VLS_459 } = __VLS_458.slots;
        const __VLS_460 = {}.VSelect;
        /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
        // @ts-ignore
        VSelect;
        // @ts-ignore
        const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
            modelValue: (__VLS_ctx.editTaskForm.status),
            items: (__VLS_ctx.taskStatuses),
            label: "Status",
            prependInnerIcon: "mdi-list-status",
            variant: "outlined",
        }));
        const __VLS_462 = __VLS_461({
            modelValue: (__VLS_ctx.editTaskForm.status),
            items: (__VLS_ctx.taskStatuses),
            label: "Status",
            prependInnerIcon: "mdi-list-status",
            variant: "outlined",
        }, ...__VLS_functionalComponentArgsRest(__VLS_461));
        // @ts-ignore
        [taskStatuses, editTaskForm,];
        var __VLS_458;
        var __VLS_443;
        const __VLS_465 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_466 = __VLS_asFunctionalComponent(__VLS_465, new __VLS_465({
            modelValue: (__VLS_ctx.editTaskForm.due_date),
            label: "Due Date",
            type: "date",
            prependInnerIcon: "mdi-calendar",
            variant: "outlined",
            ...{ class: "mb-4" },
        }));
        const __VLS_467 = __VLS_466({
            modelValue: (__VLS_ctx.editTaskForm.due_date),
            label: "Due Date",
            type: "date",
            prependInnerIcon: "mdi-calendar",
            variant: "outlined",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_466));
        // @ts-ignore
        [editTaskForm,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex justify-end" },
        });
        const __VLS_470 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({
            type: "submit",
            color: "primary",
            rounded: "lg",
            loading: (__VLS_ctx.editTaskLoading),
            prependIcon: "mdi-content-save",
        }));
        const __VLS_472 = __VLS_471({
            type: "submit",
            color: "primary",
            rounded: "lg",
            loading: (__VLS_ctx.editTaskLoading),
            prependIcon: "mdi-content-save",
        }, ...__VLS_functionalComponentArgsRest(__VLS_471));
        const { default: __VLS_474 } = __VLS_473.slots;
        // @ts-ignore
        [editTaskLoading,];
        var __VLS_473;
        var __VLS_425;
    }
    var __VLS_402;
    var __VLS_397;
    var __VLS_392;
    var __VLS_325;
}
if (__VLS_ctx.selected === 'attendance') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    /** @type {[typeof attendancePage, ]} */ ;
    // @ts-ignore
    const __VLS_475 = __VLS_asFunctionalComponent(attendancePage, new attendancePage({}));
    const __VLS_476 = __VLS_475({}, ...__VLS_functionalComponentArgsRest(__VLS_475));
}
if (__VLS_ctx.selected === 'forms') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_479 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_480 = __VLS_asFunctionalComponent(__VLS_479, new __VLS_479({}));
    const __VLS_481 = __VLS_480({}, ...__VLS_functionalComponentArgsRest(__VLS_480));
    const { default: __VLS_483 } = __VLS_482.slots;
    const __VLS_484 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
        cols: "12",
        sm: "6",
    }));
    const __VLS_486 = __VLS_485({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    const { default: __VLS_488 } = __VLS_487.slots;
    const __VLS_489 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_490 = __VLS_asFunctionalComponent(__VLS_489, new __VLS_489({
        ...{ 'onClick': {} },
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-6 cursor-pointer" },
        hover: true,
    }));
    const __VLS_491 = __VLS_490({
        ...{ 'onClick': {} },
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-6 cursor-pointer" },
        hover: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_490));
    let __VLS_493;
    let __VLS_494;
    const __VLS_495 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'forms'))
                    return;
                __VLS_ctx.selected = 'pcard';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_496 } = __VLS_492.slots;
    const __VLS_497 = {}.VAvatar;
    /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
    // @ts-ignore
    VAvatar;
    // @ts-ignore
    const __VLS_498 = __VLS_asFunctionalComponent(__VLS_497, new __VLS_497({
        color: "primary",
        variant: "tonal",
        size: "52",
        ...{ class: "mb-4" },
    }));
    const __VLS_499 = __VLS_498({
        color: "primary",
        variant: "tonal",
        size: "52",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_498));
    const { default: __VLS_501 } = __VLS_500.slots;
    const __VLS_502 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        size: "28",
        color: "primary",
    }));
    const __VLS_504 = __VLS_503({
        size: "28",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    const { default: __VLS_506 } = __VLS_505.slots;
    var __VLS_505;
    var __VLS_500;
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "text-h6 font-weight-bold mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis text-body-2" },
    });
    const __VLS_507 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_508 = __VLS_asFunctionalComponent(__VLS_507, new __VLS_507({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        color: "primary",
        variant: "tonal",
        rounded: "lg",
        prependIcon: "mdi-arrow-right",
    }));
    const __VLS_509 = __VLS_508({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        color: "primary",
        variant: "tonal",
        rounded: "lg",
        prependIcon: "mdi-arrow-right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_508));
    let __VLS_511;
    let __VLS_512;
    const __VLS_513 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'forms'))
                    return;
                __VLS_ctx.selected = 'pcard';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_514 } = __VLS_510.slots;
    var __VLS_510;
    var __VLS_492;
    var __VLS_487;
    const __VLS_515 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_516 = __VLS_asFunctionalComponent(__VLS_515, new __VLS_515({
        cols: "12",
        sm: "6",
    }));
    const __VLS_517 = __VLS_516({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_516));
    const { default: __VLS_519 } = __VLS_518.slots;
    const __VLS_520 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
        ...{ 'onClick': {} },
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-6 cursor-pointer" },
        hover: true,
    }));
    const __VLS_522 = __VLS_521({
        ...{ 'onClick': {} },
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-6 cursor-pointer" },
        hover: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_521));
    let __VLS_524;
    let __VLS_525;
    const __VLS_526 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'forms'))
                    return;
                __VLS_ctx.selected = 'travelreq';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_527 } = __VLS_523.slots;
    const __VLS_528 = {}.VAvatar;
    /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
    // @ts-ignore
    VAvatar;
    // @ts-ignore
    const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
        color: "primary",
        variant: "tonal",
        size: "52",
        ...{ class: "mb-4" },
    }));
    const __VLS_530 = __VLS_529({
        color: "primary",
        variant: "tonal",
        size: "52",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_529));
    const { default: __VLS_532 } = __VLS_531.slots;
    const __VLS_533 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_534 = __VLS_asFunctionalComponent(__VLS_533, new __VLS_533({
        size: "28",
        color: "primary",
    }));
    const __VLS_535 = __VLS_534({
        size: "28",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_534));
    const { default: __VLS_537 } = __VLS_536.slots;
    var __VLS_536;
    var __VLS_531;
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "text-h6 font-weight-bold mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis text-body-2" },
    });
    const __VLS_538 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        color: "primary",
        variant: "tonal",
        rounded: "lg",
        prependIcon: "mdi-arrow-right",
    }));
    const __VLS_540 = __VLS_539({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        color: "primary",
        variant: "tonal",
        rounded: "lg",
        prependIcon: "mdi-arrow-right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_539));
    let __VLS_542;
    let __VLS_543;
    const __VLS_544 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'forms'))
                    return;
                __VLS_ctx.selected = 'travelreq';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_545 } = __VLS_541.slots;
    var __VLS_541;
    var __VLS_523;
    var __VLS_518;
    const __VLS_546 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
        cols: "12",
        sm: "6",
    }));
    const __VLS_548 = __VLS_547({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_547));
    const { default: __VLS_550 } = __VLS_549.slots;
    const __VLS_551 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_552 = __VLS_asFunctionalComponent(__VLS_551, new __VLS_551({
        ...{ 'onClick': {} },
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-6 cursor-pointer" },
        hover: true,
    }));
    const __VLS_553 = __VLS_552({
        ...{ 'onClick': {} },
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-6 cursor-pointer" },
        hover: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_552));
    let __VLS_555;
    let __VLS_556;
    const __VLS_557 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'forms'))
                    return;
                __VLS_ctx.selected = 'resourcecheckout';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_558 } = __VLS_554.slots;
    const __VLS_559 = {}.VAvatar;
    /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
    // @ts-ignore
    VAvatar;
    // @ts-ignore
    const __VLS_560 = __VLS_asFunctionalComponent(__VLS_559, new __VLS_559({
        color: "primary",
        variant: "tonal",
        size: "52",
        ...{ class: "mb-4" },
    }));
    const __VLS_561 = __VLS_560({
        color: "primary",
        variant: "tonal",
        size: "52",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_560));
    const { default: __VLS_563 } = __VLS_562.slots;
    const __VLS_564 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
        size: "28",
        color: "primary",
    }));
    const __VLS_566 = __VLS_565({
        size: "28",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_565));
    const { default: __VLS_568 } = __VLS_567.slots;
    var __VLS_567;
    var __VLS_562;
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "text-h6 font-weight-bold mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis text-body-2" },
    });
    const __VLS_569 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_570 = __VLS_asFunctionalComponent(__VLS_569, new __VLS_569({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        color: "primary",
        variant: "tonal",
        rounded: "lg",
        prependIcon: "mdi-arrow-right",
    }));
    const __VLS_571 = __VLS_570({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        color: "primary",
        variant: "tonal",
        rounded: "lg",
        prependIcon: "mdi-arrow-right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_570));
    let __VLS_573;
    let __VLS_574;
    const __VLS_575 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'forms'))
                    return;
                __VLS_ctx.selected = 'resourcecheckout';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_576 } = __VLS_572.slots;
    var __VLS_572;
    var __VLS_554;
    var __VLS_549;
    var __VLS_482;
}
if (__VLS_ctx.selected === 'pcard') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_577 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_578 = __VLS_asFunctionalComponent(__VLS_577, new __VLS_577({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-4 pl-0" },
    }));
    const __VLS_579 = __VLS_578({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-4 pl-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_578));
    let __VLS_581;
    let __VLS_582;
    const __VLS_583 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'pcard'))
                    return;
                __VLS_ctx.selected = 'forms';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_584 } = __VLS_580.slots;
    var __VLS_580;
    /** @type {[typeof pCardRequest, ]} */ ;
    // @ts-ignore
    const __VLS_585 = __VLS_asFunctionalComponent(pCardRequest, new pCardRequest({}));
    const __VLS_586 = __VLS_585({}, ...__VLS_functionalComponentArgsRest(__VLS_585));
}
if (__VLS_ctx.selected === 'travelreq') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_589 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_590 = __VLS_asFunctionalComponent(__VLS_589, new __VLS_589({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-4 pl-0" },
    }));
    const __VLS_591 = __VLS_590({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-4 pl-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_590));
    let __VLS_593;
    let __VLS_594;
    const __VLS_595 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'travelreq'))
                    return;
                __VLS_ctx.selected = 'forms';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_596 } = __VLS_592.slots;
    var __VLS_592;
    /** @type {[typeof travelRequest, ]} */ ;
    // @ts-ignore
    const __VLS_597 = __VLS_asFunctionalComponent(travelRequest, new travelRequest({}));
    const __VLS_598 = __VLS_597({}, ...__VLS_functionalComponentArgsRest(__VLS_597));
}
if (__VLS_ctx.selected === 'resourcecheckout') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_601 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_602 = __VLS_asFunctionalComponent(__VLS_601, new __VLS_601({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-4 pl-0" },
    }));
    const __VLS_603 = __VLS_602({
        ...{ 'onClick': {} },
        variant: "text",
        prependIcon: "mdi-arrow-left",
        ...{ class: "mb-4 pl-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_602));
    let __VLS_605;
    let __VLS_606;
    const __VLS_607 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.selected === 'resourcecheckout'))
                    return;
                __VLS_ctx.selected = 'forms';
                // @ts-ignore
                [selected,];
            } });
    const { default: __VLS_608 } = __VLS_604.slots;
    var __VLS_604;
    /** @type {[typeof resourceCheckout, ]} */ ;
    // @ts-ignore
    const __VLS_609 = __VLS_asFunctionalComponent(resourceCheckout, new resourceCheckout({}));
    const __VLS_610 = __VLS_609({}, ...__VLS_functionalComponentArgsRest(__VLS_609));
}
if (__VLS_ctx.selected === 'submissions') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center justify-space-between mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_613 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_614 = __VLS_asFunctionalComponent(__VLS_613, new __VLS_613({}));
    const __VLS_615 = __VLS_614({}, ...__VLS_functionalComponentArgsRest(__VLS_614));
    const { default: __VLS_617 } = __VLS_616.slots;
    const __VLS_618 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_619 = __VLS_asFunctionalComponent(__VLS_618, new __VLS_618({
        cols: "12",
        md: "7",
    }));
    const __VLS_620 = __VLS_619({
        cols: "12",
        md: "7",
    }, ...__VLS_functionalComponentArgsRest(__VLS_619));
    const { default: __VLS_622 } = __VLS_621.slots;
    const __VLS_623 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_624 = __VLS_asFunctionalComponent(__VLS_623, new __VLS_623({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_625 = __VLS_624({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_624));
    const { default: __VLS_627 } = __VLS_626.slots;
    const __VLS_628 = {}.VCardTitle;
    /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
    // @ts-ignore
    VCardTitle;
    // @ts-ignore
    const __VLS_629 = __VLS_asFunctionalComponent(__VLS_628, new __VLS_628({
        ...{ class: "px-6 pt-5 pb-2 text-h6" },
    }));
    const __VLS_630 = __VLS_629({
        ...{ class: "px-6 pt-5 pb-2 text-h6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_629));
    const { default: __VLS_632 } = __VLS_631.slots;
    var __VLS_631;
    const __VLS_633 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_634 = __VLS_asFunctionalComponent(__VLS_633, new __VLS_633({
        ...{ class: "pa-0" },
    }));
    const __VLS_635 = __VLS_634({
        ...{ class: "pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_634));
    const { default: __VLS_637 } = __VLS_636.slots;
    if (__VLS_ctx.submissionsLoading) {
        // @ts-ignore
        [submissionsLoading,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pa-6" },
        });
        for (const [i] of __VLS_getVForSourceType((3))) {
            const __VLS_638 = {}.VSkeletonLoader;
            /** @type {[typeof __VLS_components.VSkeletonLoader, typeof __VLS_components.vSkeletonLoader, ]} */ ;
            // @ts-ignore
            VSkeletonLoader;
            // @ts-ignore
            const __VLS_639 = __VLS_asFunctionalComponent(__VLS_638, new __VLS_638({
                key: (i),
                type: "list-item-two-line",
                ...{ class: "mb-2" },
            }));
            const __VLS_640 = __VLS_639({
                key: (i),
                type: "list-item-two-line",
                ...{ class: "mb-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_639));
        }
    }
    else if (__VLS_ctx.submissions.length === 0) {
        // @ts-ignore
        [submissions,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center py-10" },
        });
        const __VLS_643 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_644 = __VLS_asFunctionalComponent(__VLS_643, new __VLS_643({
            size: "48",
            color: "grey-lighten-1",
        }));
        const __VLS_645 = __VLS_644({
            size: "48",
            color: "grey-lighten-1",
        }, ...__VLS_functionalComponentArgsRest(__VLS_644));
        const { default: __VLS_647 } = __VLS_646.slots;
        var __VLS_646;
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-medium-emphasis mt-3" },
        });
    }
    else {
        const __VLS_648 = {}.VList;
        /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
        // @ts-ignore
        VList;
        // @ts-ignore
        const __VLS_649 = __VLS_asFunctionalComponent(__VLS_648, new __VLS_648({
            lines: "two",
            nav: true,
            ...{ class: "pa-2" },
        }));
        const __VLS_650 = __VLS_649({
            lines: "two",
            nav: true,
            ...{ class: "pa-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_649));
        const { default: __VLS_652 } = __VLS_651.slots;
        for (const [sub] of __VLS_getVForSourceType((__VLS_ctx.submissions))) {
            // @ts-ignore
            [submissions,];
            const __VLS_653 = {}.VListItem;
            /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
            // @ts-ignore
            VListItem;
            // @ts-ignore
            const __VLS_654 = __VLS_asFunctionalComponent(__VLS_653, new __VLS_653({
                ...{ 'onClick': {} },
                key: (sub.id),
                active: (__VLS_ctx.selectedSubmission?.id === sub.id),
                activeColor: "primary",
                rounded: "lg",
                ...{ class: "mb-1" },
            }));
            const __VLS_655 = __VLS_654({
                ...{ 'onClick': {} },
                key: (sub.id),
                active: (__VLS_ctx.selectedSubmission?.id === sub.id),
                activeColor: "primary",
                rounded: "lg",
                ...{ class: "mb-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_654));
            let __VLS_657;
            let __VLS_658;
            const __VLS_659 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!(__VLS_ctx.selected === 'submissions'))
                            return;
                        if (!!(__VLS_ctx.submissionsLoading))
                            return;
                        if (!!(__VLS_ctx.submissions.length === 0))
                            return;
                        __VLS_ctx.selectedSubmission = sub;
                        // @ts-ignore
                        [selectedSubmission, selectedSubmission,];
                    } });
            const { default: __VLS_660 } = __VLS_656.slots;
            {
                const { prepend: __VLS_661 } = __VLS_656.slots;
                const __VLS_662 = {}.VAvatar;
                /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
                // @ts-ignore
                VAvatar;
                // @ts-ignore
                const __VLS_663 = __VLS_asFunctionalComponent(__VLS_662, new __VLS_662({
                    color: (sub.statusColor),
                    variant: "tonal",
                    size: "40",
                }));
                const __VLS_664 = __VLS_663({
                    color: (sub.statusColor),
                    variant: "tonal",
                    size: "40",
                }, ...__VLS_functionalComponentArgsRest(__VLS_663));
                const { default: __VLS_666 } = __VLS_665.slots;
                const __VLS_667 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                VIcon;
                // @ts-ignore
                const __VLS_668 = __VLS_asFunctionalComponent(__VLS_667, new __VLS_667({
                    icon: (sub.icon),
                    size: "20",
                    color: (sub.statusColor),
                }));
                const __VLS_669 = __VLS_668({
                    icon: (sub.icon),
                    size: "20",
                    color: (sub.statusColor),
                }, ...__VLS_functionalComponentArgsRest(__VLS_668));
                var __VLS_665;
            }
            const __VLS_672 = {}.VListItemTitle;
            /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
            // @ts-ignore
            VListItemTitle;
            // @ts-ignore
            const __VLS_673 = __VLS_asFunctionalComponent(__VLS_672, new __VLS_672({
                ...{ class: "font-weight-medium" },
            }));
            const __VLS_674 = __VLS_673({
                ...{ class: "font-weight-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_673));
            const { default: __VLS_676 } = __VLS_675.slots;
            (sub.formName);
            var __VLS_675;
            const __VLS_677 = {}.VListItemSubtitle;
            /** @type {[typeof __VLS_components.VListItemSubtitle, typeof __VLS_components.vListItemSubtitle, typeof __VLS_components.VListItemSubtitle, typeof __VLS_components.vListItemSubtitle, ]} */ ;
            // @ts-ignore
            VListItemSubtitle;
            // @ts-ignore
            const __VLS_678 = __VLS_asFunctionalComponent(__VLS_677, new __VLS_677({}));
            const __VLS_679 = __VLS_678({}, ...__VLS_functionalComponentArgsRest(__VLS_678));
            const { default: __VLS_681 } = __VLS_680.slots;
            const __VLS_682 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            VChip;
            // @ts-ignore
            const __VLS_683 = __VLS_asFunctionalComponent(__VLS_682, new __VLS_682({
                size: "x-small",
                color: (sub.statusColor),
                variant: "tonal",
                ...{ class: "mr-2" },
            }));
            const __VLS_684 = __VLS_683({
                size: "x-small",
                color: (sub.statusColor),
                variant: "tonal",
                ...{ class: "mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_683));
            const { default: __VLS_686 } = __VLS_685.slots;
            (sub.status);
            var __VLS_685;
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-caption" },
            });
            (sub.submittedDate);
            var __VLS_680;
            {
                const { append: __VLS_687 } = __VLS_656.slots;
                const __VLS_688 = {}.VIcon;
                /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
                // @ts-ignore
                VIcon;
                // @ts-ignore
                const __VLS_689 = __VLS_asFunctionalComponent(__VLS_688, new __VLS_688({
                    size: "16",
                    color: "grey",
                }));
                const __VLS_690 = __VLS_689({
                    size: "16",
                    color: "grey",
                }, ...__VLS_functionalComponentArgsRest(__VLS_689));
                const { default: __VLS_692 } = __VLS_691.slots;
                var __VLS_691;
            }
            var __VLS_656;
        }
        var __VLS_651;
    }
    var __VLS_636;
    var __VLS_626;
    var __VLS_621;
    const __VLS_693 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_694 = __VLS_asFunctionalComponent(__VLS_693, new __VLS_693({
        cols: "12",
        md: "5",
    }));
    const __VLS_695 = __VLS_694({
        cols: "12",
        md: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_694));
    const { default: __VLS_697 } = __VLS_696.slots;
    if (!__VLS_ctx.selectedSubmission) {
        // @ts-ignore
        [selectedSubmission,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center py-16" },
        });
        const __VLS_698 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_699 = __VLS_asFunctionalComponent(__VLS_698, new __VLS_698({
            size: "48",
            color: "grey-lighten-1",
        }));
        const __VLS_700 = __VLS_699({
            size: "48",
            color: "grey-lighten-1",
        }, ...__VLS_functionalComponentArgsRest(__VLS_699));
        const { default: __VLS_702 } = __VLS_701.slots;
        var __VLS_701;
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-medium-emphasis mt-3" },
        });
    }
    else {
        const __VLS_703 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        VCard;
        // @ts-ignore
        const __VLS_704 = __VLS_asFunctionalComponent(__VLS_703, new __VLS_703({
            elevation: "2",
            rounded: "lg",
            ...{ class: "mb-4" },
        }));
        const __VLS_705 = __VLS_704({
            elevation: "2",
            rounded: "lg",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_704));
        const { default: __VLS_707 } = __VLS_706.slots;
        const __VLS_708 = {}.VCardText;
        /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
        // @ts-ignore
        VCardText;
        // @ts-ignore
        const __VLS_709 = __VLS_asFunctionalComponent(__VLS_708, new __VLS_708({
            ...{ class: "pa-5" },
        }));
        const __VLS_710 = __VLS_709({
            ...{ class: "pa-5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_709));
        const { default: __VLS_712 } = __VLS_711.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex align-center justify-space-between mb-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ class: "text-h6 font-weight-bold" },
        });
        (__VLS_ctx.selectedSubmission.formName);
        // @ts-ignore
        [selectedSubmission,];
        const __VLS_713 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_714 = __VLS_asFunctionalComponent(__VLS_713, new __VLS_713({
            color: (__VLS_ctx.selectedSubmission.statusColor),
            variant: "tonal",
            size: "small",
        }));
        const __VLS_715 = __VLS_714({
            color: (__VLS_ctx.selectedSubmission.statusColor),
            variant: "tonal",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_714));
        const { default: __VLS_717 } = __VLS_716.slots;
        // @ts-ignore
        [selectedSubmission,];
        (__VLS_ctx.selectedSubmission.status);
        // @ts-ignore
        [selectedSubmission,];
        var __VLS_716;
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-overline text-primary mb-2" },
        });
        const __VLS_718 = {}.VProgressLinear;
        /** @type {[typeof __VLS_components.VProgressLinear, typeof __VLS_components.vProgressLinear, ]} */ ;
        // @ts-ignore
        VProgressLinear;
        // @ts-ignore
        const __VLS_719 = __VLS_asFunctionalComponent(__VLS_718, new __VLS_718({
            modelValue: (__VLS_ctx.selectedSubmission.progress),
            color: (__VLS_ctx.selectedSubmission.statusColor),
            rounded: true,
            height: "8",
            ...{ class: "mb-1" },
        }));
        const __VLS_720 = __VLS_719({
            modelValue: (__VLS_ctx.selectedSubmission.progress),
            color: (__VLS_ctx.selectedSubmission.statusColor),
            rounded: true,
            height: "8",
            ...{ class: "mb-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_719));
        // @ts-ignore
        [selectedSubmission, selectedSubmission,];
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-caption text-medium-emphasis mb-4" },
        });
        (__VLS_ctx.selectedSubmission.progress);
        // @ts-ignore
        [selectedSubmission,];
        const __VLS_723 = {}.VDivider;
        /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
        // @ts-ignore
        VDivider;
        // @ts-ignore
        const __VLS_724 = __VLS_asFunctionalComponent(__VLS_723, new __VLS_723({
            ...{ class: "mb-3" },
        }));
        const __VLS_725 = __VLS_724({
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_724));
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-overline text-primary mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex align-center ga-2 mb-2" },
        });
        const __VLS_728 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_729 = __VLS_asFunctionalComponent(__VLS_728, new __VLS_728({
            size: "16",
            color: "grey",
        }));
        const __VLS_730 = __VLS_729({
            size: "16",
            color: "grey",
        }, ...__VLS_functionalComponentArgsRest(__VLS_729));
        const { default: __VLS_732 } = __VLS_731.slots;
        var __VLS_731;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-body-2" },
        });
        (__VLS_ctx.selectedSubmission.submittedDate);
        // @ts-ignore
        [selectedSubmission,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex align-center ga-2 mb-2" },
        });
        const __VLS_733 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_734 = __VLS_asFunctionalComponent(__VLS_733, new __VLS_733({
            size: "16",
            color: "grey",
        }));
        const __VLS_735 = __VLS_734({
            size: "16",
            color: "grey",
        }, ...__VLS_functionalComponentArgsRest(__VLS_734));
        const { default: __VLS_737 } = __VLS_736.slots;
        var __VLS_736;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-body-2" },
        });
        (__VLS_ctx.selectedSubmission.lastUpdated);
        // @ts-ignore
        [selectedSubmission,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex align-center ga-2" },
        });
        const __VLS_738 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_739 = __VLS_asFunctionalComponent(__VLS_738, new __VLS_738({
            size: "16",
            color: "grey",
        }));
        const __VLS_740 = __VLS_739({
            size: "16",
            color: "grey",
        }, ...__VLS_functionalComponentArgsRest(__VLS_739));
        const { default: __VLS_742 } = __VLS_741.slots;
        var __VLS_741;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-body-2" },
        });
        (__VLS_ctx.selectedSubmission.formType);
        // @ts-ignore
        [selectedSubmission,];
        var __VLS_711;
        var __VLS_706;
        const __VLS_743 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        VCard;
        // @ts-ignore
        const __VLS_744 = __VLS_asFunctionalComponent(__VLS_743, new __VLS_743({
            elevation: "2",
            rounded: "lg",
        }));
        const __VLS_745 = __VLS_744({
            elevation: "2",
            rounded: "lg",
        }, ...__VLS_functionalComponentArgsRest(__VLS_744));
        const { default: __VLS_747 } = __VLS_746.slots;
        const __VLS_748 = {}.VCardTitle;
        /** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
        // @ts-ignore
        VCardTitle;
        // @ts-ignore
        const __VLS_749 = __VLS_asFunctionalComponent(__VLS_748, new __VLS_748({
            ...{ class: "px-5 pt-4 pb-2 text-body-1 font-weight-bold" },
        }));
        const __VLS_750 = __VLS_749({
            ...{ class: "px-5 pt-4 pb-2 text-body-1 font-weight-bold" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_749));
        const { default: __VLS_752 } = __VLS_751.slots;
        const __VLS_753 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_754 = __VLS_asFunctionalComponent(__VLS_753, new __VLS_753({
            start: true,
            color: "primary",
            size: "18",
        }));
        const __VLS_755 = __VLS_754({
            start: true,
            color: "primary",
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_754));
        const { default: __VLS_757 } = __VLS_756.slots;
        var __VLS_756;
        var __VLS_751;
        const __VLS_758 = {}.VCardText;
        /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
        // @ts-ignore
        VCardText;
        // @ts-ignore
        const __VLS_759 = __VLS_asFunctionalComponent(__VLS_758, new __VLS_758({
            ...{ class: "pa-4" },
        }));
        const __VLS_760 = __VLS_759({
            ...{ class: "pa-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_759));
        const { default: __VLS_762 } = __VLS_761.slots;
        if (__VLS_ctx.selectedSubmission.comments.length === 0) {
            // @ts-ignore
            [selectedSubmission,];
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-center py-4" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "text-caption text-medium-emphasis" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-4" },
            });
            for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.selectedSubmission.comments))) {
                // @ts-ignore
                [selectedSubmission,];
                __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (comment.id),
                    ...{ class: "d-flex ga-3 mb-4" },
                });
                const __VLS_763 = {}.VAvatar;
                /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
                // @ts-ignore
                VAvatar;
                // @ts-ignore
                const __VLS_764 = __VLS_asFunctionalComponent(__VLS_763, new __VLS_763({
                    color: (comment.isAdmin ? 'warning' : 'primary'),
                    size: "32",
                    variant: "tonal",
                }));
                const __VLS_765 = __VLS_764({
                    color: (comment.isAdmin ? 'warning' : 'primary'),
                    size: "32",
                    variant: "tonal",
                }, ...__VLS_functionalComponentArgsRest(__VLS_764));
                const { default: __VLS_767 } = __VLS_766.slots;
                __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "text-caption font-weight-bold" },
                });
                (comment.author[0]);
                var __VLS_766;
                __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex-grow-1" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "d-flex align-center ga-2 mb-1" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "text-body-2 font-weight-bold" },
                });
                (comment.author);
                if (comment.isAdmin) {
                    const __VLS_768 = {}.VChip;
                    /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
                    // @ts-ignore
                    VChip;
                    // @ts-ignore
                    const __VLS_769 = __VLS_asFunctionalComponent(__VLS_768, new __VLS_768({
                        size: "x-small",
                        color: "warning",
                        variant: "tonal",
                    }));
                    const __VLS_770 = __VLS_769({
                        size: "x-small",
                        color: "warning",
                        variant: "tonal",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_769));
                    const { default: __VLS_772 } = __VLS_771.slots;
                    var __VLS_771;
                }
                __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "text-caption text-medium-emphasis" },
                });
                (comment.date);
                const __VLS_773 = {}.VCard;
                /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
                // @ts-ignore
                VCard;
                // @ts-ignore
                const __VLS_774 = __VLS_asFunctionalComponent(__VLS_773, new __VLS_773({
                    variant: "tonal",
                    color: (comment.isAdmin ? 'warning' : 'primary'),
                    rounded: "lg",
                    ...{ class: "pa-3" },
                }));
                const __VLS_775 = __VLS_774({
                    variant: "tonal",
                    color: (comment.isAdmin ? 'warning' : 'primary'),
                    rounded: "lg",
                    ...{ class: "pa-3" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_774));
                const { default: __VLS_777 } = __VLS_776.slots;
                __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "text-body-2 ma-0" },
                });
                (comment.text);
                var __VLS_776;
            }
        }
        const __VLS_778 = {}.VDivider;
        /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
        // @ts-ignore
        VDivider;
        // @ts-ignore
        const __VLS_779 = __VLS_asFunctionalComponent(__VLS_778, new __VLS_778({
            ...{ class: "mb-3" },
        }));
        const __VLS_780 = __VLS_779({
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_779));
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex ga-2 align-start" },
        });
        const __VLS_783 = {}.VAvatar;
        /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
        // @ts-ignore
        VAvatar;
        // @ts-ignore
        const __VLS_784 = __VLS_asFunctionalComponent(__VLS_783, new __VLS_783({
            color: "primary",
            size: "32",
            variant: "tonal",
        }));
        const __VLS_785 = __VLS_784({
            color: "primary",
            size: "32",
            variant: "tonal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_784));
        const { default: __VLS_787 } = __VLS_786.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-caption font-weight-bold" },
        });
        var __VLS_786;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-grow-1" },
        });
        const __VLS_788 = {}.VTextarea;
        /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
        // @ts-ignore
        VTextarea;
        // @ts-ignore
        const __VLS_789 = __VLS_asFunctionalComponent(__VLS_788, new __VLS_788({
            modelValue: (__VLS_ctx.newComment),
            placeholder: "Write a message...",
            variant: "outlined",
            density: "compact",
            rows: "2",
            hideDetails: true,
            ...{ class: "mb-2" },
        }));
        const __VLS_790 = __VLS_789({
            modelValue: (__VLS_ctx.newComment),
            placeholder: "Write a message...",
            variant: "outlined",
            density: "compact",
            rows: "2",
            hideDetails: true,
            ...{ class: "mb-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_789));
        // @ts-ignore
        [newComment,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex justify-end ga-2" },
        });
        const __VLS_793 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_794 = __VLS_asFunctionalComponent(__VLS_793, new __VLS_793({
            ...{ 'onClick': {} },
            size: "small",
            variant: "text",
            color: "grey",
        }));
        const __VLS_795 = __VLS_794({
            ...{ 'onClick': {} },
            size: "small",
            variant: "text",
            color: "grey",
        }, ...__VLS_functionalComponentArgsRest(__VLS_794));
        let __VLS_797;
        let __VLS_798;
        const __VLS_799 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selected === 'submissions'))
                        return;
                    if (!!(!__VLS_ctx.selectedSubmission))
                        return;
                    __VLS_ctx.newComment = '';
                    // @ts-ignore
                    [newComment,];
                } });
        const { default: __VLS_800 } = __VLS_796.slots;
        var __VLS_796;
        const __VLS_801 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_802 = __VLS_asFunctionalComponent(__VLS_801, new __VLS_801({
            ...{ 'onClick': {} },
            size: "small",
            color: "primary",
            rounded: "lg",
            disabled: (!__VLS_ctx.newComment.trim()),
        }));
        const __VLS_803 = __VLS_802({
            ...{ 'onClick': {} },
            size: "small",
            color: "primary",
            rounded: "lg",
            disabled: (!__VLS_ctx.newComment.trim()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_802));
        let __VLS_805;
        let __VLS_806;
        const __VLS_807 = ({ click: {} },
            { onClick: (__VLS_ctx.postComment) });
        const { default: __VLS_808 } = __VLS_804.slots;
        // @ts-ignore
        [newComment, postComment,];
        var __VLS_804;
        var __VLS_761;
        var __VLS_746;
    }
    var __VLS_696;
    var __VLS_616;
}
if (__VLS_ctx.selected === 'settings') {
    // @ts-ignore
    [selected,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-h4 font-weight-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mt-1" },
    });
    const __VLS_809 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_810 = __VLS_asFunctionalComponent(__VLS_809, new __VLS_809({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6" },
    }));
    const __VLS_811 = __VLS_810({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_810));
    const { default: __VLS_813 } = __VLS_812.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis" },
    });
    var __VLS_812;
}
var __VLS_47;
var __VLS_42;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-8']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
