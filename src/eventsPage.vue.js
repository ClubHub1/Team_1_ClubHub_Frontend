import { ref, onMounted } from 'vue';
import { feathersClient } from '@/backendAPI';
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const selectedTags = ref([]);
const dateFrom = ref('');
const dateTo = ref('');
const events = ref([]);
const clubs = ref([]);
const expanded = ref([]);
const headers = [
    { title: 'Event', key: 'name', sortable: true },
    { title: 'Club', key: 'clubName', sortable: true },
    { title: 'Date', key: 'start_datetime', sortable: true },
];
const allTags = [
    { label: 'Academic', value: 'academic' }, { label: 'Athletic', value: 'athletic' },
    { label: 'Career Development', value: 'career_dev' }, { label: 'Community Service', value: 'community_svc' },
    { label: 'Cultural / Language', value: 'cultural_lang' }, { label: 'Gaming', value: 'gaming' },
    { label: 'Health', value: 'health' }, { label: 'Leadership', value: 'leadership' },
    { label: 'Music', value: 'music' }, { label: 'Outdoor Recreation', value: 'outdoor_rec' },
    { label: 'Social', value: 'social' }, { label: 'STEM', value: 'stem' },
    { label: 'Technology', value: 'technology' }, { label: 'Arts', value: 'crafts_arts' },
];
async function fetchEvents() {
    loading.value = true;
    error.value = '';
    try {
        const clubRes = await feathersClient.service('Club').find({
            query: { $select: ['club_id', 'name'], $limit: 500 }
        });
        clubs.value = clubRes.data;
        const clubMap = new Map(clubs.value.map((c) => [c.club_id, c]));
        const eventQuery = { $sort: { start_datetime: 1 }, $limit: 500 };
        if (dateFrom.value)
            eventQuery.start_datetime = { ...eventQuery.start_datetime, $gte: new Date(dateFrom.value).toISOString() };
        if (dateTo.value)
            eventQuery.start_datetime = { ...eventQuery.start_datetime, $lte: new Date(dateTo.value + 'T23:59:59').toISOString() };
        if (selectedTags.value.length > 0) {
            const matchingClubIds = clubs.value.filter((c) => c.tags?.some((t) => selectedTags.value.includes(t))).map((c) => c.club_id);
            if (!matchingClubIds.length) {
                events.value = [];
                return;
            }
            eventQuery.club = { $in: matchingClubIds };
        }
        const eventRes = await feathersClient.service('Event').find({ query: eventQuery });
        events.value = eventRes.data.map((e) => {
            const club = clubMap.get(e.club);
            return { id: e.id, club: e.club, name: e.name, description: e.description, location: e.location, start_datetime: e.start_datetime, end_datetime: e.end_datetime, clubName: club?.name ?? 'Unknown Club', clubTags: club?.tags ?? [] };
        });
    }
    catch (err) {
        error.value = err.message ?? 'Failed to load events.';
    }
    finally {
        loading.value = false;
    }
}
function clearFilters() {
    selectedTags.value = [];
    dateFrom.value = '';
    dateTo.value = '';
    searchQuery.value = '';
    fetchEvents();
}
function formatDatetime(iso) {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function tagLabel(value) {
    return allTags.find(t => t.value === value)?.label ?? value;
}
onMounted(fetchEvents);
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
    label: "Search by event name, club, or location...",
    prependInnerIcon: "mdi-magnify",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search by event name, club, or location...",
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
const __VLS_41 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    variant: "text",
    size: "small",
    color: "grey-darken-1",
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    variant: "text",
    size: "small",
    color: "grey-darken-1",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
const __VLS_47 = ({ click: {} },
    { onClick: (__VLS_ctx.clearFilters) });
const { default: __VLS_48 } = __VLS_44.slots;
// @ts-ignore
[clearFilters,];
var __VLS_44;
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
const __VLS_54 = {}.VAutocomplete;
/** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
// @ts-ignore
VAutocomplete;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    modelValue: (__VLS_ctx.selectedTags),
    items: (__VLS_ctx.allTags),
    itemTitle: "label",
    itemValue: "value",
    multiple: true,
    chips: true,
    closableChips: true,
    clearable: true,
    label: "Filter by category",
    density: "compact",
    variant: "outlined",
    hideDetails: true,
    ...{ class: "mb-4" },
}));
const __VLS_56 = __VLS_55({
    modelValue: (__VLS_ctx.selectedTags),
    items: (__VLS_ctx.allTags),
    itemTitle: "label",
    itemValue: "value",
    multiple: true,
    chips: true,
    closableChips: true,
    clearable: true,
    label: "Filter by category",
    density: "compact",
    variant: "outlined",
    hideDetails: true,
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
// @ts-ignore
[selectedTags, allTags,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-2" },
});
const __VLS_59 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.dateFrom),
    label: "From date",
    prependInnerIcon: "mdi-calendar-start",
    type: "date",
    clearable: true,
    density: "compact",
    variant: "outlined",
    hideDetails: true,
    ...{ class: "mb-3" },
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.dateFrom),
    label: "From date",
    prependInnerIcon: "mdi-calendar-start",
    type: "date",
    clearable: true,
    density: "compact",
    variant: "outlined",
    hideDetails: true,
    ...{ class: "mb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
// @ts-ignore
[dateFrom,];
const __VLS_64 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.dateTo),
    label: "To date",
    prependInnerIcon: "mdi-calendar-end",
    type: "date",
    clearable: true,
    density: "compact",
    variant: "outlined",
    hideDetails: true,
    ...{ class: "mb-4" },
    min: (__VLS_ctx.dateFrom),
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.dateTo),
    label: "To date",
    prependInnerIcon: "mdi-calendar-end",
    type: "date",
    clearable: true,
    density: "compact",
    variant: "outlined",
    hideDetails: true,
    ...{ class: "mb-4" },
    min: (__VLS_ctx.dateFrom),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
// @ts-ignore
[dateFrom, dateTo,];
const __VLS_69 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ 'onClick': {} },
    color: "primary",
    block: true,
    rounded: "lg",
    loading: (__VLS_ctx.loading),
}));
const __VLS_71 = __VLS_70({
    ...{ 'onClick': {} },
    color: "primary",
    block: true,
    rounded: "lg",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
const __VLS_75 = ({ click: {} },
    { onClick: (__VLS_ctx.fetchEvents) });
const { default: __VLS_76 } = __VLS_72.slots;
// @ts-ignore
[loading, fetchEvents,];
var __VLS_72;
var __VLS_39;
var __VLS_34;
const __VLS_77 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    cols: "12",
    md: "9",
}));
const __VLS_79 = __VLS_78({
    cols: "12",
    md: "9",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_81 } = __VLS_80.slots;
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    const __VLS_82 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }));
    const __VLS_84 = __VLS_83({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    const { default: __VLS_86 } = __VLS_85.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_85;
}
const __VLS_87 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    elevation: "2",
    rounded: "lg",
}));
const __VLS_89 = __VLS_88({
    elevation: "2",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_91 } = __VLS_90.slots;
const __VLS_92 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ class: "px-6 pt-5 pb-2" },
}));
const __VLS_94 = __VLS_93({
    ...{ class: "px-6 pt-5 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_96 } = __VLS_95.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-h6" },
});
const __VLS_97 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
VChip;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    ...{ class: "ml-2" },
    size: "small",
    color: "primary",
    variant: "tonal",
}));
const __VLS_99 = __VLS_98({
    ...{ class: "ml-2" },
    size: "small",
    color: "primary",
    variant: "tonal",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const { default: __VLS_101 } = __VLS_100.slots;
(__VLS_ctx.events.length);
// @ts-ignore
[events,];
var __VLS_100;
var __VLS_95;
const __VLS_102 = {}.VDataTable;
/** @type {[typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, typeof __VLS_components.VDataTable, typeof __VLS_components.vDataTable, ]} */ ;
// @ts-ignore
VDataTable;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    headers: (__VLS_ctx.headers),
    items: (__VLS_ctx.events),
    search: (__VLS_ctx.searchQuery),
    loading: (__VLS_ctx.loading),
    loadingText: "Loading events...",
    noDataText: "No events found.",
    itemValue: "id",
    showExpand: true,
    expandOnClick: true,
    expanded: (__VLS_ctx.expanded),
}));
const __VLS_104 = __VLS_103({
    headers: (__VLS_ctx.headers),
    items: (__VLS_ctx.events),
    search: (__VLS_ctx.searchQuery),
    loading: (__VLS_ctx.loading),
    loadingText: "Loading events...",
    noDataText: "No events found.",
    itemValue: "id",
    showExpand: true,
    expandOnClick: true,
    expanded: (__VLS_ctx.expanded),
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_106 } = __VLS_105.slots;
// @ts-ignore
[searchQuery, loading, events, headers, expanded,];
{
    const { 'item.start_datetime': __VLS_107 } = __VLS_105.slots;
    const [{ item }] = __VLS_getSlotParameters(__VLS_107);
    (__VLS_ctx.formatDatetime(item.start_datetime));
    // @ts-ignore
    [formatDatetime,];
}
{
    const { 'expanded-row': __VLS_108 } = __VLS_105.slots;
    const [{ columns, item }] = __VLS_getSlotParameters(__VLS_108);
    __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
        colspan: (columns.length),
        ...{ class: "pa-0" },
    });
    const __VLS_109 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        flat: true,
        color: "grey-lighten-5",
        ...{ class: "pa-5 ma-2 rounded-lg" },
    }));
    const __VLS_111 = __VLS_110({
        flat: true,
        color: "grey-lighten-5",
        ...{ class: "pa-5 ma-2 rounded-lg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    const { default: __VLS_113 } = __VLS_112.slots;
    const __VLS_114 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({}));
    const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const { default: __VLS_118 } = __VLS_117.slots;
    const __VLS_119 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        cols: "12",
        md: "8",
    }));
    const __VLS_121 = __VLS_120({
        cols: "12",
        md: "8",
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    const { default: __VLS_123 } = __VLS_122.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center ga-2 mb-2" },
    });
    const __VLS_124 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        size: "16",
        color: "grey-darken-1",
    }));
    const __VLS_126 = __VLS_125({
        size: "16",
        color: "grey-darken-1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    const { default: __VLS_128 } = __VLS_127.slots;
    var __VLS_127;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-body-2" },
    });
    (item.location || '—');
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center ga-2 mb-2" },
    });
    const __VLS_129 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
        size: "16",
        color: "grey-darken-1",
    }));
    const __VLS_131 = __VLS_130({
        size: "16",
        color: "grey-darken-1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    const { default: __VLS_133 } = __VLS_132.slots;
    var __VLS_132;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-body-2" },
    });
    (__VLS_ctx.formatDatetime(item.start_datetime));
    // @ts-ignore
    [formatDatetime,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center ga-2 mb-3" },
    });
    const __VLS_134 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
        size: "16",
        color: "grey-darken-1",
    }));
    const __VLS_136 = __VLS_135({
        size: "16",
        color: "grey-darken-1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    const { default: __VLS_138 } = __VLS_137.slots;
    var __VLS_137;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-body-2" },
    });
    (__VLS_ctx.formatDatetime(item.end_datetime));
    // @ts-ignore
    [formatDatetime,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis" },
    });
    (item.description || 'No description provided.');
    var __VLS_122;
    const __VLS_139 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        cols: "12",
        md: "4",
    }));
    const __VLS_141 = __VLS_140({
        cols: "12",
        md: "4",
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    const { default: __VLS_143 } = __VLS_142.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-2" },
    });
    if (item.clubTags?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex flex-wrap ga-1" },
        });
        for (const [tag] of __VLS_getVForSourceType((item.clubTags))) {
            const __VLS_144 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            VChip;
            // @ts-ignore
            const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
                key: (tag),
                size: "small",
                label: true,
                color: "primary",
                variant: "tonal",
            }));
            const __VLS_146 = __VLS_145({
                key: (tag),
                size: "small",
                label: true,
                color: "primary",
                variant: "tonal",
            }, ...__VLS_functionalComponentArgsRest(__VLS_145));
            const { default: __VLS_148 } = __VLS_147.slots;
            (__VLS_ctx.tagLabel(tag));
            // @ts-ignore
            [tagLabel,];
            var __VLS_147;
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-body-2 text-disabled" },
        });
    }
    var __VLS_142;
    var __VLS_117;
    var __VLS_112;
}
var __VLS_105;
var __VLS_90;
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-caption text-medium-emphasis mt-2 ml-1" },
});
var __VLS_80;
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
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
