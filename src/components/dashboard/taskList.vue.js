import { ref, onMounted } from 'vue';
import TaskCard from './taskCard.vue';
import EmptyState from '@/components/dashboard/emptyState.vue';
import { getTasks } from '@/services/tasks';
const tasks = ref([]);
const loading = ref(false);
const error = ref('');
const fetchTasks = async () => {
    loading.value = true;
    error.value = '';
    try {
        tasks.value = await getTasks();
    }
    catch (e) {
        error.value = 'Failed to load tasks.';
        console.error('Error fetching tasks:', e);
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    fetchTasks();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "error" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [task] of __VLS_getVForSourceType((__VLS_ctx.tasks))) {
        // @ts-ignore
        [tasks,];
        /** @type {[typeof TaskCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(TaskCard, new TaskCard({
            key: (task.id),
            task: (task),
        }));
        const __VLS_1 = __VLS_0({
            key: (task.id),
            task: (task),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
    if (__VLS_ctx.tasks.length === 0) {
        // @ts-ignore
        [tasks,];
        /** @type {[typeof EmptyState, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
            message: "No tasks available. Add a new task to get started!",
        }));
        const __VLS_5 = __VLS_4({
            message: "No tasks available. Add a new task to get started!",
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    }
}
/** @type {__VLS_StyleScopedClasses['error']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
