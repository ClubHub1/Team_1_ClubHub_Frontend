import { computed, ref } from 'vue';
import { cropAndResizeProfilePhoto, uploadProfilePhoto } from '../services/profileUpload';
const emit = defineEmits();
const file = ref(null);
const preview = ref('');
const imageWidth = ref(0);
const imageHeight = ref(0);
const zoom = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const startOffsetX = ref(0);
const startOffsetY = ref(0);
const loading = ref(false);
const error = ref('');
const previewSize = 280;
const outputSize = 512;
const baseImageScale = computed(() => {
    if (!imageWidth.value || !imageHeight.value)
        return 1;
    return Math.max(previewSize / imageWidth.value, previewSize / imageHeight.value);
});
const imageStyle = computed(() => ({
    width: `${imageWidth.value * baseImageScale.value}px`,
    height: `${imageHeight.value * baseImageScale.value}px`,
    transform: `translate(-50%, -50%) translate(${offsetX.value}px, ${offsetY.value}px) scale(${zoom.value})`,
}));
const clampOffsets = () => {
    if (!imageWidth.value || !imageHeight.value)
        return;
    const displayWidth = imageWidth.value * baseImageScale.value * zoom.value;
    const displayHeight = imageHeight.value * baseImageScale.value * zoom.value;
    const maxX = Math.max(0, (displayWidth - previewSize) / 2);
    const maxY = Math.max(0, (displayHeight - previewSize) / 2);
    offsetX.value = Math.min(maxX, Math.max(-maxX, offsetX.value));
    offsetY.value = Math.min(maxY, Math.max(-maxY, offsetY.value));
};
const resetCrop = () => {
    zoom.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
};
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
    resetCrop();
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.value = e.target?.result;
    };
    reader.readAsDataURL(selectedFile);
};
const handlePreviewLoad = (event) => {
    const image = event.target;
    imageWidth.value = image.naturalWidth;
    imageHeight.value = image.naturalHeight;
    clampOffsets();
};
const startDrag = (event) => {
    isDragging.value = true;
    dragStartX.value = event.clientX;
    dragStartY.value = event.clientY;
    startOffsetX.value = offsetX.value;
    startOffsetY.value = offsetY.value;
    event.currentTarget.setPointerCapture(event.pointerId);
};
const dragImage = (event) => {
    if (!isDragging.value)
        return;
    offsetX.value = startOffsetX.value + event.clientX - dragStartX.value;
    offsetY.value = startOffsetY.value + event.clientY - dragStartY.value;
    clampOffsets();
};
const stopDrag = (event) => {
    if (!isDragging.value)
        return;
    isDragging.value = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
};
const uploadPhoto = async () => {
    if (!file.value) {
        error.value = 'Please select a file';
        return;
    }
    loading.value = true;
    error.value = '';
    try {
        const croppedFile = await cropAndResizeProfilePhoto(file.value, {
            offsetX: offsetX.value,
            offsetY: offsetY.value,
            outputSize,
            previewSize,
            zoom: zoom.value,
        });
        const response = await uploadProfilePhoto(croppedFile);
        emit('photo-uploaded', response.path);
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
    imageWidth.value = 0;
    imageHeight.value = 0;
    resetCrop();
    error.value = '';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['crop-frame']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-guide']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-guide']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-guide']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-guide']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "profile-photo-upload" },
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
    /** @type {[typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ]} */ ;
    // @ts-ignore
    VFileInput;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ 'onChange': {} },
        label: "Select profile photo",
        accept: "image/*",
        prependIcon: "mdi-camera",
        showSize: true,
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onChange': {} },
        label: "Select profile photo",
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
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onPointerdown: (__VLS_ctx.startDrag) },
        ...{ onPointermove: (__VLS_ctx.dragImage) },
        ...{ onPointerup: (__VLS_ctx.stopDrag) },
        ...{ onPointercancel: (__VLS_ctx.stopDrag) },
        ...{ onPointerleave: (__VLS_ctx.stopDrag) },
        ...{ class: "crop-frame" },
        ...{ class: ({ dragging: __VLS_ctx.isDragging }) },
    });
    // @ts-ignore
    [startDrag, dragImage, stopDrag, stopDrag, stopDrag, isDragging,];
    __VLS_asFunctionalElement(__VLS_intrinsics.img)({
        ...{ onLoad: (__VLS_ctx.handlePreviewLoad) },
        src: (__VLS_ctx.preview),
        ...{ style: (__VLS_ctx.imageStyle) },
        alt: "Profile photo preview",
        ...{ class: "photo-preview" },
        draggable: "false",
    });
    // @ts-ignore
    [preview, handlePreviewLoad, imageStyle,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div)({
        ...{ class: "crop-guide" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "crop-controls" },
    });
    const __VLS_18 = {}.VSlider;
    /** @type {[typeof __VLS_components.VSlider, typeof __VLS_components.vSlider, ]} */ ;
    // @ts-ignore
    VSlider;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.zoom),
        label: "Zoom",
        min: "1",
        max: "3",
        step: "0.01",
        prependIcon: "mdi-magnify-minus-outline",
        appendIcon: "mdi-magnify-plus-outline",
        hideDetails: true,
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.zoom),
        label: "Zoom",
        min: "1",
        max: "3",
        step: "0.01",
        prependIcon: "mdi-magnify-minus-outline",
        appendIcon: "mdi-magnify-plus-outline",
        hideDetails: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = ({ 'update:modelValue': {} },
        { 'onUpdate:modelValue': (__VLS_ctx.clampOffsets) });
    // @ts-ignore
    [zoom, clampOffsets,];
    var __VLS_21;
    const __VLS_26 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        variant: "text",
        size: "small",
        prependIcon: "mdi-refresh",
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        variant: "text",
        size: "small",
        prependIcon: "mdi-refresh",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = ({ click: {} },
        { onClick: (__VLS_ctx.resetCrop) });
    const { default: __VLS_33 } = __VLS_29.slots;
    // @ts-ignore
    [resetCrop,];
    var __VLS_29;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "preview-actions" },
    });
    const __VLS_34 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        variant: "outlined",
        size: "small",
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        variant: "outlined",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_38;
    let __VLS_39;
    const __VLS_40 = ({ click: {} },
        { onClick: (__VLS_ctx.clearFile) });
    const { default: __VLS_41 } = __VLS_37.slots;
    // @ts-ignore
    [clearFile,];
    var __VLS_37;
    const __VLS_42 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
        color: "primary",
        size: "small",
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
        color: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = ({ click: {} },
        { onClick: (__VLS_ctx.uploadPhoto) });
    const { default: __VLS_49 } = __VLS_45.slots;
    // @ts-ignore
    [loading, uploadPhoto,];
    var __VLS_45;
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    const __VLS_50 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        type: "error",
        ...{ class: "mt-3" },
    }));
    const __VLS_52 = __VLS_51({
        type: "error",
        ...{ class: "mt-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_54 } = __VLS_53.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_53;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['profile-photo-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-area']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-frame']} */ ;
/** @type {__VLS_StyleScopedClasses['dragging']} */ ;
/** @type {__VLS_StyleScopedClasses['photo-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-guide']} */ ;
/** @type {__VLS_StyleScopedClasses['crop-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
