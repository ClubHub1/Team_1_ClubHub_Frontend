const __VLS_props = defineProps({
    title: String,
    actionText: String,
    // col width at each breakpoint — defaults match the 3-column layout
    cols: { type: [String, Number], default: 12 },
    sm: { type: [String, Number], default: 12 },
    md: { type: [String, Number], default: 4 },
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    cols: (__VLS_ctx.cols),
    sm: (__VLS_ctx.sm),
    md: (__VLS_ctx.md),
}));
const __VLS_2 = __VLS_1({
    cols: (__VLS_ctx.cols),
    sm: (__VLS_ctx.sm),
    md: (__VLS_ctx.md),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
// @ts-ignore
[cols, sm, md,];
const __VLS_6 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    rounded: "lg",
    elevation: "0",
    color: "grey-lighten-3",
}));
const __VLS_8 = __VLS_7({
    rounded: "lg",
    elevation: "0",
    color: "grey-lighten-3",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
const __VLS_11 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    ...{ class: "d-flex align-center justify-space-between pt-4 px-4 pb-2" },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "d-flex align-center justify-space-between pt-4 px-4 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-subtitle-1 font-weight-bold" },
});
(__VLS_ctx.title);
// @ts-ignore
[title,];
if (__VLS_ctx.actionText) {
    // @ts-ignore
    [actionText,];
    const __VLS_16 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        variant: "outlined",
        size: "small",
        density: "comfortable",
    }));
    const __VLS_18 = __VLS_17({
        variant: "outlined",
        size: "small",
        density: "comfortable",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    const { default: __VLS_20 } = __VLS_19.slots;
    (__VLS_ctx.actionText);
    // @ts-ignore
    [actionText,];
    var __VLS_19;
}
var __VLS_14;
const __VLS_21 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: "px-3 pb-3" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "px-3 pb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_25 } = __VLS_24.slots;
var __VLS_26 = {};
var __VLS_24;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
// @ts-ignore
var __VLS_27 = __VLS_26;
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => ({
        ...__VLS_props,
        ...{},
    }),
});
const __VLS_export = {};
export default {};
