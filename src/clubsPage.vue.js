import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { feathersClient } from './backendAPI';
const router = useRouter();
const searchQuery = ref('');
const selectedTags = ref([]);
const selectedStatus = ref([]);
const clubs = ref([]);
const loading = ref(false);
const allTags = ref(['Sports', 'Technology', 'Arts', 'Community', 'Academic',
    'Competitive', 'Volunteering', 'Gaming', 'Coding', 'Music',
    'Strategy', 'Leadership', 'Cultural', 'Health & Wellness', 'Engineering',
    'Business', 'Science', 'Pre-Med', 'Law', 'Environmental']);
const headers = [
    { title: 'Club Name', key: 'name', sortable: true },
    { title: 'Status', key: 'activity_status', sortable: true },
    { title: 'Description', key: 'description', sortable: false },
];
onMounted(async () => {
    loading.value = true;
    try {
        const res = await feathersClient.service('Club').find({ query: { $limit: 25 } });
        clubs.value = Array.isArray(res.data) ? res.data : res.data ?? [];
    }
    catch (e) {
        console.error('Failed to load clubs:', e);
    }
    finally {
        loading.value = false;
    }
});
const filteredClubs = computed(() => {
    return clubs.value.filter(club => {
        const q = searchQuery.value.toLowerCase();
        const matchSearch = !q || club.name?.toLowerCase().includes(q) || club.description?.toLowerCase().includes(q);
        const matchStatus = selectedStatus.value.length === 0 || selectedStatus.value.includes(club.activity_status);
        return matchSearch && matchStatus;
    });
});
const activeFilterCount = computed(() => selectedStatus.value.length + selectedTags.value.length);
function clearFilters() {
    selectedStatus.value = [];
    selectedTags.value = [];
    searchQuery.value = '';
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
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
const __VLS_11 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
VContainer;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    ...{ class: "py-8" },
    maxWidth: "1200",
}));
const __VLS_13 = __VLS_12({
    ...{ class: "py-8" },
    maxWidth: "1200",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
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
(__VLS_ctx.clubs.length);
// @ts-ignore
[clubs,];
const __VLS_16 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-6" },
}));
const __VLS_18 = __VLS_17({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_20 } = __VLS_19.slots;
const __VLS_21 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search clubs by name or description...",
    prependInnerIcon: "mdi-magnify",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search clubs by name or description...",
    prependInnerIcon: "mdi-magnify",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[searchQuery,];
var __VLS_19;
const __VLS_26 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
const __VLS_31 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    cols: "12",
    md: "3",
}));
const __VLS_33 = __VLS_32({
    cols: "12",
    md: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_35 } = __VLS_34.slots;
const __VLS_36 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    elevation: "2",
    rounded: "lg",
    ...{ class: "pa-4" },
}));
const __VLS_38 = __VLS_37({
    elevation: "2",
    rounded: "lg",
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_40 } = __VLS_39.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: "text-h6" },
});
if (__VLS_ctx.activeFilterCount > 0) {
    // @ts-ignore
    [activeFilterCount,];
    const __VLS_41 = {}.VChip;
    /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
    // @ts-ignore
    VChip;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onClick:close': {} },
        size: "small",
        color: "primary",
        variant: "tonal",
        closable: true,
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick:close': {} },
        size: "small",
        color: "primary",
        variant: "tonal",
        closable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = ({ 'click:close': {} },
        { 'onClick:close': (__VLS_ctx.clearFilters) });
    const { default: __VLS_48 } = __VLS_44.slots;
    // @ts-ignore
    [clearFilters,];
    (__VLS_ctx.activeFilterCount);
    // @ts-ignore
    [activeFilterCount,];
    var __VLS_44;
}
const __VLS_49 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "mb-4" },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex flex-wrap gap-2 mb-5" },
});
for (const [s] of __VLS_getVForSourceType((['Active', 'Inactive']))) {
    const __VLS_54 = {}.VChip;
    /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
    // @ts-ignore
    VChip;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
        ...{ 'onClick': {} },
        key: (s),
        variant: (__VLS_ctx.selectedStatus.includes(s) ? 'flat' : 'outlined'),
        color: (__VLS_ctx.selectedStatus.includes(s) ? 'primary' : 'default'),
        size: "small",
        ...{ class: "cursor-pointer" },
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onClick': {} },
        key: (s),
        variant: (__VLS_ctx.selectedStatus.includes(s) ? 'flat' : 'outlined'),
        color: (__VLS_ctx.selectedStatus.includes(s) ? 'primary' : 'default'),
        size: "small",
        ...{ class: "cursor-pointer" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.selectedStatus.includes(s)
                    ? __VLS_ctx.selectedStatus.splice(__VLS_ctx.selectedStatus.indexOf(s), 1)
                    : __VLS_ctx.selectedStatus.push(s);
                // @ts-ignore
                [selectedStatus, selectedStatus, selectedStatus, selectedStatus, selectedStatus, selectedStatus,];
            } });
    const { default: __VLS_61 } = __VLS_57.slots;
    (s);
    var __VLS_57;
}
const __VLS_62 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    ...{ class: "mb-4" },
}));
const __VLS_64 = __VLS_63({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-2" },
});
const __VLS_67 = {}.VAutocomplete;
/** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
// @ts-ignore
VAutocomplete;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.selectedTags),
    items: (__VLS_ctx.allTags),
    multiple: true,
    chips: true,
    closableChips: true,
    clearable: true,
    density: "compact",
    variant: "outlined",
    label: "Filter by interest",
    hideDetails: true,
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.selectedTags),
    items: (__VLS_ctx.allTags),
    multiple: true,
    chips: true,
    closableChips: true,
    clearable: true,
    density: "compact",
    variant: "outlined",
    label: "Filter by interest",
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
// @ts-ignore
[selectedTags, allTags,];
if (__VLS_ctx.activeFilterCount > 0) {
    // @ts-ignore
    [activeFilterCount,];
    const __VLS_72 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        variant: "text",
        color: "error",
        block: true,
        prependIcon: "mdi-close",
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
        variant: "text",
        color: "error",
        block: true,
        prependIcon: "mdi-close",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    const __VLS_78 = ({ click: {} },
        { onClick: (__VLS_ctx.clearFilters) });
    const { default: __VLS_79 } = __VLS_75.slots;
    // @ts-ignore
    [clearFilters,];
    var __VLS_75;
}
var __VLS_39;
var __VLS_34;
const __VLS_80 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    cols: "12",
    md: "9",
}));
const __VLS_82 = __VLS_81({
    cols: "12",
    md: "9",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_84 } = __VLS_83.slots;
const __VLS_85 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    elevation: "2",
    rounded: "lg",
}));
const __VLS_87 = __VLS_86({
    elevation: "2",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_89 } = __VLS_88.slots;
const __VLS_90 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    ...{ class: "px-6 pt-5 pb-2" },
}));
const __VLS_92 = __VLS_91({
    ...{ class: "px-6 pt-5 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const { default: __VLS_94 } = __VLS_93.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-h6" },
});
const __VLS_95 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
VChip;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    ...{ class: "ml-2" },
    size: "small",
    color: "primary",
    variant: "tonal",
}));
const __VLS_97 = __VLS_96({
    ...{ class: "ml-2" },
    size: "small",
    color: "primary",
    variant: "tonal",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_99 } = __VLS_98.slots;
(__VLS_ctx.filteredClubs.length);
(__VLS_ctx.clubs.length);
// @ts-ignore
[clubs, filteredClubs,];
var __VLS_98;
var __VLS_93;
const __VLS_100 = {}.VDataTable;
/** @type {[typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, ]} */ ;
// @ts-ignore
VDataTable;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    headers: (__VLS_ctx.headers),
    items: (__VLS_ctx.filteredClubs),
    loading: (__VLS_ctx.loading),
    itemValue: "club_id",
    itemsPerPage: (25),
    rounded: "lg",
}));
const __VLS_102 = __VLS_101({
    headers: (__VLS_ctx.headers),
    items: (__VLS_ctx.filteredClubs),
    loading: (__VLS_ctx.loading),
    itemValue: "club_id",
    itemsPerPage: (25),
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const { default: __VLS_104 } = __VLS_103.slots;
// @ts-ignore
[filteredClubs, headers, loading,];
{
    const { 'item.activity_status': __VLS_105 } = __VLS_103.slots;
    const [{ item }] = __VLS_getSlotParameters(__VLS_105);
    const __VLS_106 = {}.VChip;
    /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
    // @ts-ignore
    VChip;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        color: (item.activity_status === 'Active' ? 'success' : 'grey'),
        size: "small",
        variant: "tonal",
    }));
    const __VLS_108 = __VLS_107({
        color: (item.activity_status === 'Active' ? 'success' : 'grey'),
        size: "small",
        variant: "tonal",
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    const { default: __VLS_110 } = __VLS_109.slots;
    (item.activity_status);
    var __VLS_109;
}
{
    const { 'item.description': __VLS_111 } = __VLS_103.slots;
    const [{ item }] = __VLS_getSlotParameters(__VLS_111);
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-body-2 text-medium-emphasis" },
    });
    (item.description || '—');
}
{
    const { 'no-data': __VLS_112 } = __VLS_103.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center py-10" },
    });
    const __VLS_113 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        size: "52",
        color: "grey-lighten-1",
    }));
    const __VLS_115 = __VLS_114({
        size: "52",
        color: "grey-lighten-1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    const { default: __VLS_117 } = __VLS_116.slots;
    var __VLS_116;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "mt-3 text-medium-emphasis" },
    });
    const __VLS_118 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        ...{ 'onClick': {} },
        variant: "text",
        color: "primary",
    }));
    const __VLS_120 = __VLS_119({
        ...{ 'onClick': {} },
        variant: "text",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    let __VLS_122;
    let __VLS_123;
    const __VLS_124 = ({ click: {} },
        { onClick: (__VLS_ctx.clearFilters) });
    const { default: __VLS_125 } = __VLS_121.slots;
    // @ts-ignore
    [clearFilters,];
    var __VLS_121;
}
var __VLS_103;
var __VLS_88;
var __VLS_83;
var __VLS_29;
var __VLS_14;
var __VLS_9;
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
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
