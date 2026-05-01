import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { feathersClient } from './backendAPI';
import useUserStore from './stores/user';
const registerForm = ref(null);
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const error = ref('');
const loading = ref(false);
const valid = ref(false);
const showPassword = ref(false);
const first_name = ref('');
const last_name = ref('');
const new_email = ref('');
const new_password = ref('');
const rePassword = ref('');
const emailRules = [
    (v) => !!v || 'E-mail is required.',
    (v) => /^[a-z0-9._%+-]+@unr\.edu$/i.test(v) || 'Must be a valid UNR email (@unr.edu).',
];
const passwordRules = [
    (v) => !!v || 'Password is required.',
    (v) => v.length >= 8 || 'At least 8 characters.',
    (v) => /[A-Z]/.test(v) || 'At least 1 uppercase letter.',
    (v) => /\d/.test(v) || 'At least 1 number.',
    (v) => /[^A-Za-z0-9]/.test(v) || 'At least 1 special character.',
    (v) => v === rePassword.value || 'Passwords must match.',
];
const nameRules = [
    (v) => (!!v && v.length < 31) || 'Required, max 30 characters.',
];
function refreshPasswordRules() {
    registerForm.value?.validate();
}
async function handleSubmit() {
    if (!valid.value)
        return;
    error.value = '';
    loading.value = true;
    try {
        const now = new Date().toISOString();
        await feathersClient.service('User')._create({
            password: new_password.value,
            first_name: first_name.value,
            last_name: last_name.value,
            email: new_email.value,
            role: 'student',
            created_at: now,
        }).catch((err) => { error.value = err.message; });
        if (!error.value) {
            authStore.clearError();
            const loginRes = await authStore.authenticate({
                strategy: 'local',
                email: new_email.value,
                password: new_password.value,
            });
            if (loginRes) {
                userStore.setEmail(loginRes.User?.email);
                userStore.setId(loginRes.User?.id);
                userStore.setFirstName(loginRes.User?.first_name);
                userStore.setLastName(loginRes.User?.last_name);
            }
        }
    }
    catch (e) {
        // handled above
    }
    finally {
        loading.value = false;
        if (authStore.isAuthenticated)
            router.push('/dashboard');
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VApp;
/** @type {[typeof __VLS_components.VApp, typeof __VLS_components.vApp, typeof __VLS_components.VApp, typeof __VLS_components.vApp, ]} */ ;
// @ts-ignore
VApp;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = {}.VMain;
/** @type {[typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ]} */ ;
// @ts-ignore
VMain;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    ...{ style: {} },
}));
const __VLS_8 = __VLS_7({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
const __VLS_11 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
VContainer;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    ...{ class: "d-flex align-center justify-center py-10" },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "d-flex align-center justify-center py-10" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
const __VLS_16 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    justify: "center",
    align: "start",
    ...{ style: {} },
    noGutters: true,
}));
const __VLS_18 = __VLS_17({
    justify: "center",
    align: "start",
    ...{ style: {} },
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_20 } = __VLS_19.slots;
const __VLS_21 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    cols: "12",
    md: "5",
    ...{ class: "d-none d-md-flex" },
}));
const __VLS_23 = __VLS_22({
    cols: "12",
    md: "5",
    ...{ class: "d-none d-md-flex" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_25 } = __VLS_24.slots;
const __VLS_26 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    color: "primary",
    rounded: "lg",
    elevation: "0",
    ...{ class: "pa-10 d-flex flex-column justify-center" },
    ...{ style: {} },
}));
const __VLS_28 = __VLS_27({
    color: "primary",
    rounded: "lg",
    elevation: "0",
    ...{ class: "pa-10 d-flex flex-column justify-center" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
const __VLS_31 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    size: "48",
    color: "white",
    ...{ class: "mb-6" },
}));
const __VLS_33 = __VLS_32({
    size: "48",
    color: "white",
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_35 } = __VLS_34.slots;
var __VLS_34;
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-h3 font-weight-bold text-white mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-white" },
    ...{ style: {} },
});
var __VLS_29;
var __VLS_24;
const __VLS_36 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    cols: "12",
    md: "5",
}));
const __VLS_38 = __VLS_37({
    cols: "12",
    md: "5",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_40 } = __VLS_39.slots;
const __VLS_41 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-8" },
    ...{ style: {} },
}));
const __VLS_43 = __VLS_42({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-8" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_45 } = __VLS_44.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-h5 font-weight-bold mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-medium-emphasis" },
});
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    const __VLS_46 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }));
    const __VLS_48 = __VLS_47({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const { default: __VLS_50 } = __VLS_49.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_49;
}
const __VLS_51 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
VForm;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    ...{ 'onSubmit': {} },
    ref: "registerForm",
    modelValue: (__VLS_ctx.valid),
}));
const __VLS_53 = __VLS_52({
    ...{ 'onSubmit': {} },
    ref: "registerForm",
    modelValue: (__VLS_ctx.valid),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
const __VLS_57 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.handleSubmit) });
/** @type {typeof __VLS_ctx.registerForm} */ ;
var __VLS_58 = {};
const { default: __VLS_60 } = __VLS_54.slots;
// @ts-ignore
[valid, handleSubmit, registerForm,];
const __VLS_61 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    dense: true,
}));
const __VLS_63 = __VLS_62({
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_65 } = __VLS_64.slots;
const __VLS_66 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    cols: "6",
}));
const __VLS_68 = __VLS_67({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const { default: __VLS_70 } = __VLS_69.slots;
const __VLS_71 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    modelValue: (__VLS_ctx.first_name),
    rules: (__VLS_ctx.nameRules),
    label: "First Name",
    prependInnerIcon: "mdi-account",
    variant: "outlined",
    required: true,
}));
const __VLS_73 = __VLS_72({
    modelValue: (__VLS_ctx.first_name),
    rules: (__VLS_ctx.nameRules),
    label: "First Name",
    prependInnerIcon: "mdi-account",
    variant: "outlined",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
// @ts-ignore
[first_name, nameRules,];
var __VLS_69;
const __VLS_76 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    cols: "6",
}));
const __VLS_78 = __VLS_77({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const { default: __VLS_80 } = __VLS_79.slots;
const __VLS_81 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    modelValue: (__VLS_ctx.last_name),
    rules: (__VLS_ctx.nameRules),
    label: "Last Name",
    variant: "outlined",
    required: true,
}));
const __VLS_83 = __VLS_82({
    modelValue: (__VLS_ctx.last_name),
    rules: (__VLS_ctx.nameRules),
    label: "Last Name",
    variant: "outlined",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
// @ts-ignore
[nameRules, last_name,];
var __VLS_79;
var __VLS_64;
const __VLS_86 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.new_email),
    rules: (__VLS_ctx.emailRules),
    label: "UNR Email",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    ...{ class: "mb-3" },
    required: true,
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.new_email),
    rules: (__VLS_ctx.emailRules),
    label: "UNR Email",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    ...{ class: "mb-3" },
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
// @ts-ignore
[new_email, emailRules,];
const __VLS_91 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    ...{ 'onClick:appendInner': {} },
    modelValue: (__VLS_ctx.new_password),
    rules: (__VLS_ctx.passwordRules),
    label: "Password",
    prependInnerIcon: "mdi-lock-outline",
    appendInnerIcon: (__VLS_ctx.showPassword ? 'mdi-eye-off' : 'mdi-eye'),
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    variant: "outlined",
    hint: "8+ chars, 1 uppercase, 1 number, 1 special character",
    persistentHint: true,
    ...{ class: "mb-3" },
    required: true,
}));
const __VLS_93 = __VLS_92({
    ...{ 'onClick:appendInner': {} },
    modelValue: (__VLS_ctx.new_password),
    rules: (__VLS_ctx.passwordRules),
    label: "Password",
    prependInnerIcon: "mdi-lock-outline",
    appendInnerIcon: (__VLS_ctx.showPassword ? 'mdi-eye-off' : 'mdi-eye'),
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    variant: "outlined",
    hint: "8+ chars, 1 uppercase, 1 number, 1 special character",
    persistentHint: true,
    ...{ class: "mb-3" },
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
let __VLS_95;
let __VLS_96;
const __VLS_97 = ({ 'click:appendInner': {} },
    { 'onClick:appendInner': (...[$event]) => {
            __VLS_ctx.showPassword = !__VLS_ctx.showPassword;
            // @ts-ignore
            [new_password, passwordRules, showPassword, showPassword, showPassword, showPassword,];
        } });
var __VLS_94;
const __VLS_99 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.rePassword),
    rules: (__VLS_ctx.passwordRules),
    label: "Confirm Password",
    prependInnerIcon: "mdi-lock-check-outline",
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    variant: "outlined",
    ...{ class: "mb-5" },
    required: true,
}));
const __VLS_101 = __VLS_100({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.rePassword),
    rules: (__VLS_ctx.passwordRules),
    label: "Confirm Password",
    prependInnerIcon: "mdi-lock-check-outline",
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    variant: "outlined",
    ...{ class: "mb-5" },
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_103;
let __VLS_104;
const __VLS_105 = ({ input: {} },
    { onInput: (__VLS_ctx.refreshPasswordRules) });
// @ts-ignore
[passwordRules, showPassword, rePassword, refreshPasswordRules,];
var __VLS_102;
const __VLS_107 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    type: "submit",
    color: "primary",
    size: "large",
    block: true,
    rounded: "lg",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.valid),
    prependIcon: "mdi-account-plus",
}));
const __VLS_109 = __VLS_108({
    type: "submit",
    color: "primary",
    size: "large",
    block: true,
    rounded: "lg",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.valid),
    prependIcon: "mdi-account-plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const { default: __VLS_111 } = __VLS_110.slots;
// @ts-ignore
[valid, loading,];
var __VLS_110;
var __VLS_54;
const __VLS_112 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "my-5" },
}));
const __VLS_114 = __VLS_113({
    ...{ class: "my-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-center text-body-2 text-medium-emphasis" },
});
const __VLS_117 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    to: "/login",
    ...{ class: "text-primary font-weight-medium" },
}));
const __VLS_119 = __VLS_118({
    to: "/login",
    ...{ class: "text-primary font-weight-medium" },
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
const { default: __VLS_121 } = __VLS_120.slots;
var __VLS_120;
var __VLS_44;
var __VLS_39;
var __VLS_19;
var __VLS_14;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-10']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['my-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
// @ts-ignore
var __VLS_59 = __VLS_58;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
