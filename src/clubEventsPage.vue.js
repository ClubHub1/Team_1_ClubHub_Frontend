import { ref, reactive } from 'vue';
import { feathersClient } from '@/backendAPI';
import useClubStore from '@/stores/clubStore';
const clubStore = useClubStore();
const loading = ref(false);
const error = ref('');
const success = ref(false);
const valid = ref(false);
const formRef = ref();
const eventForm = reactive({
    title: '',
    datetime: '',
    location: '',
    description: ''
});
const titleRules = [(v) => !!v || 'Title is required.'];
const dateRules = [(v) => !!v || 'Date and time is required.'];
const locationRules = [(v) => !!v || 'Location is required.'];
async function saveEvent() {
    const { valid: isValid } = await formRef.value.validate();
    if (!isValid)
        return;
    loading.value = true;
    error.value = '';
    success.value = false;
    try {
        await feathersClient.service('Event').create({
            club: clubStore.id,
            name: eventForm.title,
            start_datetime: eventForm.datetime,
            end_datetime: eventForm.datetime,
            location: eventForm.location,
            description: eventForm.description,
            created_at: new Date(),
        });
        success.value = true;
        Object.assign(eventForm, { title: '', datetime: '', location: '', description: '' });
        formRef.value.reset();
    }
    catch (err) {
        error.value = err.message ?? 'Something went wrong. Please try again.';
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
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
    elevation: "2",
    rounded: "lg",
}));
const __VLS_2 = __VLS_1({
    elevation: "2",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    ...{ class: "pa-6" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "pa-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
if (__VLS_ctx.success) {
    // @ts-ignore
    [success,];
    const __VLS_11 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        ...{ 'onClick:close': {} },
        type: "success",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        closable: true,
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick:close': {} },
        type: "success",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        closable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = ({ 'click:close': {} },
        { 'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.success))
                    return;
                __VLS_ctx.success = false;
                // @ts-ignore
                [success,];
            } });
    const { default: __VLS_18 } = __VLS_14.slots;
    const __VLS_19 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        start: true,
    }));
    const __VLS_21 = __VLS_20({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_23 } = __VLS_22.slots;
    var __VLS_22;
    var __VLS_14;
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    const __VLS_24 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
    }));
    const __VLS_26 = __VLS_25({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_28 } = __VLS_27.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_27;
}
const __VLS_29 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
VForm;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    modelValue: (__VLS_ctx.valid),
}));
const __VLS_31 = __VLS_30({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    modelValue: (__VLS_ctx.valid),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
const __VLS_35 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.saveEvent) });
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_36 = {};
const { default: __VLS_38 } = __VLS_32.slots;
// @ts-ignore
[valid, saveEvent, formRef,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-3" },
});
const __VLS_39 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.eventForm.title),
    rules: (__VLS_ctx.titleRules),
    label: "Event Title",
    prependInnerIcon: "mdi-format-title",
    variant: "outlined",
    ...{ class: "mb-3" },
    required: true,
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.eventForm.title),
    rules: (__VLS_ctx.titleRules),
    label: "Event Title",
    prependInnerIcon: "mdi-format-title",
    variant: "outlined",
    ...{ class: "mb-3" },
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
// @ts-ignore
[eventForm, titleRules,];
const __VLS_44 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_48 } = __VLS_47.slots;
const __VLS_49 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    cols: "12",
    sm: "6",
}));
const __VLS_51 = __VLS_50({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_53 } = __VLS_52.slots;
const __VLS_54 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    modelValue: (__VLS_ctx.eventForm.datetime),
    rules: (__VLS_ctx.dateRules),
    label: "Date and Time",
    type: "datetime-local",
    prependInnerIcon: "mdi-calendar-clock",
    variant: "outlined",
    required: true,
}));
const __VLS_56 = __VLS_55({
    modelValue: (__VLS_ctx.eventForm.datetime),
    rules: (__VLS_ctx.dateRules),
    label: "Date and Time",
    type: "datetime-local",
    prependInnerIcon: "mdi-calendar-clock",
    variant: "outlined",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
// @ts-ignore
[eventForm, dateRules,];
var __VLS_52;
const __VLS_59 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    cols: "12",
    sm: "6",
}));
const __VLS_61 = __VLS_60({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_63 } = __VLS_62.slots;
const __VLS_64 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.eventForm.location),
    rules: (__VLS_ctx.locationRules),
    label: "Location",
    prependInnerIcon: "mdi-map-marker",
    variant: "outlined",
    required: true,
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.eventForm.location),
    rules: (__VLS_ctx.locationRules),
    label: "Location",
    prependInnerIcon: "mdi-map-marker",
    variant: "outlined",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
// @ts-ignore
[eventForm, locationRules,];
var __VLS_62;
var __VLS_47;
const __VLS_69 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ class: "my-4" },
}));
const __VLS_71 = __VLS_70({
    ...{ class: "my-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-3" },
});
const __VLS_74 = {}.VTextarea;
/** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
// @ts-ignore
VTextarea;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    modelValue: (__VLS_ctx.eventForm.description),
    label: "Event description (optional)",
    prependInnerIcon: "mdi-text-box",
    variant: "outlined",
    rows: "4",
}));
const __VLS_76 = __VLS_75({
    modelValue: (__VLS_ctx.eventForm.description),
    label: "Event description (optional)",
    prependInnerIcon: "mdi-text-box",
    variant: "outlined",
    rows: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
// @ts-ignore
[eventForm,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex justify-end gap-3 mt-4" },
});
const __VLS_79 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    ...{ 'onClick': {} },
    variant: "outlined",
    color: "secondary",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_81 = __VLS_80({
    ...{ 'onClick': {} },
    variant: "outlined",
    color: "secondary",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_83;
let __VLS_84;
const __VLS_85 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.formRef?.reset();
            // @ts-ignore
            [formRef, loading,];
        } });
const { default: __VLS_86 } = __VLS_82.slots;
var __VLS_82;
const __VLS_87 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    type: "submit",
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.loading),
    prependIcon: "mdi-calendar-plus",
}));
const __VLS_89 = __VLS_88({
    type: "submit",
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.loading),
    prependIcon: "mdi-calendar-plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_91 } = __VLS_90.slots;
// @ts-ignore
[loading,];
var __VLS_90;
var __VLS_32;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
// @ts-ignore
var __VLS_37 = __VLS_36;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
