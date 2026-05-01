import { ref } from 'vue';
import { uploadClubLogo } from '../services/logoUpload';
const props = withDefaults(defineProps(), {
    clubId: null,
});
const emit = defineEmits();
const file = ref(null);
const preview = ref('');
const loading = ref(false);
const error = ref('');
const handleFileSelect = (event) => {
    const target = event.target;
    const selectedFile = target.files?.[0];
    if (!selectedFile)
        return;
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
        error.value = 'Please select an image file';
        return;
    }
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
        error.value = 'File size must be less than 5MB';
        return;
    }
    file.value = selectedFile;
    error.value = '';
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.value = e.target?.result;
    };
    reader.readAsDataURL(selectedFile);
};
const uploadLogo = async () => {
    if (!file.value || !props.clubId) {
        error.value = 'Please select a file and ensure club is created';
        return;
    }
    loading.value = true;
    error.value = '';
    try {
        const response = await uploadClubLogo(props.clubId, file.value);
        emit('logo-uploaded', response.logo_url);
        file.value = null;
        preview.value = '';
    }
    catch (err) {
        error.value = err instanceof Error ? err.message : 'Upload failed';
    }
    finally {
        loading.value = false;
    }
};
const clearFile = () => {
    file.value = null;
    preview.value = '';
    error.value = '';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    clubId: null,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo-upload" },
});
const __VLS_0 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "pa-4" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
const __VLS_5 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
var __VLS_8;
if (!__VLS_ctx.preview) {
    // @ts-ignore
    [preview,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload-area" },
    });
    const __VLS_10 = {}.VFileInput;
    /** @type {[typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ]} */ ;
    // @ts-ignore
    VFileInput;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ 'onChange': {} },
        label: "Select logo image",
        accept: "image/*",
        prependIcon: "mdi-camera",
        showSize: true,
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onChange': {} },
        label: "Select logo image",
        accept: "image/*",
        prependIcon: "mdi-camera",
        showSize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = ({ change: {} },
        { onChange: (__VLS_ctx.handleFileSelect) });
    // @ts-ignore
    [handleFileSelect,];
    var __VLS_13;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "preview-area" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.img)({
        src: (__VLS_ctx.preview),
        alt: ('Logo preview'),
        ...{ class: "logo-preview" },
    });
    // @ts-ignore
    [preview,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "preview-actions" },
    });
    const __VLS_18 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ 'onClick': {} },
        variant: "outlined",
        size: "small",
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClick': {} },
        variant: "outlined",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = ({ click: {} },
        { onClick: (__VLS_ctx.clearFile) });
    const { default: __VLS_25 } = __VLS_21.slots;
    // @ts-ignore
    [clearFile,];
    var __VLS_21;
    const __VLS_26 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
        color: "primary",
        size: "small",
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
        color: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = ({ click: {} },
        { onClick: (__VLS_ctx.uploadLogo) });
    const { default: __VLS_33 } = __VLS_29.slots;
    // @ts-ignore
    [loading, uploadLogo,];
    var __VLS_29;
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    const __VLS_34 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        type: "error",
        ...{ class: "mt-3" },
    }));
    const __VLS_36 = __VLS_35({
        type: "error",
        ...{ class: "mt-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_38 } = __VLS_37.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_37;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['logo-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-area']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
