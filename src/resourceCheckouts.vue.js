import { ref, computed } from 'vue';
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue';
import { feathersClient } from '@/backendAPI';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const loading = ref(false);
const successSnackbar = ref(false);
const errorSnackbar = ref(false);
const errorMessage = ref('');
const currentStep = ref(0);
// ── Step 1: Event Information ──
const p1 = ref({
    full_name: '',
    email: '',
    club_name: '',
    leadership_position: '',
    other_position: '',
    event_title: '',
    checkout_date: '',
    checkout_time: '',
    return_date: '',
    return_time: '',
});
const p1Valid = ref(false);
const leadershipPositions = [
    'President', 'Vice President', 'Treasurer',
    'Advisor', 'Secretary', 'Historian', 'Other',
];
// ── Step 2: Items for Checkout ──
const availableItems = [
    { id: 'first_aid_kit', label: 'Basic First Aid Kit', icon: 'mdi-medical-bag' },
    { id: 'extension_cord', label: 'Extension Cord', icon: 'mdi-power-plug' },
    { id: 'megaphone', label: 'Megaphone', icon: 'mdi-bullhorn' },
    { id: 'recycling_bin', label: 'Recycling Bin', icon: 'mdi-recycle' },
    { id: 'traffic_cones', label: 'Traffic Cones', icon: 'mdi-alert-octagon' },
    { id: 'small_cones', label: 'Small Cones', icon: 'mdi-alert' },
    { id: 'disposable_masks', label: 'Disposable Masks', icon: 'mdi-face-mask' },
    { id: 'hand_sanitizer', label: 'Hand Sanitizer', icon: 'mdi-hand-wash' },
    { id: 'paper_towels', label: 'Paper Towels', icon: 'mdi-paper-roll' },
    { id: 'large_ice_cooler', label: 'Large Ice Cooler (2)', icon: 'mdi-fridge-outline' },
    { id: 'small_cooler', label: 'Small Cooler', icon: 'mdi-fridge' },
    { id: 'beverage_cooler', label: 'Beverage Cooler (3)', icon: 'mdi-cup-water' },
    { id: 'popcorn_machine', label: 'Popcorn Machine', icon: 'mdi-popcorn' },
    { id: 'chafing_dish', label: 'Chafing Dish (4)', icon: 'mdi-pot-steam' },
    { id: 'crock_pot', label: 'Crock Pot (2)', icon: 'mdi-pot' },
    { id: 'fire_extinguisher', label: 'Fire Extinguisher', icon: 'mdi-fire-extinguisher' },
    { id: 'cotton_candy_machine', label: 'Cotton Candy Machine', icon: 'mdi-shaker-outline' },
    { id: 'coffee_urn', label: 'Coffee Urn', icon: 'mdi-coffee' },
    { id: 'tarps', label: 'Tarps', icon: 'mdi-image-filter-hdr' },
    { id: 'cornhole', label: 'Cornhole (3)', icon: 'mdi-bullseye' },
    { id: 'giant_connect_4', label: 'Giant Connect 4', icon: 'mdi-dots-grid' },
    { id: 'spikeball', label: 'Spikeball (3)', icon: 'mdi-volleyball' },
    { id: 'box_of_utensils', label: 'Box of Utensils', icon: 'mdi-silverware-fork-knife' },
    { id: 'water_kettle', label: 'Water Kettle', icon: 'mdi-kettle' },
    { id: 'decibel_meter', label: 'Decibel Meter', icon: 'mdi-volume-high' },
];
const selectedItems = ref([]);
const quantityNotes = ref('');
const p2Valid = ref(false);
// ── Step 3: Acknowledgements ──
const ack = ref({
    return_24hrs: false,
    late_return: false,
    on_campus: false,
    must_clean: false,
    financially_responsible: false,
    policy_warning: false,
    food_equipment: false,
});
const p3Valid = ref(false);
const allSteps = ['event_info', 'items', 'acknowledgements'];
const stepTitles = ['Event Information', 'Items for Checkout', 'Acknowledgements'];
const currentStepId = computed(() => allSteps[currentStep.value]);
const totalSteps = computed(() => allSteps.length);
function nextStep() { if (currentStep.value < totalSteps.value - 1)
    currentStep.value++; }
