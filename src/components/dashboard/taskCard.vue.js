const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});
const badgeColor = (() => {
    const d = props.task.daysUntilDue;
    if (d === 'overdue')
        return 'error';
    if (typeof d === 'number') {
        if (d <= 1)
            return 'error'; // red
        if (d <= 5)
            return 'warning'; // yellow/amber
        if (d <= 7)
            return 'success'; // green
    }
    return 'info'; // blue
})();
const dueLabel = (() => {
    const d = props.task.daysUntilDue;
    if (d === 'overdue')
        return 'Overdue';
    return `Due in ${d} day${d === 1 ? '' : 's'}`;
})();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    rounded: "lg",
    elevation: "1",
    ...{ class: "mb-2" },
}));
const __VLS_2 = __VLS_1({
    rounded: "lg",
    elevation: "1",
    ...{ class: "mb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    ...{ class: "d-flex align-center justify-space-between pa-3" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "d-flex align-center justify-space-between pa-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex flex-column ga-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-body-2 font-weight-bold font-italic" },
});
(__VLS_ctx.task.title);
// @ts-ignore
[task,];
const __VLS_11 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
VChip;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    color: (__VLS_ctx.badgeColor),
    size: "small",
    label: true,
    variant: "flat",
}));
const __VLS_13 = __VLS_12({
    color: (__VLS_ctx.badgeColor),
    size: "small",
    label: true,
    variant: "flat",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
// @ts-ignore
[badgeColor,];
(__VLS_ctx.dueLabel);
// @ts-ignore
[dueLabel,];
var __VLS_14;
const __VLS_16 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "ml-2" },
    icon: "mdi-arrow-right",
    variant: "outlined",
    size: "small",
    color: "grey-darken-3",
    'aria-label': "View task",
}));
const __VLS_18 = __VLS_17({
    ...{ class: "ml-2" },
    icon: "mdi-arrow-right",
    variant: "outlined",
    size: "small",
    color: "grey-darken-3",
    'aria-label': "View task",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-italic']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => ({
        ...props,
        ...{},
    }),
});
export default {};
