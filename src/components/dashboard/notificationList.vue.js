import NotificationCard from '@/components/dashboard/notificationCard.vue';
import EmptyState from '@/components/dashboard/emptyState.vue';
// MOCK DATA - replace with API call
const notifications = [
    { id: 1, message: 'Welcome Night is about to start!', date: '2024-09-01', read: false },
    { id: 2, message: 'RSVP for the upcoming workshop!', date: '2024-08-30', read: true },
    { id: 3, message: 'Dues are due on 9/30!', date: '2024-08-28', read: false },
    { id: 4, message: 'New Event: Social @ 9/10', date: '2024-08-25', read: true },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
for (const [notification] of __VLS_getVForSourceType((__VLS_ctx.notifications))) {
    // @ts-ignore
    [notifications,];
    /** @type {[typeof NotificationCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(NotificationCard, new NotificationCard({
        key: (notification.id),
        notification: (notification),
    }));
    const __VLS_1 = __VLS_0({
        key: (notification.id),
        notification: (notification),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
if (__VLS_ctx.notifications.length === 0) {
    // @ts-ignore
    [notifications,];
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        message: "No new notifications at the moment.",
    }));
    const __VLS_5 = __VLS_4({
        message: "No new notifications at the moment.",
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
}
const __VLS_8 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    variant: "flat",
    color: "primary",
    size: "small",
    rounded: "md",
    ...{ class: "mt-2" },
}));
const __VLS_10 = __VLS_9({
    variant: "flat",
    color: "primary",
    size: "small",
    rounded: "md",
    ...{ class: "mt-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_12 } = __VLS_11.slots;
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
