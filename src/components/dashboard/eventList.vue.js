import { ref, onMounted } from 'vue';
import { feathersClient } from '@/backendAPI';
import useClubStore from '@/stores/clubStore';
import EventCard from '@/components/dashboard/eventCard.vue';
import EmptyState from '@/components/dashboard/emptyState.vue';
const clubStore = useClubStore();
const events = ref([]);
const loading = ref(false);
const error = ref('');
onMounted(async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await feathersClient.service('Event').find({
            query: {
                club: clubStore.id,
                start_datetime: { $gte: new Date().toISOString() },
                $sort: { start_datetime: 1 },
                $limit: 5
            }
        });
        events.value = res.data ?? [];
    }
    catch (e) {
        error.value = 'Failed to load events.';
        console.error('EVENT LIST ERROR:', e);
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "eventList" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-error text-body-2" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [event] of __VLS_getVForSourceType((__VLS_ctx.events))) {
        // @ts-ignore
        [events,];
        /** @type {[typeof EventCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(EventCard, new EventCard({
            key: (event.event_id),
            clubEvent: (event),
        }));
        const __VLS_1 = __VLS_0({
            key: (event.event_id),
            clubEvent: (event),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
    if (__VLS_ctx.events.length === 0) {
        // @ts-ignore
        [events,];
        /** @type {[typeof EmptyState, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
            message: "No upcoming events. Stay tuned for updates!",
        }));
        const __VLS_5 = __VLS_4({
            message: "No upcoming events. Stay tuned for updates!",
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    }
}
/** @type {__VLS_StyleScopedClasses['eventList']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
