import DashboardLayout from '@/components/dashboard/dashboardLayout.vue';
import DashboardGrid from '@/components/dashboard/dashboardGrid.vue';
import DashboardSection from '@/components/dashboard/dashboardSection.vue';
import EventList from '@/components/dashboard/eventList.vue';
import TaskList from '@/components/dashboard/taskList.vue';
import NotificationList from '@/components/dashboard/notificationList.vue';
import useUserStore from './stores/user';
const userStore = useUserStore();
const name = userStore.firstName;
const currentDate = new Date();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VMain;
/** @type {[typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ]} */ ;
// @ts-ignore
VMain;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
VContainer;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    maxWidth: "1200",
    ...{ class: "py-8" },
}));
const __VLS_8 = __VLS_7({
    maxWidth: "1200",
    ...{ class: "py-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-h4 font-weight-bold" },
});
(__VLS_ctx.name);
// @ts-ignore
[name,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-medium-emphasis mt-1" },
});
const __VLS_11 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
VChip;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    color: "primary",
    variant: "tonal",
    size: "large",
    rounded: "lg",
    ...{ class: "px-5 font-weight-medium" },
}));
const __VLS_13 = __VLS_12({
    color: "primary",
    variant: "tonal",
    size: "large",
    rounded: "lg",
    ...{ class: "px-5 font-weight-medium" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
(__VLS_ctx.currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }));
// @ts-ignore
[currentDate,];
var __VLS_14;
const __VLS_16 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "mb-6" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_21 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-6" },
}));
const __VLS_23 = __VLS_22({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_25 } = __VLS_24.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center gap-4" },
});
const __VLS_26 = {}.VAvatar;
/** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
// @ts-ignore
VAvatar;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    color: "primary",
    variant: "tonal",
    size: "40",
}));
const __VLS_28 = __VLS_27({
    color: "primary",
    variant: "tonal",
    size: "40",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
const __VLS_31 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    color: "primary",
}));
const __VLS_33 = __VLS_32({
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_35 } = __VLS_34.slots;
var __VLS_34;
var __VLS_29;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-grow-1 ml-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "font-weight-medium ma-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-caption text-medium-emphasis ma-0" },
});
const __VLS_36 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    color: "primary",
    variant: "flat",
    rounded: "lg",
    size: "small",
    prependIcon: "mdi-arrow-right",
    to: "/clubsList",
}));
const __VLS_38 = __VLS_37({
    color: "primary",
    variant: "flat",
    rounded: "lg",
    size: "small",
    prependIcon: "mdi-arrow-right",
    to: "/clubsList",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_40 } = __VLS_39.slots;
var __VLS_39;
var __VLS_24;
/** @type {[typeof DashboardLayout, typeof DashboardLayout, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(DashboardLayout, new DashboardLayout({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_44 } = __VLS_43.slots;
const __VLS_45 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_49 } = __VLS_48.slots;
/** @type {[typeof DashboardGrid, typeof DashboardGrid, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(DashboardGrid, new DashboardGrid({}));
const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_53 } = __VLS_52.slots;
/** @type {[typeof DashboardSection, typeof DashboardSection, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(DashboardSection, new DashboardSection({
    title: "Upcoming Events",
    md: (4),
}));
const __VLS_55 = __VLS_54({
    title: "Upcoming Events",
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_57 } = __VLS_56.slots;
/** @type {[typeof EventList, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(EventList, new EventList({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
var __VLS_56;
/** @type {[typeof DashboardSection, typeof DashboardSection, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(DashboardSection, new DashboardSection({
    title: "Tasks",
    md: (4),
}));
const __VLS_63 = __VLS_62({
    title: "Tasks",
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_65 } = __VLS_64.slots;
/** @type {[typeof TaskList, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(TaskList, new TaskList({}));
const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
var __VLS_64;
/** @type {[typeof DashboardSection, typeof DashboardSection, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(DashboardSection, new DashboardSection({
    title: "Notifications",
    md: (4),
}));
const __VLS_71 = __VLS_70({
    title: "Notifications",
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_73 } = __VLS_72.slots;
/** @type {[typeof NotificationList, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(NotificationList, new NotificationList({}));
const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
var __VLS_72;
var __VLS_52;
var __VLS_48;
var __VLS_43;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
