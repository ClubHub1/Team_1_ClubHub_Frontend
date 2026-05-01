import { ref } from 'vue';
import { feathersClient } from './backendAPI';
import { useAuthStore } from './stores/auth';
import { useClubStore } from './stores/clubStore';
import { useUserStore } from './stores/user';
import { useRouter } from 'vue-router';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = await (async () => {
    const registerForm = ref(null);
    const authStore = useAuthStore();
    const clubStore = useClubStore();
    const userStore = useUserStore();
    const router = useRouter();
    //Setup stores and logic for form submission
    const error = ref('');
    const loading = ref(false);
    //test for valid user input
    const valid = ref(false);
    //Store user inputs to be passed to create()
    const club_name = ref('');
    const club_description = ref('');
    const logo_file = ref(null);
    const logo_preview = ref('');
    //RULES FOR FORM
    const nameRules = [
        (v) => (!!v && v.length < 31) || 'Required, max 30 characters.',
    ];
    const descRules = [
        (v) => (!!v && v.length < 750) || 'Required, max 750 characters.',
    ];
    const logoRules = [
        (value) => {
            if (!value)
                return true; // logo is optional
            if (value.size <= 5242880)
                return true; // 5MB
            return 'Logo must be less than 5MB';
        }
    ];
    // Handle file selection and preview
    function handleFileSelect(event) {
        const target = event.target;
        const files = target.files;
        if (files && files.length > 0) {
            logo_file.value = files[0];
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                logo_preview.value = e.target?.result;
            };
            reader.readAsDataURL(files[0]);
        }
    }
    // Upload file to backend
    async function uploadLogoFile() {
        if (!logo_file.value)
            return null;
        try {
            const formData = new FormData();
            formData.append('file', logo_file.value);
            const response = await fetch('http://localhost:42063/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('File upload failed');
            }
            const data = await response.json();
            console.log(data);
            console.log(data.path);
            return data.path; // Returns /uploads/filename
        }
        catch (err) {
            console.error('Logo upload error:', err);
            throw err;
        }
    }
    function refreshRules() {
        registerForm.value?.validate();
    }
    async function handleSubmit() {
        // if form validation fails, don't submit
        if (!valid.value)
            return;
        error.value = '';
        loading.value = true;
        try {
            console.log('trying registration, please wait');
            const now = new Date();
            const nowString = now.toISOString();
            console.log(nowString);
            // Upload logo if provided
            let logoUrl = null;
            if (logo_file.value) {
                try {
                    logoUrl = await uploadLogoFile();
                    console.log('Logo uploaded successfully:', logoUrl);
                }
                catch (uploadErr) {
                    error.value = 'Failed to upload logo. Club will be created without logo.';
                    console.log('Logo upload error:', uploadErr);
                }
            }
            //Create new club in the database
            const newClub = await feathersClient.service("Club")._create({
                name: club_name.value,
                description: club_description.value,
                created_at: nowString,
                activity_status: 'Active',
                ...(logoUrl && { logo_url: logoUrl }) // Add logo_url if upload succeeded
            }).catch(err => {
                error.value = err.message;
                console.log('error caught; ', error);
            });
            console.log(newClub);
            if (newClub) {
                clubStore.setDescription(newClub.description);
                clubStore.setId(newClub.club_id);
                clubStore.setName(newClub.name);
                if (newClub.logo_url) {
                    clubStore.setLogoUrl(newClub.logo_url);
                }
            }
            //If club creation succeeds, create new ClubMembership item designating the creating user as the president by default
            if (newClub) {
                const newPresident = await feathersClient.service("ClubMembership")._create({
                    userid: userStore.id,
                    role: 'president',
                    clubid: newClub.club_id,
                    is_active: true,
                    dues_paid: false
                }).catch(err => {
                    error.value = err.message;
                    console.log('error caught; ', error);
                });
                console.log(newPresident);
            }
        }
        finally {
            loading.value = false;
            router.push('/clubDash');
        }
    }
    debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
    const __VLS_self = (await import('vue')).defineComponent({
        methods: {
            refreshRules() {
                this.$refs.registerForm.validate();
            },
        },
    });
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
    }));
    const __VLS_18 = __VLS_17({
        justify: "center",
        align: "start",
        ...{ style: {} },
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
    }));
    const __VLS_43 = __VLS_42({
        rounded: "lg",
        elevation: "2",
        ...{ class: "pa-8" },
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
    const __VLS_61 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        modelValue: (__VLS_ctx.club_name),
        rules: (__VLS_ctx.nameRules),
        label: "Club Name",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        ...{ class: "mb-4" },
        required: true,
    }));
    const __VLS_63 = __VLS_62({
        modelValue: (__VLS_ctx.club_name),
        rules: (__VLS_ctx.nameRules),
        label: "Club Name",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        ...{ class: "mb-4" },
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    // @ts-ignore
    [club_name, nameRules,];
    const __VLS_66 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
        modelValue: (__VLS_ctx.club_description),
        rules: (__VLS_ctx.descRules),
        label: "Description",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "6",
        counter: "750",
        ...{ class: "mb-5" },
        required: true,
    }));
    const __VLS_68 = __VLS_67({
        modelValue: (__VLS_ctx.club_description),
        rules: (__VLS_ctx.descRules),
        label: "Description",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "6",
        counter: "750",
        ...{ class: "mb-5" },
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    // @ts-ignore
    [club_description, descRules,];
    const __VLS_71 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        ...{ class: "mb-5" },
    }));
    const __VLS_73 = __VLS_72({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const { default: __VLS_75 } = __VLS_74.slots;
    const __VLS_76 = {}.VFileInput;
    /** @type {[typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ]} */ ;
    // @ts-ignore
    VFileInput;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.logo_file),
        accept: "image/*",
        label: "Club Logo (Optional)",
        prependIcon: "mdi-image",
        ...{ class: "mr-6" },
        rules: (__VLS_ctx.logoRules),
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.logo_file),
        accept: "image/*",
        label: "Club Logo (Optional)",
        prependIcon: "mdi-image",
        ...{ class: "mr-6" },
        rules: (__VLS_ctx.logoRules),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    const __VLS_82 = ({ change: {} },
        { onChange: (__VLS_ctx.handleFileSelect) });
    // @ts-ignore
    [logo_file, logoRules, handleFileSelect,];
    var __VLS_79;
    var __VLS_74;
    if (__VLS_ctx.logo_preview) {
        // @ts-ignore
        [logo_preview,];
        const __VLS_84 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        VRow;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            ...{ class: "mb-5 justify-center" },
        }));
        const __VLS_86 = __VLS_85({
            ...{ class: "mb-5 justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        const { default: __VLS_88 } = __VLS_87.slots;
        const __VLS_89 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        VImg;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
            src: (__VLS_ctx.logo_preview),
            alt: "Logo Preview",
            maxWidth: "150",
            maxHeight: "150",
        }));
        const __VLS_91 = __VLS_90({
            src: (__VLS_ctx.logo_preview),
            alt: "Logo Preview",
            maxWidth: "150",
            maxHeight: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        // @ts-ignore
        [logo_preview,];
        var __VLS_87;
    }
    const __VLS_94 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        type: "submit",
        color: "primary",
        size: "large",
        block: true,
        rounded: "lg",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.valid),
        prependIcon: "mdi-plus-circle",
    }));
    const __VLS_96 = __VLS_95({
        type: "submit",
        color: "primary",
        size: "large",
        block: true,
        rounded: "lg",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.valid),
        prependIcon: "mdi-plus-circle",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    const { default: __VLS_98 } = __VLS_97.slots;
    // @ts-ignore
    [valid, loading,];
    var __VLS_97;
    var __VLS_54;
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
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    // @ts-ignore
    var __VLS_59 = __VLS_58;
    return (await import('vue')).defineComponent({
        methods: {
            refreshRules() {
                this.$refs.registerForm.validate();
            },
        },
    });
})();
export default {};
