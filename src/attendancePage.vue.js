import { ref, computed, onMounted } from 'vue';
import { feathersClient } from '@/backendAPI';
import useClubStore from '@/stores/clubStore';
import useUserStore from '@/stores/user';
import useMemberStore from '@/stores/memberStore';
const clubStore = useClubStore();
const userStore = useUserStore();
const memberStore = useMemberStore();
const officerRoles = ['president', 'vice_pres', 'treasurer', 'secretary', 'officer', 'advisor',
    'President', 'Vice President', 'Treasurer', 'Secretary', 'Advisor'];
const isOfficer = computed(() => officerRoles.map(r => r.toLowerCase()).includes(memberStore.role.toLowerCase()));
const events = ref([]);
const selectedEvent = ref(null);
async function loadEvents() {
    try {
        const res = await feathersClient.service('Event').find({
            query: { club: clubStore.id, $limit: 50, $select: ['id', 'name', 'code'] }
        });
        events.value = res.data;
    }
    catch (e) {
        console.error('Failed to load events', e);
    }
}
// Member view
const enteredCode = ref('');
const codeLoading = ref(false);
const codeError = ref('');
const codeSuccess = ref(false);
async function submitCode() {
    if (!enteredCode.value.trim())
        return;
    codeLoading.value = true;
    codeError.value = '';
    codeSuccess.value = false;
    try {
        const res = await feathersClient.service('Event').find({
            query: { club: clubStore.id, code: String(enteredCode.value).trim(), $limit: 1 }
        });
        if (!res.data.length) {
            codeError.value = 'Invalid code. Please check with your officer.';
            return;
        }
        const event = res.data[0];
        await feathersClient.service('Attendance').create({
            event: event.id, user: userStore.id, status: 'present', time: new Date().toISOString()
        });
        codeSuccess.value = true;
        enteredCode.value = '';
    }
    catch (err) {
        codeError.value = err.message ?? 'Something went wrong. Please try again.';
    }
    finally {
        codeLoading.value = false;
    }
}
// Officer view
const generatedCode = ref('');
const generateLoading = ref(false);
const generateError = ref('');
const codeCopied = ref(false);
function makeCode() { return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join(''); }
async function generateCode() {
    if (!selectedEvent.value)
        return;
    generateLoading.value = true;
    generateError.value = '';
    generatedCode.value = '';
    try {
        const code = makeCode();
        await feathersClient.service('Event').patch(selectedEvent.value.id, { code });
        generatedCode.value = code;
        selectedEvent.value.code = code;
    }
    catch (err) {
        generateError.value = err.message ?? 'Failed to generate code.';
    }
    finally {
        generateLoading.value = false;
    }
}
function copyCode() {
    if (!generatedCode.value)
        return;
    navigator.clipboard.writeText(generatedCode.value);
    codeCopied.value = true;
    setTimeout(() => { codeCopied.value = false; }, 2000);
}
// Manual add
const manualDialog = ref(false);
const manualEmail = ref('');
const manualLoading = ref(false);
const manualError = ref('');
const manualSuccess = ref(false);
async function addManually() {
    if (!selectedEvent.value)
        return;
    manualLoading.value = true;
    manualError.value = '';
    manualSuccess.value = false;
    try {
        const res = await feathersClient.service('User').find({ query: { email: manualEmail.value.trim(), $limit: 1 } });
        if (!res.data.length) {
            manualError.value = 'No user found with that email address.';
            return;
        }
        const user = res.data[0];
        await feathersClient.service('Attendance').create({
            event: selectedEvent.value.id, user: user.id, status: 'present', time: new Date().toISOString()
        });
        manualSuccess.value = true;
        manualEmail.value = '';
    }
    catch (err) {
        manualError.value = err.message ?? 'Failed to add attendance record.';
    }
    finally {
        manualLoading.value = false;
    }
}
function closeManualDialog() { manualDialog.value = false; manualError.value = ''; manualSuccess.value = false; manualEmail.value = ''; }
onMounted(loadEvents);
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
const { default: __VLS_4 } = __VLS_3.slots;
const __VLS_5 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "pa-6" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "pa-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
if (!__VLS_ctx.isOfficer) {
    // @ts-ignore
    [isOfficer,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-5" },
    });
    if (__VLS_ctx.codeSuccess) {
        // @ts-ignore
        [codeSuccess,];
        const __VLS_10 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
            ...{ 'onClick:close': {} },
            type: "success",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
            closable: true,
        }));
        const __VLS_12 = __VLS_11({
            ...{ 'onClick:close': {} },
            type: "success",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        let __VLS_14;
        let __VLS_15;
        const __VLS_16 = ({ 'click:close': {} },
            { 'onClick:close': (...[$event]) => {
                    if (!(!__VLS_ctx.isOfficer))
                        return;
                    if (!(__VLS_ctx.codeSuccess))
                        return;
                    __VLS_ctx.codeSuccess = false;
                    // @ts-ignore
                    [codeSuccess,];
                } });
        const { default: __VLS_17 } = __VLS_13.slots;
        const __VLS_18 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
            start: true,
        }));
        const __VLS_20 = __VLS_19({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        const { default: __VLS_22 } = __VLS_21.slots;
        var __VLS_21;
        var __VLS_13;
    }
    if (__VLS_ctx.codeError) {
        // @ts-ignore
        [codeError,];
        const __VLS_23 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }));
        const __VLS_25 = __VLS_24({
            type: "error",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        const { default: __VLS_27 } = __VLS_26.slots;
        (__VLS_ctx.codeError);
        // @ts-ignore
        [codeError,];
        var __VLS_26;
    }
    const __VLS_28 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onSubmit': {} },
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onSubmit': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    const __VLS_34 = ({ submit: {} },
        { onSubmit: (__VLS_ctx.submitCode) });
    const { default: __VLS_35 } = __VLS_31.slots;
    // @ts-ignore
    [submitCode,];
    const __VLS_36 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        modelValue: (__VLS_ctx.enteredCode),
        label: "Attendance Code",
        placeholder: "e.g. 1234",
        maxlength: "4",
        counter: "4",
        type: "number",
        prependInnerIcon: "mdi-key-variant",
        variant: "outlined",
        ...{ style: {} },
        disabled: (__VLS_ctx.codeLoading),
        ...{ class: "mb-4" },
    }));
    const __VLS_38 = __VLS_37({
        modelValue: (__VLS_ctx.enteredCode),
        label: "Attendance Code",
        placeholder: "e.g. 1234",
        maxlength: "4",
        counter: "4",
        type: "number",
        prependInnerIcon: "mdi-key-variant",
        variant: "outlined",
        ...{ style: {} },
        disabled: (__VLS_ctx.codeLoading),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    // @ts-ignore
    [enteredCode, codeLoading,];
    const __VLS_41 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        type: "submit",
        color: "primary",
        rounded: "lg",
        loading: (__VLS_ctx.codeLoading),
        disabled: (String(__VLS_ctx.enteredCode).length < 4),
        prependIcon: "mdi-send",
    }));
    const __VLS_43 = __VLS_42({
        type: "submit",
        color: "primary",
        rounded: "lg",
        loading: (__VLS_ctx.codeLoading),
        disabled: (String(__VLS_ctx.enteredCode).length < 4),
        prependIcon: "mdi-send",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_45 } = __VLS_44.slots;
    // @ts-ignore
    [enteredCode, codeLoading,];
    var __VLS_44;
    var __VLS_31;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_46 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    VSelect;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
        modelValue: (__VLS_ctx.selectedEvent),
        items: (__VLS_ctx.events),
        itemTitle: "name",
        itemValue: "id",
        returnObject: true,
        label: "Choose Event",
        prependInnerIcon: "mdi-calendar",
        variant: "outlined",
        ...{ style: {} },
        ...{ class: "mb-6" },
        clearable: true,
    }));
    const __VLS_48 = __VLS_47({
        modelValue: (__VLS_ctx.selectedEvent),
        items: (__VLS_ctx.events),
        itemTitle: "name",
        itemValue: "id",
        returnObject: true,
        label: "Choose Event",
        prependInnerIcon: "mdi-calendar",
        variant: "outlined",
        ...{ style: {} },
        ...{ class: "mb-6" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [selectedEvent, events,];
    if (__VLS_ctx.selectedEvent) {
        // @ts-ignore
        [selectedEvent,];
        const __VLS_51 = {}.VDivider;
        /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
        // @ts-ignore
        VDivider;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            ...{ class: "mb-5" },
        }));
        const __VLS_53 = __VLS_52({
            ...{ class: "mb-5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-overline text-primary mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-body-2 text-medium-emphasis mb-4" },
        });
        if (__VLS_ctx.generateError) {
            // @ts-ignore
            [generateError,];
            const __VLS_56 = {}.VAlert;
            /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
            // @ts-ignore
            VAlert;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                type: "error",
                variant: "tonal",
                rounded: "lg",
                ...{ class: "mb-4" },
            }));
            const __VLS_58 = __VLS_57({
                type: "error",
                variant: "tonal",
                rounded: "lg",
                ...{ class: "mb-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            const { default: __VLS_60 } = __VLS_59.slots;
            (__VLS_ctx.generateError);
            // @ts-ignore
            [generateError,];
            var __VLS_59;
        }
        if (__VLS_ctx.generatedCode || __VLS_ctx.selectedEvent.code) {
            // @ts-ignore
            [selectedEvent, generatedCode,];
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "d-flex align-center ga-3 mb-5" },
            });
            const __VLS_61 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            VChip;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
                size: "x-large",
                color: "primary",
                label: true,
                ...{ class: "text-h4 font-weight-bold px-8 py-5" },
            }));
            const __VLS_63 = __VLS_62({
                size: "x-large",
                color: "primary",
                label: true,
                ...{ class: "text-h4 font-weight-bold px-8 py-5" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            const { default: __VLS_65 } = __VLS_64.slots;
            (__VLS_ctx.generatedCode || __VLS_ctx.selectedEvent.code);
            // @ts-ignore
            [selectedEvent, generatedCode,];
            var __VLS_64;
            const __VLS_66 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            VBtn;
            // @ts-ignore
            const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
                ...{ 'onClick': {} },
                icon: (__VLS_ctx.codeCopied ? 'mdi-check' : 'mdi-content-copy'),
                variant: "tonal",
                color: (__VLS_ctx.codeCopied ? 'success' : 'primary'),
            }));
            const __VLS_68 = __VLS_67({
                ...{ 'onClick': {} },
                icon: (__VLS_ctx.codeCopied ? 'mdi-check' : 'mdi-content-copy'),
                variant: "tonal",
                color: (__VLS_ctx.codeCopied ? 'success' : 'primary'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_67));
            let __VLS_70;
            let __VLS_71;
            const __VLS_72 = ({ click: {} },
                { onClick: (__VLS_ctx.copyCode) });
            // @ts-ignore
            [codeCopied, codeCopied, copyCode,];
            var __VLS_69;
        }
        const __VLS_74 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
            ...{ 'onClick': {} },
            color: "primary",
            variant: "outlined",
            rounded: "lg",
            prependIcon: "mdi-refresh",
            loading: (__VLS_ctx.generateLoading),
            ...{ class: "mb-8" },
        }));
        const __VLS_76 = __VLS_75({
            ...{ 'onClick': {} },
            color: "primary",
            variant: "outlined",
            rounded: "lg",
            prependIcon: "mdi-refresh",
            loading: (__VLS_ctx.generateLoading),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        let __VLS_78;
        let __VLS_79;
        const __VLS_80 = ({ click: {} },
            { onClick: (__VLS_ctx.generateCode) });
        const { default: __VLS_81 } = __VLS_77.slots;
        // @ts-ignore
        [generateLoading, generateCode,];
        (__VLS_ctx.generatedCode || __VLS_ctx.selectedEvent.code ? 'Regenerate Code' : 'Generate Code');
        // @ts-ignore
        [selectedEvent, generatedCode,];
        var __VLS_77;
        const __VLS_82 = {}.VDivider;
        /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
        // @ts-ignore
        VDivider;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
            ...{ class: "mb-5" },
        }));
        const __VLS_84 = __VLS_83({
            ...{ class: "mb-5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-overline text-primary mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-body-2 text-medium-emphasis mb-4" },
        });
        const __VLS_87 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
            ...{ 'onClick': {} },
            color: "primary",
            variant: "outlined",
            rounded: "lg",
            prependIcon: "mdi-account-plus",
        }));
        const __VLS_89 = __VLS_88({
            ...{ 'onClick': {} },
            color: "primary",
            variant: "outlined",
            rounded: "lg",
            prependIcon: "mdi-account-plus",
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        let __VLS_91;
        let __VLS_92;
        const __VLS_93 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.isOfficer))
                        return;
                    if (!(__VLS_ctx.selectedEvent))
                        return;
                    __VLS_ctx.manualDialog = true;
                    // @ts-ignore
                    [manualDialog,];
                } });
        const { default: __VLS_94 } = __VLS_90.slots;
        var __VLS_90;
    }
    else {
        const __VLS_95 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
            type: "info",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mt-2" },
            ...{ style: {} },
        }));
        const __VLS_97 = __VLS_96({
            type: "info",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mt-2" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_96));
        const { default: __VLS_99 } = __VLS_98.slots;
        var __VLS_98;
    }
}
var __VLS_8;
var __VLS_3;
const __VLS_100 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
VDialog;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ 'onAfterLeave': {} },
    modelValue: (__VLS_ctx.manualDialog),
    maxWidth: "440",
}));
const __VLS_102 = __VLS_101({
    ...{ 'onAfterLeave': {} },
    modelValue: (__VLS_ctx.manualDialog),
    maxWidth: "440",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
const __VLS_106 = ({ afterLeave: {} },
    { onAfterLeave: (__VLS_ctx.closeManualDialog) });
const { default: __VLS_107 } = __VLS_103.slots;
// @ts-ignore
[manualDialog, closeManualDialog,];
const __VLS_108 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    rounded: "lg",
}));
const __VLS_110 = __VLS_109({
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_112 } = __VLS_111.slots;
const __VLS_113 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    ...{ class: "pa-5 pb-3" },
}));
const __VLS_115 = __VLS_114({
    ...{ class: "pa-5 pb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
const { default: __VLS_117 } = __VLS_116.slots;
const __VLS_118 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    start: true,
    color: "primary",
}));
const __VLS_120 = __VLS_119({
    start: true,
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_122 } = __VLS_121.slots;
var __VLS_121;
var __VLS_116;
const __VLS_123 = {}.VCardSubtitle;
/** @type {[typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ]} */ ;
// @ts-ignore
VCardSubtitle;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    ...{ class: "px-5 pb-3" },
}));
const __VLS_125 = __VLS_124({
    ...{ class: "px-5 pb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
const { default: __VLS_127 } = __VLS_126.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.selectedEvent?.name);
// @ts-ignore
[selectedEvent,];
var __VLS_126;
const __VLS_128 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_133 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    ...{ class: "pa-5" },
}));
const __VLS_135 = __VLS_134({
    ...{ class: "pa-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_137 } = __VLS_136.slots;
if (__VLS_ctx.manualSuccess) {
    // @ts-ignore
    [manualSuccess,];
    const __VLS_138 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        ...{ 'onClick:close': {} },
        type: "success",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        closable: true,
    }));
    const __VLS_140 = __VLS_139({
        ...{ 'onClick:close': {} },
        type: "success",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        closable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    let __VLS_142;
    let __VLS_143;
    const __VLS_144 = ({ 'click:close': {} },
        { 'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.manualSuccess))
                    return;
                __VLS_ctx.manualSuccess = false;
                // @ts-ignore
                [manualSuccess,];
            } });
    const { default: __VLS_145 } = __VLS_141.slots;
    var __VLS_141;
}
if (__VLS_ctx.manualError) {
    // @ts-ignore
    [manualError,];
    const __VLS_146 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }));
    const __VLS_148 = __VLS_147({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    const { default: __VLS_150 } = __VLS_149.slots;
    (__VLS_ctx.manualError);
    // @ts-ignore
    [manualError,];
    var __VLS_149;
}
const __VLS_151 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
VForm;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    ...{ 'onSubmit': {} },
}));
const __VLS_153 = __VLS_152({
    ...{ 'onSubmit': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
let __VLS_155;
let __VLS_156;
const __VLS_157 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.addManually) });
const { default: __VLS_158 } = __VLS_154.slots;
// @ts-ignore
[addManually,];
const __VLS_159 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    modelValue: (__VLS_ctx.manualEmail),
    label: "Member Email",
    type: "email",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    rules: ([(v) => !!v || 'Email is required.']),
    disabled: (__VLS_ctx.manualLoading),
}));
const __VLS_161 = __VLS_160({
    modelValue: (__VLS_ctx.manualEmail),
    label: "Member Email",
    type: "email",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    rules: ([(v) => !!v || 'Email is required.']),
    disabled: (__VLS_ctx.manualLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
// @ts-ignore
[manualEmail, manualLoading,];
var __VLS_154;
var __VLS_136;
const __VLS_164 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_169 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
VCardActions;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    ...{ class: "pa-4" },
}));
const __VLS_171 = __VLS_170({
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const { default: __VLS_173 } = __VLS_172.slots;
const __VLS_174 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    ...{ 'onClick': {} },
    variant: "text",
}));
const __VLS_176 = __VLS_175({
    ...{ 'onClick': {} },
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
let __VLS_178;
let __VLS_179;
const __VLS_180 = ({ click: {} },
    { onClick: (__VLS_ctx.closeManualDialog) });
const { default: __VLS_181 } = __VLS_177.slots;
// @ts-ignore
[closeManualDialog,];
var __VLS_177;
const __VLS_182 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
VSpacer;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({}));
const __VLS_184 = __VLS_183({}, ...__VLS_functionalComponentArgsRest(__VLS_183));
const __VLS_187 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    ...{ 'onClick': {} },
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.manualLoading),
    disabled: (!__VLS_ctx.manualEmail.trim()),
    prependIcon: "mdi-check",
}));
const __VLS_189 = __VLS_188({
    ...{ 'onClick': {} },
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.manualLoading),
    disabled: (!__VLS_ctx.manualEmail.trim()),
    prependIcon: "mdi-check",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
let __VLS_191;
let __VLS_192;
const __VLS_193 = ({ click: {} },
    { onClick: (__VLS_ctx.addManually) });
const { default: __VLS_194 } = __VLS_190.slots;
// @ts-ignore
[addManually, manualEmail, manualLoading,];
var __VLS_190;
var __VLS_172;
var __VLS_111;
var __VLS_103;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
