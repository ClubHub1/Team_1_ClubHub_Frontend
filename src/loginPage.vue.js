import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import useUserStore from './stores/user';
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const valid = ref(false);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const emailRules = [
    (v) => !!v || 'E-mail is required.',
    (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
];
const passwordRules = [
    (v) => !!v || 'Password is required.',
];
async function handleSubmit() {
    if (!valid.value)
        return;
    error.value = '';
    loading.value = true;
    try {
        authStore.clearError();
        const res = await authStore.authenticate({
            strategy: 'local',
            email: email.value,
            password: password.value,
        });
        if (res) {
            userStore.setEmail(res.User?.email);
            userStore.setId(res.User?.id);
            userStore.setFirstName(res.User?.first_name);
            userStore.setLastName(res.User?.last_name);
            userStore.setProfilePhotoUrl(res.User?.profile_photo_url);
            userStore.setBio(res.User?.bio);
            userStore.setFacebookUrl(res.User?.facebook_url);
            userStore.setInstagramUrl(res.User?.instagram_url);
            userStore.setLinkedInUrl(res.User?.linkedin_url);
            userStore.setTwitterUrl(res.User?.twitter_url);
        }
        const redirectTo = authStore.loginRedirect || '/dashboard';
        authStore.loginRedirect = null;
    }
    catch (e) {
        error.value = authStore.error?.message || 'Login failed. Please check your email and password.';
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
    ...{ class: "d-flex align-center justify-center" },
    ...{ style: {} },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "d-flex align-center justify-center" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
const __VLS_16 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    justify: "center",
    align: "center",
    ...{ style: {} },
    noGutters: true,
}));
const __VLS_18 = __VLS_17({
    justify: "center",
    align: "center",
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
__VLS_asFunctionalElement(__VLS_intrinsics.br)({});
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
    ...{ class: "d-flex flex-column" },
    cols: "12",
    md: "5",
}));
const __VLS_38 = __VLS_37({
    ...{ class: "d-flex flex-column" },
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
    ...{ class: "pa-8 d-flex flex-column" },
    ...{ style: {} },
}));
const __VLS_43 = __VLS_42({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-8 d-flex flex-column" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_45 } = __VLS_44.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-h5 font-weight-bold mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-medium-emphasis" },
});
if (__VLS_ctx.authStore.error) {
    // @ts-ignore
    [authStore,];
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
    (__VLS_ctx.authStore.error.message);
    // @ts-ignore
    [authStore,];
    var __VLS_49;
}
const __VLS_51 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
VForm;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.valid),
}));
const __VLS_53 = __VLS_52({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.valid),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
const __VLS_57 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.handleSubmit) });
const { default: __VLS_58 } = __VLS_54.slots;
// @ts-ignore
[valid, handleSubmit,];
const __VLS_59 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.email),
    rules: (__VLS_ctx.emailRules),
    label: "Email Address",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    ...{ class: "mb-3" },
    required: true,
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.email),
    rules: (__VLS_ctx.emailRules),
    label: "Email Address",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    ...{ class: "mb-3" },
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
// @ts-ignore
[email, emailRules,];
const __VLS_64 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick:appendInner': {} },
    modelValue: (__VLS_ctx.password),
    rules: (__VLS_ctx.passwordRules),
    label: "Password",
    prependInnerIcon: "mdi-lock-outline",
    appendInnerIcon: (__VLS_ctx.showPassword ? 'mdi-eye-off' : 'mdi-eye'),
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    variant: "outlined",
    ...{ class: "mb-5" },
    required: true,
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick:appendInner': {} },
    modelValue: (__VLS_ctx.password),
    rules: (__VLS_ctx.passwordRules),
    label: "Password",
    prependInnerIcon: "mdi-lock-outline",
    appendInnerIcon: (__VLS_ctx.showPassword ? 'mdi-eye-off' : 'mdi-eye'),
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    variant: "outlined",
    ...{ class: "mb-5" },
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
const __VLS_70 = ({ 'click:appendInner': {} },
    { 'onClick:appendInner': (...[$event]) => {
            __VLS_ctx.showPassword = !__VLS_ctx.showPassword;
            // @ts-ignore
            [password, passwordRules, showPassword, showPassword, showPassword, showPassword,];
        } });
var __VLS_67;
const __VLS_72 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    type: "submit",
    color: "primary",
    size: "large",
    block: true,
    rounded: "lg",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.valid),
    prependIcon: "mdi-login",
}));
const __VLS_74 = __VLS_73({
    type: "submit",
    color: "primary",
    size: "large",
    block: true,
    rounded: "lg",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.valid),
    prependIcon: "mdi-login",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_76 } = __VLS_75.slots;
// @ts-ignore
[valid, loading,];
var __VLS_75;
var __VLS_54;
const __VLS_77 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    ...{ class: "my-5" },
}));
const __VLS_79 = __VLS_78({
    ...{ class: "my-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-center text-body-2 text-medium-emphasis" },
});
const __VLS_82 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    to: "/register",
    ...{ class: "text-primary font-weight-medium" },
}));
const __VLS_84 = __VLS_83({
    to: "/register",
    ...{ class: "text-primary font-weight-medium" },
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_86 } = __VLS_85.slots;
var __VLS_85;
var __VLS_44;
var __VLS_39;
var __VLS_19;
var __VLS_14;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
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
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-8']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['my-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
