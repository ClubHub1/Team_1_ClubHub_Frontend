import { ref } from 'vue';
import { feathersClient } from './backendAPI';
import useUserStore from './stores/user';
import ProfilePhotoUpload from './components/ProfilePhotoUpload.vue';
const userStore = useUserStore();
const firstName = ref(userStore.firstName);
const lastName = ref(userStore.lastName);
const email = ref(userStore.email);
const bio = ref(userStore.bio || '');
const linkedinUrl = ref(userStore.linkedin_url || '');
const twitterUrl = ref(userStore.twitter_url || '');
const instagramUrl = ref(userStore.instagram_url || '');
const facebookUrl = ref(userStore.facebook_url || '');
const saving = ref(false);
const error = ref('');
const success = ref(false);
const valid = ref(false);
const nameRules = [(v) => !!v || 'This field is required.'];
const urlRules = [
    (v) => !v || /^https?:\/\/.+/.test(v) || 'Must be a valid URL starting with http:// or https://'
];
async function saveProfile() {
    if (!valid.value)
        return;
    saving.value = true;
    error.value = '';
    success.value = false;
    try {
        await feathersClient.service('User').patch(userStore.id, {
            first_name: firstName.value,
            last_name: lastName.value,
            bio: bio.value,
            linkedin_url: linkedinUrl.value,
            twitter_url: twitterUrl.value,
            instagram_url: instagramUrl.value,
            facebook_url: facebookUrl.value,
        });
        // Update the store with the new values
        userStore.setUser({
            firstName: firstName.value,
            lastName: lastName.value,
            bio: bio.value,
            linkedin_url: linkedinUrl.value,
            twitter_url: twitterUrl.value,
            instagram_url: instagramUrl.value,
            facebook_url: facebookUrl.value,
        });
        success.value = true;
    }
    catch (err) {
        error.value = 'Failed to save changes. Please try again.';
    }
    finally {
        saving.value = false;
    }
}
function onPhotoUploaded(photoUrl) {
    savePhotoUrl(photoUrl);
}
async function savePhotoUrl(photoPath) {
    try {
        await feathersClient.service('User').patch(userStore.id, {
            profile_photo_url: photoPath,
        });
        userStore.setProfilePhotoUrl(photoPath);
        success.value = true;
        setTimeout(() => success.value = false, 3000);
    }
    catch (err) {
        error.value = 'Failed to save profile photo. Please try again.';
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
VContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "py-8" },
    maxWidth: "700",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "py-8" },
    maxWidth: "700",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-h4 font-weight-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-medium-emphasis mt-1" },
});
const __VLS_6 = {}.VAvatar;
/** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
// @ts-ignore
VAvatar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    color: "primary",
    size: "52",
    variant: "tonal",
}));
const __VLS_8 = __VLS_7({
    color: "primary",
    size: "52",
    variant: "tonal",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
const __VLS_11 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    size: "28",
}));
const __VLS_13 = __VLS_12({
    size: "28",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
var __VLS_14;
var __VLS_9;
const __VLS_16 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    elevation: "2",
    rounded: "lg",
    ...{ class: "mb-6" },
}));
const __VLS_18 = __VLS_17({
    elevation: "2",
    rounded: "lg",
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_20 } = __VLS_19.slots;
const __VLS_21 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: "pa-6" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "pa-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_25 } = __VLS_24.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center mb-5" },
});
const __VLS_26 = {}.VAvatar;
/** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
// @ts-ignore
VAvatar;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    color: (__VLS_ctx.userStore.profile_photo_url ? 'transparent' : 'primary'),
    size: "64",
    ...{ class: "mr-4" },
}));
const __VLS_28 = __VLS_27({
    color: (__VLS_ctx.userStore.profile_photo_url ? 'transparent' : 'primary'),
    size: "64",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
// @ts-ignore
[userStore,];
if (__VLS_ctx.userStore.profile_photo_url) {
    // @ts-ignore
    [userStore,];
    __VLS_asFunctionalElement(__VLS_intrinsics.img)({
        src: (`http://localhost:42063${__VLS_ctx.userStore.profile_photo_url}`),
        alt: "Profile photo",
    });
    // @ts-ignore
    [userStore,];
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-h5 text-white font-weight-bold" },
    });
    ((__VLS_ctx.userStore.firstName?.[0] ?? ''));
    ((__VLS_ctx.userStore.lastName?.[0] ?? ''));
    // @ts-ignore
    [userStore, userStore,];
}
var __VLS_29;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-h6 font-weight-bold ma-0" },
});
(__VLS_ctx.userStore.firstName);
(__VLS_ctx.userStore.lastName);
// @ts-ignore
[userStore, userStore,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-medium-emphasis text-body-2 ma-0" },
});
(__VLS_ctx.userStore.email);
// @ts-ignore
[userStore,];
if (__VLS_ctx.userStore.bio) {
    // @ts-ignore
    [userStore,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 ma-0 mt-1" },
    });
    (__VLS_ctx.userStore.bio);
    // @ts-ignore
    [userStore,];
}
const __VLS_31 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    ...{ class: "mb-5" },
}));
const __VLS_33 = __VLS_32({
    ...{ class: "mb-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-4" },
});
/** @type {[typeof ProfilePhotoUpload, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(ProfilePhotoUpload, new ProfilePhotoUpload({
    ...{ 'onPhotoUploaded': {} },
    ...{ class: "mb-5" },
}));
const __VLS_37 = __VLS_36({
    ...{ 'onPhotoUploaded': {} },
    ...{ class: "mb-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_39;
let __VLS_40;
const __VLS_41 = ({ photoUploaded: {} },
    { onPhotoUploaded: (__VLS_ctx.onPhotoUploaded) });
// @ts-ignore
[onPhotoUploaded,];
var __VLS_38;
const __VLS_43 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    ...{ class: "mb-5" },
}));
const __VLS_45 = __VLS_44({
    ...{ class: "mb-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-4" },
});
if (__VLS_ctx.success) {
    // @ts-ignore
    [success,];
    const __VLS_48 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick:close': {} },
        type: "success",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        closable: true,
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick:close': {} },
        type: "success",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        closable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    const __VLS_54 = ({ 'click:close': {} },
        { 'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.success))
                    return;
                __VLS_ctx.success = false;
                // @ts-ignore
                [success,];
            } });
    const { default: __VLS_55 } = __VLS_51.slots;
    var __VLS_51;
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
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
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_59;
}
const __VLS_61 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
VForm;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.valid),
}));
const __VLS_63 = __VLS_62({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.valid),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
const __VLS_67 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.saveProfile) });
const { default: __VLS_68 } = __VLS_64.slots;
// @ts-ignore
[valid, saveProfile,];
const __VLS_69 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_73 } = __VLS_72.slots;
const __VLS_74 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    cols: "12",
    sm: "6",
}));
const __VLS_76 = __VLS_75({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_78 } = __VLS_77.slots;
const __VLS_79 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.firstName),
    label: "First Name",
    rules: (__VLS_ctx.nameRules),
    prependInnerIcon: "mdi-account",
    variant: "outlined",
    required: true,
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.firstName),
    label: "First Name",
    rules: (__VLS_ctx.nameRules),
    prependInnerIcon: "mdi-account",
    variant: "outlined",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
// @ts-ignore
[firstName, nameRules,];
var __VLS_77;
const __VLS_84 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    cols: "12",
    sm: "6",
}));
const __VLS_86 = __VLS_85({
    cols: "12",
    sm: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_88 } = __VLS_87.slots;
const __VLS_89 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    modelValue: (__VLS_ctx.lastName),
    label: "Last Name",
    rules: (__VLS_ctx.nameRules),
    prependInnerIcon: "mdi-account",
    variant: "outlined",
    required: true,
}));
const __VLS_91 = __VLS_90({
    modelValue: (__VLS_ctx.lastName),
    label: "Last Name",
    rules: (__VLS_ctx.nameRules),
    prependInnerIcon: "mdi-account",
    variant: "outlined",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
// @ts-ignore
[nameRules, lastName,];
var __VLS_87;
var __VLS_72;
const __VLS_94 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    modelValue: (__VLS_ctx.email),
    label: "Email Address",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    readonly: true,
    disabled: true,
    ...{ class: "mb-4" },
    hint: "Email cannot be changed.",
    persistentHint: true,
}));
const __VLS_96 = __VLS_95({
    modelValue: (__VLS_ctx.email),
    label: "Email Address",
    prependInnerIcon: "mdi-email-outline",
    variant: "outlined",
    readonly: true,
    disabled: true,
    ...{ class: "mb-4" },
    hint: "Email cannot be changed.",
    persistentHint: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
// @ts-ignore
[email,];
const __VLS_99 = {}.VTextarea;
/** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
// @ts-ignore
VTextarea;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.bio),
    label: "Bio",
    prependInnerIcon: "mdi-text-box-outline",
    variant: "outlined",
    rows: "3",
    ...{ class: "mb-4" },
    hint: "Tell others about yourself (optional)",
    persistentHint: true,
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.bio),
    label: "Bio",
    prependInnerIcon: "mdi-text-box-outline",
    variant: "outlined",
    rows: "3",
    ...{ class: "mb-4" },
    hint: "Tell others about yourself (optional)",
    persistentHint: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
// @ts-ignore
[bio,];
const __VLS_104 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "mb-4" },
}));
const __VLS_106 = __VLS_105({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-3" },
});
const __VLS_109 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    modelValue: (__VLS_ctx.linkedinUrl),
    label: "LinkedIn Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-linkedin",
    variant: "outlined",
    ...{ class: "mb-3" },
    placeholder: "https://linkedin.com/in/yourprofile",
}));
const __VLS_111 = __VLS_110({
    modelValue: (__VLS_ctx.linkedinUrl),
    label: "LinkedIn Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-linkedin",
    variant: "outlined",
    ...{ class: "mb-3" },
    placeholder: "https://linkedin.com/in/yourprofile",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
// @ts-ignore
[linkedinUrl, urlRules,];
const __VLS_114 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.twitterUrl),
    label: "Twitter Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-twitter",
    variant: "outlined",
    ...{ class: "mb-3" },
    placeholder: "https://twitter.com/yourhandle",
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.twitterUrl),
    label: "Twitter Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-twitter",
    variant: "outlined",
    ...{ class: "mb-3" },
    placeholder: "https://twitter.com/yourhandle",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
// @ts-ignore
[urlRules, twitterUrl,];
const __VLS_119 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    modelValue: (__VLS_ctx.instagramUrl),
    label: "Instagram Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-instagram",
    variant: "outlined",
    ...{ class: "mb-3" },
    placeholder: "https://instagram.com/yourhandle",
}));
const __VLS_121 = __VLS_120({
    modelValue: (__VLS_ctx.instagramUrl),
    label: "Instagram Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-instagram",
    variant: "outlined",
    ...{ class: "mb-3" },
    placeholder: "https://instagram.com/yourhandle",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
// @ts-ignore
[urlRules, instagramUrl,];
const __VLS_124 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    modelValue: (__VLS_ctx.facebookUrl),
    label: "Facebook Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-facebook",
    variant: "outlined",
    ...{ class: "mb-4" },
    placeholder: "https://facebook.com/yourprofile",
}));
const __VLS_126 = __VLS_125({
    modelValue: (__VLS_ctx.facebookUrl),
    label: "Facebook Profile",
    rules: (__VLS_ctx.urlRules),
    prependInnerIcon: "mdi-facebook",
    variant: "outlined",
    ...{ class: "mb-4" },
    placeholder: "https://facebook.com/yourprofile",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
// @ts-ignore
[urlRules, facebookUrl,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex justify-end" },
});
const __VLS_129 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    type: "submit",
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.saving),
    disabled: (!__VLS_ctx.valid),
    prependIcon: "mdi-content-save",
}));
const __VLS_131 = __VLS_130({
    type: "submit",
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.saving),
    disabled: (!__VLS_ctx.valid),
    prependIcon: "mdi-content-save",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_133 } = __VLS_132.slots;
// @ts-ignore
[valid, saving,];
var __VLS_132;
var __VLS_64;
var __VLS_24;
var __VLS_19;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
