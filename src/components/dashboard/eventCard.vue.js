const __VLS_props = defineProps({
    clubEvent: {
        type: Object,
        required: true
    }
});
function formatDatetime(iso) {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}
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
    color: "grey-lighten-2",
    rounded: "lg",
    elevation: "0",
    ...{ class: "mb-2" },
}));
const __VLS_2 = __VLS_1({
    color: "grey-lighten-2",
    rounded: "lg",
    elevation: "0",
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
    ...{ class: "d-flex flex-column ga-2 pa-3" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "d-flex flex-column ga-2 pa-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-body-1 font-weight-bold" },
});
(__VLS_ctx.clubEvent.name);
// @ts-ignore
[clubEvent,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center ga-1 text-body-2 text-medium-emphasis" },
});
const __VLS_11 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    icon: "mdi-clock-outline",
    size: "14",
}));
const __VLS_13 = __VLS_12({
    icon: "mdi-clock-outline",
    size: "14",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
(__VLS_ctx.formatDatetime(__VLS_ctx.clubEvent.start_datetime));
// @ts-ignore
[clubEvent, formatDatetime,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center ga-1 text-body-2 text-medium-emphasis" },
});
const __VLS_16 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    icon: "mdi-map-marker-outline",
    size: "14",
}));
const __VLS_18 = __VLS_17({
    icon: "mdi-map-marker-outline",
    size: "14",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
(__VLS_ctx.clubEvent.location || '—');
// @ts-ignore
[clubEvent,];
const __VLS_21 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    variant: "flat",
    color: "grey-darken-3",
    size: "small",
    rounded: "sm",
    ...{ class: "align-self-start" },
}));
const __VLS_23 = __VLS_22({
    variant: "flat",
    color: "grey-darken-3",
    size: "small",
    rounded: "sm",
    ...{ class: "align-self-start" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_25 } = __VLS_24.slots;
var __VLS_24;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['align-self-start']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => ({
        ...__VLS_props,
        ...{},
    }),
});
export default {};
