const __VLS_props = defineProps({
    notification: {
        type: Object,
        required: true
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
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
    elevation: "0",
    color: "grey-lighten-3",
    ...{ class: "mb-2" },
}));
const __VLS_2 = __VLS_1({
    rounded: "lg",
    elevation: "0",
    color: "grey-lighten-3",
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
    ...{ class: "d-flex align-center ga-3 pa-3" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "d-flex align-center ga-3 pa-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
const __VLS_11 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    icon: "mdi-close",
    variant: "outlined",
    size: "x-small",
    color: "grey-darken-3",
    'aria-label': "Dismiss notification",
    ...{ class: "flex-shrink-0" },
}));
const __VLS_13 = __VLS_12({
    icon: "mdi-close",
    variant: "outlined",
    size: "x-small",
    color: "grey-darken-3",
    'aria-label': "Dismiss notification",
    ...{ class: "flex-shrink-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-body-2" },
});
(__VLS_ctx.notification.message);
// @ts-ignore
[notification,];
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => ({
        ...__VLS_props,
        ...{},
    }),
});
export default {};