function prevStep() { if (currentStep.value > 0)
    currentStep.value--; }
function toggleItem(id) {
    const idx = selectedItems.value.indexOf(id);
    if (idx === -1)
        selectedItems.value.push(id);
    else
        selectedItems.value.splice(idx, 1);
}
async function handleSubmit() {
    loading.value = true;
    try {
        const user = authStore.user;
        const membership = await feathersClient.service('Club Membership').find({
            query: { userid: user.user_id, is_active: true, $limit: 1 }
        });
        const rows = membership.data ?? membership;
        const clubId = rows[0]?.clubid;
        await feathersClient.service('resource-checkouts').create({
            club: clubId,
            requested_by: user.user_id,
            ...p1.value,
            requested_items: selectedItems.value,
            quantity_notes: quantityNotes.value,
            ...ack.value,
        });
        successSnackbar.value = true;
        currentStep.value = 0;
    }
    catch (e) {
        errorMessage.value = e?.message || 'Submission failed. Please try again.';
        errorSnackbar.value = true;
    }
    finally {
        loading.value = false;
    }
}
const required = (v) => !!v || 'This field is required.';
const allAcknowledged = computed(() => Object.values(ack.value).every(v => v));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['item-card']} */ ;
/** @type {[typeof DashboardLayout, typeof DashboardLayout, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DashboardLayout, new DashboardLayout({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
const { default: __VLS_4 } = __VLS_2.slots;
const __VLS_5 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
VContainer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    maxWidth: "800",
}));
const __VLS_7 = __VLS_6({
    maxWidth: "800",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-h4 font-weight-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-medium-emphasis mt-1" },
});
const __VLS_18 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-5" },
}));
const __VLS_20 = __VLS_19({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_22 } = __VLS_21.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-body-2 text-medium-emphasis" },
});
(__VLS_ctx.currentStep + 1);
(__VLS_ctx.totalSteps);
// @ts-ignore
[currentStep, totalSteps,];
const __VLS_23 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
VChip;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    color: "primary",
    variant: "tonal",
    size: "small",
}));
const __VLS_25 = __VLS_24({
    color: "primary",
    variant: "tonal",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_27 } = __VLS_26.slots;
(__VLS_ctx.stepTitles[__VLS_ctx.currentStep]);
// @ts-ignore
[currentStep, stepTitles,];
var __VLS_26;
const __VLS_28 = {}.VProgressLinear;
/** @type {[typeof __VLS_components.VProgressLinear, typeof __VLS_components.vProgressLinear, ]} */ ;
// @ts-ignore
VProgressLinear;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (((__VLS_ctx.currentStep + 1) / __VLS_ctx.totalSteps) * 100),
    color: "primary",
    rounded: true,
    height: "6",
    ...{ class: "mt-3" },
}));
const __VLS_30 = __VLS_29({
    modelValue: (((__VLS_ctx.currentStep + 1) / __VLS_ctx.totalSteps) * 100),
    color: "primary",
    rounded: true,
    height: "6",
    ...{ class: "mt-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
// @ts-ignore
[currentStep, totalSteps,];
var __VLS_21;
if (__VLS_ctx.currentStepId === 'event_info') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_33 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_35 = __VLS_34({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const { default: __VLS_37 } = __VLS_36.slots;
    const __VLS_38 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        ...{ class: "pa-6" },
    }));
    const __VLS_40 = __VLS_39({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    const { default: __VLS_42 } = __VLS_41.slots;
    const __VLS_43 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }));
    const __VLS_45 = __VLS_44({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_47 } = __VLS_46.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "font-weight-bold mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "mt-2 ml-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-2 font-weight-bold" },
    });
    var __VLS_46;
    const __VLS_48 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        modelValue: (__VLS_ctx.p1Valid),
    }));
    const __VLS_50 = __VLS_49({
        modelValue: (__VLS_ctx.p1Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const { default: __VLS_52 } = __VLS_51.slots;
    // @ts-ignore
    [p1Valid,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_53 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        modelValue: (__VLS_ctx.p1.full_name),
        label: "Name (First and Last)",
        prependInnerIcon: "mdi-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_55 = __VLS_54({
        modelValue: (__VLS_ctx.p1.full_name),
        label: "Name (First and Last)",
        prependInnerIcon: "mdi-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    // @ts-ignore
    [p1, required,];
    const __VLS_58 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        modelValue: (__VLS_ctx.p1.email),
        label: "Email",
        prependInnerIcon: "mdi-email-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required, (v) => /.+@.+\..+/.test(v) || 'Enter a valid email.']),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_60 = __VLS_59({
        modelValue: (__VLS_ctx.p1.email),
        label: "Email",
        prependInnerIcon: "mdi-email-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required, (v) => /.+@.+\..+/.test(v) || 'Enter a valid email.']),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    // @ts-ignore
    [p1, required,];
    const __VLS_63 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        modelValue: (__VLS_ctx.p1.club_name),
        label: "Club / Organization Name",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_65 = __VLS_64({
        modelValue: (__VLS_ctx.p1.club_name),
        label: "Club / Organization Name",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    // @ts-ignore
    [p1, required,];
    const __VLS_68 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    VSelect;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        modelValue: (__VLS_ctx.p1.leadership_position),
        items: (__VLS_ctx.leadershipPositions),
        label: "Leadership Position in Club / Organization",
        prependInnerIcon: "mdi-badge-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_70 = __VLS_69({
        modelValue: (__VLS_ctx.p1.leadership_position),
        items: (__VLS_ctx.leadershipPositions),
        label: "Leadership Position in Club / Organization",
        prependInnerIcon: "mdi-badge-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    // @ts-ignore
    [p1, required, leadershipPositions,];
    if (__VLS_ctx.p1.leadership_position === 'Other') {
        // @ts-ignore
        [p1,];
        const __VLS_73 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
            modelValue: (__VLS_ctx.p1.other_position),
            label: "Please specify your position",
            prependInnerIcon: "mdi-pencil",
            variant: "outlined",
            ...{ class: "mb-3" },
        }));
        const __VLS_75 = __VLS_74({
            modelValue: (__VLS_ctx.p1.other_position),
            label: "Please specify your position",
            prependInnerIcon: "mdi-pencil",
            variant: "outlined",
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        // @ts-ignore
        [p1,];
    }
    const __VLS_78 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        ...{ class: "my-4" },
    }));
    const __VLS_80 = __VLS_79({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_83 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        modelValue: (__VLS_ctx.p1.event_title),
        label: "Event Title",
        prependInnerIcon: "mdi-calendar-star",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_85 = __VLS_84({
        modelValue: (__VLS_ctx.p1.event_title),
        label: "Event Title",
        prependInnerIcon: "mdi-calendar-star",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    // @ts-ignore
    [p1, required,];
    const __VLS_88 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ class: "my-4" },
    }));
    const __VLS_90 = __VLS_89({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_93 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        dense: true,
    }));
    const __VLS_95 = __VLS_94({
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const { default: __VLS_97 } = __VLS_96.slots;
    const __VLS_98 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        cols: "12",
        sm: "6",
    }));
    const __VLS_100 = __VLS_99({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_102 } = __VLS_101.slots;
    const __VLS_103 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        modelValue: (__VLS_ctx.p1.checkout_date),
        label: "Checkout Date",
        type: "date",
        prependInnerIcon: "mdi-calendar-arrow-right",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_105 = __VLS_104({
        modelValue: (__VLS_ctx.p1.checkout_date),
        label: "Checkout Date",
        type: "date",
        prependInnerIcon: "mdi-calendar-arrow-right",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    // @ts-ignore
    [p1, required,];
    var __VLS_101;
    const __VLS_108 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        cols: "12",
        sm: "6",
    }));
    const __VLS_110 = __VLS_109({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const { default: __VLS_112 } = __VLS_111.slots;
    const __VLS_113 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        modelValue: (__VLS_ctx.p1.checkout_time),
        label: "Checkout Time (e.g. 10:00 AM)",
        prependInnerIcon: "mdi-clock-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        placeholder: "e.g. 10:00 AM",
        required: true,
    }));
    const __VLS_115 = __VLS_114({
        modelValue: (__VLS_ctx.p1.checkout_time),
        label: "Checkout Time (e.g. 10:00 AM)",
        prependInnerIcon: "mdi-clock-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        placeholder: "e.g. 10:00 AM",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    // @ts-ignore
    [p1, required,];
    var __VLS_111;
    var __VLS_96;
    const __VLS_118 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        dense: true,
    }));
    const __VLS_120 = __VLS_119({
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    const { default: __VLS_122 } = __VLS_121.slots;
    const __VLS_123 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        cols: "12",
        sm: "6",
    }));
    const __VLS_125 = __VLS_124({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    const { default: __VLS_127 } = __VLS_126.slots;
    const __VLS_128 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.p1.return_date),
        label: "Return Date",
        type: "date",
        prependInnerIcon: "mdi-calendar-arrow-left",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.p1.return_date),
        label: "Return Date",
        type: "date",
        prependInnerIcon: "mdi-calendar-arrow-left",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    // @ts-ignore
    [p1, required,];
    var __VLS_126;
    const __VLS_133 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
        cols: "12",
        sm: "6",
    }));
    const __VLS_135 = __VLS_134({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    const { default: __VLS_137 } = __VLS_136.slots;
    const __VLS_138 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        modelValue: (__VLS_ctx.p1.return_time),
        label: "Return Time (e.g. 10:00 AM)",
        prependInnerIcon: "mdi-clock-check-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        placeholder: "e.g. 10:00 AM",
        required: true,
    }));
    const __VLS_140 = __VLS_139({
        modelValue: (__VLS_ctx.p1.return_time),
        label: "Return Time (e.g. 10:00 AM)",
        prependInnerIcon: "mdi-clock-check-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        placeholder: "e.g. 10:00 AM",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    // @ts-ignore
    [p1, required,];
    var __VLS_136;
    var __VLS_121;
    var __VLS_51;
    var __VLS_41;
    var __VLS_36;
}
if (__VLS_ctx.currentStepId === 'items') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_143 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_145 = __VLS_144({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    const { default: __VLS_147 } = __VLS_146.slots;
    const __VLS_148 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        ...{ class: "pa-6" },
    }));
    const __VLS_150 = __VLS_149({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const { default: __VLS_152 } = __VLS_151.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-4" },
    });
    const __VLS_153 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }));
    const __VLS_155 = __VLS_154({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    const { default: __VLS_157 } = __VLS_156.slots;
    var __VLS_156;
    const __VLS_158 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        dense: true,
    }));
    const __VLS_160 = __VLS_159({
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    const { default: __VLS_162 } = __VLS_161.slots;
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.availableItems))) {
        // @ts-ignore
        [availableItems,];
        const __VLS_163 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
            key: (item.id),
            cols: "6",
            sm: "4",
            md: "3",
        }));
        const __VLS_165 = __VLS_164({
            key: (item.id),
            cols: "6",
            sm: "4",
            md: "3",
        }, ...__VLS_functionalComponentArgsRest(__VLS_164));
        const { default: __VLS_167 } = __VLS_166.slots;
        const __VLS_168 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        VCard;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            variant: (__VLS_ctx.selectedItems.includes(item.id) ? 'flat' : 'outlined'),
            color: (__VLS_ctx.selectedItems.includes(item.id) ? 'primary' : undefined),
            rounded: "lg",
            ...{ class: "pa-3 text-center cursor-pointer item-card" },
            ...{ class: ({ 'selected-item': __VLS_ctx.selectedItems.includes(item.id) }) },
            hover: true,
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            variant: (__VLS_ctx.selectedItems.includes(item.id) ? 'flat' : 'outlined'),
            color: (__VLS_ctx.selectedItems.includes(item.id) ? 'primary' : undefined),
            rounded: "lg",
            ...{ class: "pa-3 text-center cursor-pointer item-card" },
            ...{ class: ({ 'selected-item': __VLS_ctx.selectedItems.includes(item.id) }) },
            hover: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_172;
        let __VLS_173;
        const __VLS_174 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentStepId === 'items'))
                        return;
                    __VLS_ctx.toggleItem(item.id);
                    // @ts-ignore
                    [selectedItems, selectedItems, selectedItems, toggleItem,];
                } });
        const { default: __VLS_175 } = __VLS_171.slots;
        const __VLS_176 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            icon: (item.icon),
            size: "32",
            color: (__VLS_ctx.selectedItems.includes(item.id) ? 'white' : 'primary'),
            ...{ class: "mb-2" },
        }));
        const __VLS_178 = __VLS_177({
            icon: (item.icon),
            size: "32",
            color: (__VLS_ctx.selectedItems.includes(item.id) ? 'white' : 'primary'),
            ...{ class: "mb-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        // @ts-ignore
        [selectedItems,];
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-caption font-weight-medium ma-0" },
            ...{ class: (__VLS_ctx.selectedItems.includes(item.id) ? 'text-white' : '') },
            ...{ style: {} },
        });
        // @ts-ignore
        [selectedItems,];
        (item.label);
        if (__VLS_ctx.selectedItems.includes(item.id)) {
            // @ts-ignore
            [selectedItems,];
            const __VLS_181 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            VIcon;
            // @ts-ignore
            const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
                icon: "mdi-check-circle",
                size: "16",
                color: "white",
                ...{ class: "mt-1" },
            }));
            const __VLS_183 = __VLS_182({
                icon: "mdi-check-circle",
                size: "16",
                color: "white",
                ...{ class: "mt-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_182));
        }
        var __VLS_171;
        var __VLS_166;
    }
    var __VLS_161;
    if (__VLS_ctx.selectedItems.length === 0) {
        // @ts-ignore
        [selectedItems,];
        const __VLS_186 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
            type: "warning",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mt-4" },
            density: "compact",
        }));
        const __VLS_188 = __VLS_187({
            type: "warning",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mt-4" },
            density: "compact",
        }, ...__VLS_functionalComponentArgsRest(__VLS_187));
        const { default: __VLS_190 } = __VLS_189.slots;
        var __VLS_189;
    }
    if (__VLS_ctx.selectedItems.length > 0) {
        // @ts-ignore
        [selectedItems,];
        const __VLS_191 = {}.VChipGroup;
        /** @type {[typeof __VLS_components.VChipGroup, typeof __VLS_components.vChipGroup, typeof __VLS_components.VChipGroup, typeof __VLS_components.vChipGroup, ]} */ ;
        // @ts-ignore
        VChipGroup;
        // @ts-ignore
        const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
            ...{ class: "mt-4" },
        }));
        const __VLS_193 = __VLS_192({
            ...{ class: "mt-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_192));
        const { default: __VLS_195 } = __VLS_194.slots;
        for (const [id] of __VLS_getVForSourceType((__VLS_ctx.selectedItems))) {
            // @ts-ignore
            [selectedItems,];
            const __VLS_196 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            VChip;
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
                ...{ 'onClick:close': {} },
                key: (id),
                color: "primary",
                variant: "tonal",
                size: "small",
                closable: true,
            }));
            const __VLS_198 = __VLS_197({
                ...{ 'onClick:close': {} },
                key: (id),
                color: "primary",
                variant: "tonal",
                size: "small",
                closable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_197));
            let __VLS_200;
            let __VLS_201;
            const __VLS_202 = ({ 'click:close': {} },
                { 'onClick:close': (...[$event]) => {
                        if (!(__VLS_ctx.currentStepId === 'items'))
                            return;
                        if (!(__VLS_ctx.selectedItems.length > 0))
                            return;
                        __VLS_ctx.toggleItem(id);
                        // @ts-ignore
                        [toggleItem,];
                    } });
            const { default: __VLS_203 } = __VLS_199.slots;
            (__VLS_ctx.availableItems.find(i => i.id === id)?.label);
            // @ts-ignore
            [availableItems,];
            var __VLS_199;
        }
        var __VLS_194;
    }
    const __VLS_204 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        ...{ class: "my-5" },
    }));
    const __VLS_206 = __VLS_205({
        ...{ class: "my-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-2" },
    });
    const __VLS_209 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
        modelValue: (__VLS_ctx.quantityNotes),
        label: "For items with a quantity listed, please specify how many you need. If not applicable, enter N/A.",
        prependInnerIcon: "mdi-counter",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "e.g. 'Large Ice Cooler: 1, Beverage Cooler: 2' or 'N/A'",
        persistentHint: true,
        required: true,
    }));
    const __VLS_211 = __VLS_210({
        modelValue: (__VLS_ctx.quantityNotes),
        label: "For items with a quantity listed, please specify how many you need. If not applicable, enter N/A.",
        prependInnerIcon: "mdi-counter",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "e.g. 'Large Ice Cooler: 1, Beverage Cooler: 2' or 'N/A'",
        persistentHint: true,
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    // @ts-ignore
    [required, quantityNotes,];
    var __VLS_151;
    var __VLS_146;
}
if (__VLS_ctx.currentStepId === 'acknowledgements') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_214 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_216 = __VLS_215({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    const { default: __VLS_218 } = __VLS_217.slots;
    const __VLS_219 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
        ...{ class: "pa-6" },
    }));
    const __VLS_221 = __VLS_220({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_220));
    const { default: __VLS_223 } = __VLS_222.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-4" },
    });
    const __VLS_224 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }));
    const __VLS_226 = __VLS_225({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    const { default: __VLS_228 } = __VLS_227.slots;
    var __VLS_227;
    const __VLS_229 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
        modelValue: (__VLS_ctx.ack.return_24hrs),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_231 = __VLS_230({
        modelValue: (__VLS_ctx.ack.return_24hrs),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
    const { default: __VLS_233 } = __VLS_232.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_234 } = __VLS_232.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_232;
    const __VLS_235 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
        modelValue: (__VLS_ctx.ack.late_return),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_237 = __VLS_236({
        modelValue: (__VLS_ctx.ack.late_return),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
    const { default: __VLS_239 } = __VLS_238.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_240 } = __VLS_238.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_238;
    const __VLS_241 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        modelValue: (__VLS_ctx.ack.on_campus),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_243 = __VLS_242({
        modelValue: (__VLS_ctx.ack.on_campus),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    const { default: __VLS_245 } = __VLS_244.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_246 } = __VLS_244.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_244;
    const __VLS_247 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
        modelValue: (__VLS_ctx.ack.must_clean),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_249 = __VLS_248({
        modelValue: (__VLS_ctx.ack.must_clean),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_248));
    const { default: __VLS_251 } = __VLS_250.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_252 } = __VLS_250.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_250;
    const __VLS_253 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
        modelValue: (__VLS_ctx.ack.financially_responsible),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_255 = __VLS_254({
        modelValue: (__VLS_ctx.ack.financially_responsible),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_254));
    const { default: __VLS_257 } = __VLS_256.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_258 } = __VLS_256.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_256;
    const __VLS_259 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
        modelValue: (__VLS_ctx.ack.policy_warning),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_261 = __VLS_260({
        modelValue: (__VLS_ctx.ack.policy_warning),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    const { default: __VLS_263 } = __VLS_262.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_264 } = __VLS_262.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_262;
    const __VLS_265 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
        modelValue: (__VLS_ctx.ack.food_equipment),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }));
    const __VLS_267 = __VLS_266({
        modelValue: (__VLS_ctx.ack.food_equipment),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    const { default: __VLS_269 } = __VLS_268.slots;
    // @ts-ignore
    [ack,];
    {
        const { label: __VLS_270 } = __VLS_268.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_268;
    const __VLS_271 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mt-4" },
        density: "compact",
    }));
    const __VLS_273 = __VLS_272({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mt-4" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_272));
    const { default: __VLS_275 } = __VLS_274.slots;
    var __VLS_274;
    var __VLS_222;
    var __VLS_217;
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex justify-space-between mt-5" },
});
if (__VLS_ctx.currentStep > 0) {
    // @ts-ignore
    [currentStep,];
    const __VLS_276 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        ...{ 'onClick': {} },
        variant: "outlined",
        color: "secondary",
        prependIcon: "mdi-arrow-left",
        rounded: "lg",
    }));
    const __VLS_278 = __VLS_277({
        ...{ 'onClick': {} },
        variant: "outlined",
        color: "secondary",
        prependIcon: "mdi-arrow-left",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    let __VLS_280;
    let __VLS_281;
    const __VLS_282 = ({ click: {} },
        { onClick: (__VLS_ctx.prevStep) });
    const { default: __VLS_283 } = __VLS_279.slots;
    // @ts-ignore
    [prevStep,];
    var __VLS_279;
}
else {
    const __VLS_284 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    VSpacer;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({}));
    const __VLS_286 = __VLS_285({}, ...__VLS_functionalComponentArgsRest(__VLS_285));
}
if (__VLS_ctx.currentStepId !== 'acknowledgements') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_289 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
        ...{ 'onClick': {} },
        color: "primary",
        appendIcon: "mdi-arrow-right",
        rounded: "lg",
        disabled: (__VLS_ctx.currentStepId === 'items' && __VLS_ctx.selectedItems.length === 0),
    }));
    const __VLS_291 = __VLS_290({
        ...{ 'onClick': {} },
        color: "primary",
        appendIcon: "mdi-arrow-right",
        rounded: "lg",
        disabled: (__VLS_ctx.currentStepId === 'items' && __VLS_ctx.selectedItems.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    let __VLS_293;
    let __VLS_294;
    const __VLS_295 = ({ click: {} },
        { onClick: (__VLS_ctx.nextStep) });
    const { default: __VLS_296 } = __VLS_292.slots;
    // @ts-ignore
    [currentStepId, selectedItems, nextStep,];
    var __VLS_292;
}
else {
    const __VLS_297 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        ...{ 'onClick': {} },
        color: "primary",
        prependIcon: "mdi-send",
        rounded: "lg",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.allAcknowledged),
    }));
    const __VLS_299 = __VLS_298({
        ...{ 'onClick': {} },
        color: "primary",
        prependIcon: "mdi-send",
        rounded: "lg",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.allAcknowledged),
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    let __VLS_301;
    let __VLS_302;
    const __VLS_303 = ({ click: {} },
        { onClick: (__VLS_ctx.handleSubmit) });
    const { default: __VLS_304 } = __VLS_300.slots;
    // @ts-ignore
    [loading, allAcknowledged, handleSubmit,];
    var __VLS_300;
}
var __VLS_8;
const __VLS_305 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
    modelValue: (__VLS_ctx.successSnackbar),
    color: "success",
    timeout: "4000",
}));
const __VLS_307 = __VLS_306({
    modelValue: (__VLS_ctx.successSnackbar),
    color: "success",
    timeout: "4000",
}, ...__VLS_functionalComponentArgsRest(__VLS_306));
const { default: __VLS_309 } = __VLS_308.slots;
// @ts-ignore
[successSnackbar,];
const __VLS_310 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    start: true,
}));
const __VLS_312 = __VLS_311({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
const { default: __VLS_314 } = __VLS_313.slots;
var __VLS_313;
var __VLS_308;
const __VLS_315 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_316 = __VLS_asFunctionalComponent(__VLS_315, new __VLS_315({
    modelValue: (__VLS_ctx.errorSnackbar),
    color: "error",
    timeout: "4000",
}));
const __VLS_317 = __VLS_316({
    modelValue: (__VLS_ctx.errorSnackbar),
    color: "error",
    timeout: "4000",
}, ...__VLS_functionalComponentArgsRest(__VLS_316));
const { default: __VLS_319 } = __VLS_318.slots;
// @ts-ignore
[errorSnackbar,];
const __VLS_320 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    start: true,
}));
const __VLS_322 = __VLS_321({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
const { default: __VLS_324 } = __VLS_323.slots;
var __VLS_323;
(__VLS_ctx.errorMessage);
// @ts-ignore
[errorMessage,];
var __VLS_318;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['item-card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-item']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ma-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
