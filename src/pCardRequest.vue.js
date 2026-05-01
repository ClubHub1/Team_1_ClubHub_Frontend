import { ref, computed } from 'vue';
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue';
import { feathersClient } from '@/backendAPI';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const loading = ref(false);
const successSnackbar = ref(false);
const errorSnackbar = ref(false);
const errorMessage = ref('');
// ── Step tracking ──
const currentStep = ref(0);
// ── Page 1: Credit Card Request Form ──
const p1 = ref({
    first_name: '',
    last_name: '',
    club_name: '',
    packages_delivered: null,
    is_travel: null,
    is_gift: null,
    is_print: null,
    is_event: null,
    num_vendors: null,
    funding_sources: [],
    transaction_detail: '',
    asun_funding_info: '',
});
const p1Valid = ref(false);
// ── Page 2: Prize/Gift/Award ──
const p2 = ref({
    prize_receipt_acknowledged: false,
});
const p2Valid = ref(false);
// ── Page 3: UNR Name/Logo ──
const p3 = ref({
    using_unr_logo: null,
});
const p3Valid = ref(false);
// ── Page 4: Item Description (logo) ──
const p4 = ref({
    logo_description: '',
});
const p4Valid = ref(false);
// ── Page 5: Print Service ──
const p5 = ref({
    design_file_url: '',
    print_release_number: '',
});
const p5Valid = ref(false);
// ── Page 6: Event/Meeting/Gathering ──
const p6 = ref({
    event_name: '',
    event_location: '',
    event_date: '',
    event_timeframe: '',
    num_attendees: null,
    attendee_names: '',
    flyer_url: '',
});
const p6Valid = ref(false);
// ── Page 7: Invoices/Receipts per vendor ──
const vendors = ref([{
        receipt_url: '',
        vendor_name: '',
        approximate_amount: null,
        items_to_purchase: '',
        reason_for_purchase: '',
    }]);
// ── Page 8: ASUN/CSE Department Funding ──
const p8 = ref({
    department_account: '',
    budget_approved: null,
});
const p8Valid = ref(false);
// ── Page 9: Public Meeting Approval ──
const p9 = ref({
    public_meeting_date: '',
});
const p9Valid = ref(false);
// ── Page 10: Final / Signatures ──
const p10 = ref({
    email: '',
    asun_employee_verified: false,
    officer_signature: false,
    faculty_signature: false,
});
const p10Valid = ref(false);
const departmentAccounts = [
    'PG00092: Center For Student Engagement',
    'PG1984: ASUN Book Fund',
    'PG00137: Pack Rides-Recharge',
    'PG00275: ASUN Capital Account',
    'PG00401: Sagebrush',
    'PG01154: Milton Glick Undergrad Journal',
    'PG01395: ASUN Senate',
    'PG02201: Brushfire',
    'PG03044: ASUN Government Affairs',
    'PG03085: Fall & Spring Concerts',
    'PG03086: Blue Crew',
    'PG03506: 5% Contingency Fund',
    'PG03847: Inkblot Promotions',
    'PG03922: Elections',
    'PG03984: Clubs & Organizations Board',
    'PG03996: ASUN Executive Board',
];
const fundingSources = [
    'Club Account',
    'Club Support Funding',
    'ASUN/CSE Department',
    'The Nevada Sagebrush',
];
// Build step list dynamically based on selections
const steps = computed(() => {
    const list = [{ id: 'main', title: 'Credit Card Request Form' }];
    if (p1.value.is_gift)
        list.push({ id: 'gift', title: 'Prize / Gift / Award' });
    if (p3.value.using_unr_logo)
        list.push({ id: 'logo_desc', title: 'Item Description' });
    if (p1.value.using_unr_logo_question)
        list.push({ id: 'unr_logo', title: 'Use of UNR Name / Logo' });
    if (p1.value.is_print)
        list.push({ id: 'print', title: 'Stickers, Posters, Banner, Apparel, Tablecloth or Clothing' });
    if (p1.value.is_event)
        list.push({ id: 'event', title: 'Event / Meeting / Gathering' });
    list.push({ id: 'vendors', title: 'Invoices / Receipts' });
    if (p1.value.funding_sources.includes('ASUN/CSE Department'))
        list.push({ id: 'dept_funding', title: 'ASUN/CSE Department Funding' });
    if (p8.value.budget_approved === 'Yes')
        list.push({ id: 'public_meeting', title: 'Public Meeting Approval' });
    list.push({ id: 'final', title: 'Signatures & Submission' });
    return list;
});
// Simpler flat step array
const allSteps = computed(() => {
    const s = ['main'];
    if (p1.value.is_gift)
        s.push('gift');
    s.push('unr_logo');
    if (p3.value.using_unr_logo)
        s.push('logo_desc');
    if (p1.value.is_print)
        s.push('print');
    if (p1.value.is_event)
        s.push('event');
    s.push('vendors');
    if (p1.value.funding_sources.includes('ASUN/CSE Department'))
        s.push('dept_funding');
    if (p8.value.budget_approved === 'Yes')
        s.push('public_meeting');
    s.push('final');
    return s;
});
const currentStepId = computed(() => allSteps.value[currentStep.value] ?? 'main');
const totalSteps = computed(() => allSteps.value.length);
function nextStep() {
    if (currentStep.value < totalSteps.value - 1)
        currentStep.value++;
}
function prevStep() {
    if (currentStep.value > 0)
        currentStep.value--;
}
// Sync vendor count
function updateVendorCount(n) {
    p1.value.num_vendors = n;
    while (vendors.value.length < n) {
        vendors.value.push({ receipt_url: '', vendor_name: '', approximate_amount: null, items_to_purchase: '', reason_for_purchase: '' });
    }
    vendors.value = vendors.value.slice(0, n);
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
        await feathersClient.service('p-card-requests').create({
            club: clubId,
            requested_by: user.user_id,
            ...p1.value,
            ...p2.value,
            ...p3.value,
            ...p4.value,
            ...p5.value,
            ...p6.value,
            vendors: vendors.value,
            ...p8.value,
            ...p9.value,
            ...p10.value,
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
const positiveNumber = (v) => (!!v && Number(v) > 0) || 'Must be a positive number.';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
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
(__VLS_ctx.allSteps[__VLS_ctx.currentStep] === 'main' ? 'Credit Card Request' : __VLS_ctx.steps.find(s => s.id === __VLS_ctx.currentStepId)?.title ?? '');
// @ts-ignore
[currentStep, allSteps, steps, currentStepId,];
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
if (__VLS_ctx.currentStepId === 'main') {
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
        ...{ class: "mb-3" },
        density: "compact",
    }));
    const __VLS_45 = __VLS_44({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-3" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_47 } = __VLS_46.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    var __VLS_46;
    const __VLS_48 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        type: "warning",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-3" },
        density: "compact",
    }));
    const __VLS_50 = __VLS_49({
        type: "warning",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-3" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const { default: __VLS_52 } = __VLS_51.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    var __VLS_51;
    const __VLS_53 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-3" },
        density: "compact",
    }));
    const __VLS_55 = __VLS_54({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-3" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const { default: __VLS_57 } = __VLS_56.slots;
    var __VLS_56;
    const __VLS_58 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        type: "warning",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }));
    const __VLS_60 = __VLS_59({
        type: "warning",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_62 } = __VLS_61.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    var __VLS_61;
    const __VLS_63 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        modelValue: (__VLS_ctx.p1Valid),
    }));
    const __VLS_65 = __VLS_64({
        modelValue: (__VLS_ctx.p1Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_67 } = __VLS_66.slots;
    // @ts-ignore
    [p1Valid,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_68 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        dense: true,
    }));
    const __VLS_70 = __VLS_69({
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const { default: __VLS_72 } = __VLS_71.slots;
    const __VLS_73 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        cols: "12",
        sm: "6",
    }));
    const __VLS_75 = __VLS_74({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const { default: __VLS_77 } = __VLS_76.slots;
    const __VLS_78 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        modelValue: (__VLS_ctx.p1.first_name),
        label: "First Name",
        prependInnerIcon: "mdi-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_80 = __VLS_79({
        modelValue: (__VLS_ctx.p1.first_name),
        label: "First Name",
        prependInnerIcon: "mdi-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    // @ts-ignore
    [p1, required,];
    var __VLS_76;
    const __VLS_83 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        cols: "12",
        sm: "6",
    }));
    const __VLS_85 = __VLS_84({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    const { default: __VLS_87 } = __VLS_86.slots;
    const __VLS_88 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.p1.last_name),
        label: "Last Name",
        prependInnerIcon: "mdi-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.p1.last_name),
        label: "Last Name",
        prependInnerIcon: "mdi-account",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    // @ts-ignore
    [p1, required,];
    var __VLS_86;
    var __VLS_71;
    const __VLS_93 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        modelValue: (__VLS_ctx.p1.club_name),
        label: "Which club, organization, or department is this request for? (As it appears on your PG account)",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "e.g. 'Example Club' or 'Center for Student Engagement'",
        persistentHint: true,
        ...{ class: "mb-4" },
        required: true,
    }));
    const __VLS_95 = __VLS_94({
        modelValue: (__VLS_ctx.p1.club_name),
        label: "Which club, organization, or department is this request for? (As it appears on your PG account)",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "e.g. 'Example Club' or 'Center for Student Engagement'",
        persistentHint: true,
        ...{ class: "mb-4" },
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    // @ts-ignore
    [p1, required,];
    const __VLS_98 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }));
    const __VLS_100 = __VLS_99({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_102 } = __VLS_101.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    var __VLS_101;
    const __VLS_103 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        ...{ class: "my-4" },
    }));
    const __VLS_105 = __VLS_104({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-caption text-medium-emphasis mb-2" },
    });
    const __VLS_108 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.p1.packages_delivered),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.p1.packages_delivered),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const { default: __VLS_112 } = __VLS_111.slots;
    // @ts-ignore
    [p1,];
    const __VLS_113 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        label: "Yes",
        value: (true),
        color: "primary",
    }));
    const __VLS_115 = __VLS_114({
        label: "Yes",
        value: (true),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    const __VLS_118 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        label: "No",
        value: (false),
        color: "primary",
    }));
    const __VLS_120 = __VLS_119({
        label: "No",
        value: (false),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    var __VLS_111;
    if (__VLS_ctx.p1.packages_delivered) {
        // @ts-ignore
        [p1,];
        const __VLS_123 = {}.VAlert;
        /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
        // @ts-ignore
        VAlert;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
            type: "warning",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
            density: "compact",
        }));
        const __VLS_125 = __VLS_124({
            type: "warning",
            variant: "tonal",
            rounded: "lg",
            ...{ class: "mb-4" },
            density: "compact",
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        const { default: __VLS_127 } = __VLS_126.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.br)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.br)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.br)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.br)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        var __VLS_126;
    }
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-caption text-medium-emphasis mb-2" },
    });
    const __VLS_128 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.p1.is_travel),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.p1.is_travel),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    const { default: __VLS_132 } = __VLS_131.slots;
    // @ts-ignore
    [p1,];
    const __VLS_133 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
        label: "Yes",
        value: (true),
        color: "primary",
    }));
    const __VLS_135 = __VLS_134({
        label: "Yes",
        value: (true),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    const __VLS_138 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        label: "No",
        value: (false),
        color: "primary",
    }));
    const __VLS_140 = __VLS_139({
        label: "No",
        value: (false),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    var __VLS_131;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    const __VLS_143 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        modelValue: (__VLS_ctx.p1.is_gift),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_145 = __VLS_144({
        modelValue: (__VLS_ctx.p1.is_gift),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    const { default: __VLS_147 } = __VLS_146.slots;
    // @ts-ignore
    [p1,];
    const __VLS_148 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        label: "Yes",
        value: (true),
        color: "primary",
    }));
    const __VLS_150 = __VLS_149({
        label: "Yes",
        value: (true),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const __VLS_153 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
        label: "No",
        value: (false),
        color: "primary",
    }));
    const __VLS_155 = __VLS_154({
        label: "No",
        value: (false),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    var __VLS_146;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    const __VLS_158 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        modelValue: (__VLS_ctx.p1.is_print),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_160 = __VLS_159({
        modelValue: (__VLS_ctx.p1.is_print),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    const { default: __VLS_162 } = __VLS_161.slots;
    // @ts-ignore
    [p1,];
    const __VLS_163 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
        label: "Yes",
        value: (true),
        color: "primary",
    }));
    const __VLS_165 = __VLS_164({
        label: "Yes",
        value: (true),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    const __VLS_168 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        label: "No",
        value: (false),
        color: "primary",
    }));
    const __VLS_170 = __VLS_169({
        label: "No",
        value: (false),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    var __VLS_161;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    const __VLS_173 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        modelValue: (__VLS_ctx.p1.is_event),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_175 = __VLS_174({
        modelValue: (__VLS_ctx.p1.is_event),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    const { default: __VLS_177 } = __VLS_176.slots;
    // @ts-ignore
    [p1,];
    const __VLS_178 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
        label: "Yes",
        value: (true),
        color: "primary",
    }));
    const __VLS_180 = __VLS_179({
        label: "Yes",
        value: (true),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    const __VLS_183 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        label: "No",
        value: (false),
        color: "primary",
    }));
    const __VLS_185 = __VLS_184({
        label: "No",
        value: (false),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    var __VLS_176;
    const __VLS_188 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        ...{ class: "my-4" },
    }));
    const __VLS_190 = __VLS_189({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    const __VLS_193 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
        modelValue: (__VLS_ctx.p1.num_vendors),
        rules: ([v => !!v || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_195 = __VLS_194({
        modelValue: (__VLS_ctx.p1.num_vendors),
        rules: ([v => !!v || 'Required.']),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    const { default: __VLS_197 } = __VLS_196.slots;
    // @ts-ignore
    [p1,];
    for (const [n] of __VLS_getVForSourceType(([1, 2, 3, 4, 5]))) {
        const __VLS_198 = {}.VRadio;
        /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
        // @ts-ignore
        VRadio;
        // @ts-ignore
        const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
            ...{ 'onClick': {} },
            key: (n),
            label: (String(n)),
            value: (n),
            color: "primary",
        }));
        const __VLS_200 = __VLS_199({
            ...{ 'onClick': {} },
            key: (n),
            label: (String(n)),
            value: (n),
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_199));
        let __VLS_202;
        let __VLS_203;
        const __VLS_204 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentStepId === 'main'))
                        return;
                    __VLS_ctx.updateVendorCount(n);
                    // @ts-ignore
                    [updateVendorCount,];
                } });
        var __VLS_201;
    }
    var __VLS_196;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    for (const [src] of __VLS_getVForSourceType((__VLS_ctx.fundingSources))) {
        // @ts-ignore
        [fundingSources,];
        const __VLS_206 = {}.VCheckbox;
        /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
        // @ts-ignore
        VCheckbox;
        // @ts-ignore
        const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
            key: (src),
            modelValue: (__VLS_ctx.p1.funding_sources),
            label: (src),
            value: (src),
            color: "primary",
            density: "compact",
            hideDetails: true,
        }));
        const __VLS_208 = __VLS_207({
            key: (src),
            modelValue: (__VLS_ctx.p1.funding_sources),
            label: (src),
            value: (src),
            color: "primary",
            density: "compact",
            hideDetails: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_207));
        // @ts-ignore
        [p1,];
    }
    const __VLS_211 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
        ...{ class: "my-4" },
    }));
    const __VLS_213 = __VLS_212({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_216 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        modelValue: (__VLS_ctx.p1.transaction_detail),
        label: "Please explain in detail what this transaction is for.",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "5",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_218 = __VLS_217({
        modelValue: (__VLS_ctx.p1.transaction_detail),
        label: "Please explain in detail what this transaction is for.",
        prependInnerIcon: "mdi-text-box",
        variant: "outlined",
        rows: "5",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    // @ts-ignore
    [p1, required,];
    const __VLS_221 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
        modelValue: (__VLS_ctx.p1.asun_funding_info),
        label: "If your club received funding from ASUN, include the date and amount funded (optional)",
        prependInnerIcon: "mdi-information-outline",
        variant: "outlined",
        hint: "e.g. 'Funded $500 on March 1, 2025'",
        persistentHint: true,
    }));
    const __VLS_223 = __VLS_222({
        modelValue: (__VLS_ctx.p1.asun_funding_info),
        label: "If your club received funding from ASUN, include the date and amount funded (optional)",
        prependInnerIcon: "mdi-information-outline",
        variant: "outlined",
        hint: "e.g. 'Funded $500 on March 1, 2025'",
        persistentHint: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    // @ts-ignore
    [p1,];
    var __VLS_66;
    var __VLS_41;
    var __VLS_36;
}
if (__VLS_ctx.currentStepId === 'gift') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_226 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_228 = __VLS_227({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    const { default: __VLS_230 } = __VLS_229.slots;
    const __VLS_231 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
        ...{ class: "pa-6" },
    }));
    const __VLS_233 = __VLS_232({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_232));
    const { default: __VLS_235 } = __VLS_234.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_236 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }));
    const __VLS_238 = __VLS_237({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-5" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    const { default: __VLS_240 } = __VLS_239.slots;
    var __VLS_239;
    const __VLS_241 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        modelValue: (__VLS_ctx.p2Valid),
    }));
    const __VLS_243 = __VLS_242({
        modelValue: (__VLS_ctx.p2Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    const { default: __VLS_245 } = __VLS_244.slots;
    // @ts-ignore
    [p2Valid,];
    const __VLS_246 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
        modelValue: (__VLS_ctx.p2.prize_receipt_acknowledged),
        color: "primary",
        rules: ([v => !!v || 'You must acknowledge this requirement.']),
    }));
    const __VLS_248 = __VLS_247({
        modelValue: (__VLS_ctx.p2.prize_receipt_acknowledged),
        color: "primary",
        rules: ([v => !!v || 'You must acknowledge this requirement.']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    const { default: __VLS_250 } = __VLS_249.slots;
    // @ts-ignore
    [p2,];
    {
        const { label: __VLS_251 } = __VLS_249.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    var __VLS_249;
    var __VLS_244;
    var __VLS_234;
    var __VLS_229;
}
if (__VLS_ctx.currentStepId === 'unr_logo') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_252 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_254 = __VLS_253({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    const { default: __VLS_256 } = __VLS_255.slots;
    const __VLS_257 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
        ...{ class: "pa-6" },
    }));
    const __VLS_259 = __VLS_258({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    const { default: __VLS_261 } = __VLS_260.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_262 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
        modelValue: (__VLS_ctx.p3Valid),
    }));
    const __VLS_264 = __VLS_263({
        modelValue: (__VLS_ctx.p3Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    const { default: __VLS_266 } = __VLS_265.slots;
    // @ts-ignore
    [p3Valid,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    const __VLS_267 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
        modelValue: (__VLS_ctx.p3.using_unr_logo),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
    }));
    const __VLS_269 = __VLS_268({
        modelValue: (__VLS_ctx.p3.using_unr_logo),
        rules: ([v => v !== null || 'Required.']),
        inline: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    const { default: __VLS_271 } = __VLS_270.slots;
    // @ts-ignore
    [p3,];
    const __VLS_272 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        label: "Yes",
        value: (true),
        color: "primary",
    }));
    const __VLS_274 = __VLS_273({
        label: "Yes",
        value: (true),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    const __VLS_277 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
        label: "No",
        value: (false),
        color: "primary",
    }));
    const __VLS_279 = __VLS_278({
        label: "No",
        value: (false),
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    var __VLS_270;
    var __VLS_265;
    var __VLS_260;
    var __VLS_255;
}
if (__VLS_ctx.currentStepId === 'logo_desc') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_282 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_284 = __VLS_283({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_283));
    const { default: __VLS_286 } = __VLS_285.slots;
    const __VLS_287 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
        ...{ class: "pa-6" },
    }));
    const __VLS_289 = __VLS_288({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_288));
    const { default: __VLS_291 } = __VLS_290.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_292 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        modelValue: (__VLS_ctx.p4Valid),
    }));
    const __VLS_294 = __VLS_293({
        modelValue: (__VLS_ctx.p4Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    const { default: __VLS_296 } = __VLS_295.slots;
    // @ts-ignore
    [p4Valid,];
    const __VLS_297 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        modelValue: (__VLS_ctx.p4.logo_description),
        label: "Please describe your use of the University's name/logo in your requested items",
        prependInnerIcon: "mdi-image-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_299 = __VLS_298({
        modelValue: (__VLS_ctx.p4.logo_description),
        label: "Please describe your use of the University's name/logo in your requested items",
        prependInnerIcon: "mdi-image-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    // @ts-ignore
    [required, p4,];
    var __VLS_295;
    var __VLS_290;
    var __VLS_285;
}
if (__VLS_ctx.currentStepId === 'print') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_302 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_304 = __VLS_303({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_303));
    const { default: __VLS_306 } = __VLS_305.slots;
    const __VLS_307 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
        ...{ class: "pa-6" },
    }));
    const __VLS_309 = __VLS_308({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_308));
    const { default: __VLS_311 } = __VLS_310.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_312 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }));
    const __VLS_314 = __VLS_313({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    const { default: __VLS_316 } = __VLS_315.slots;
    var __VLS_315;
    const __VLS_317 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
        modelValue: (__VLS_ctx.p5Valid),
    }));
    const __VLS_319 = __VLS_318({
        modelValue: (__VLS_ctx.p5Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_318));
    const { default: __VLS_321 } = __VLS_320.slots;
    // @ts-ignore
    [p5Valid,];
    const __VLS_322 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
        modelValue: (__VLS_ctx.p5.design_file_url),
        label: "Design File URL (link to complete design of the item)",
        prependInnerIcon: "mdi-file-image-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "Paste a Google Drive, Dropbox, or other link to your design file",
        persistentHint: true,
        ...{ class: "mb-4" },
        required: true,
    }));
    const __VLS_324 = __VLS_323({
        modelValue: (__VLS_ctx.p5.design_file_url),
        label: "Design File URL (link to complete design of the item)",
        prependInnerIcon: "mdi-file-image-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "Paste a Google Drive, Dropbox, or other link to your design file",
        persistentHint: true,
        ...{ class: "mb-4" },
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_323));
    // @ts-ignore
    [required, p5,];
    const __VLS_327 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_328 = __VLS_asFunctionalComponent(__VLS_327, new __VLS_327({
        modelValue: (__VLS_ctx.p5.print_release_number),
        label: "Print Release Number",
        prependInnerIcon: "mdi-pound",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_329 = __VLS_328({
        modelValue: (__VLS_ctx.p5.print_release_number),
        label: "Print Release Number",
        prependInnerIcon: "mdi-pound",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_328));
    // @ts-ignore
    [required, p5,];
    var __VLS_320;
    var __VLS_310;
    var __VLS_305;
}
if (__VLS_ctx.currentStepId === 'event') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_332 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_334 = __VLS_333({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    const { default: __VLS_336 } = __VLS_335.slots;
    const __VLS_337 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_338 = __VLS_asFunctionalComponent(__VLS_337, new __VLS_337({
        ...{ class: "pa-6" },
    }));
    const __VLS_339 = __VLS_338({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_338));
    const { default: __VLS_341 } = __VLS_340.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_342 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
        modelValue: (__VLS_ctx.p6Valid),
    }));
    const __VLS_344 = __VLS_343({
        modelValue: (__VLS_ctx.p6Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_343));
    const { default: __VLS_346 } = __VLS_345.slots;
    // @ts-ignore
    [p6Valid,];
    const __VLS_347 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_348 = __VLS_asFunctionalComponent(__VLS_347, new __VLS_347({
        modelValue: (__VLS_ctx.p6.event_name),
        label: "Name of the Event",
        prependInnerIcon: "mdi-calendar-star",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_349 = __VLS_348({
        modelValue: (__VLS_ctx.p6.event_name),
        label: "Name of the Event",
        prependInnerIcon: "mdi-calendar-star",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_348));
    // @ts-ignore
    [required, p6,];
    const __VLS_352 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
        modelValue: (__VLS_ctx.p6.event_location),
        label: "Location of Event",
        prependInnerIcon: "mdi-map-marker",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_354 = __VLS_353({
        modelValue: (__VLS_ctx.p6.event_location),
        label: "Location of Event",
        prependInnerIcon: "mdi-map-marker",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    // @ts-ignore
    [required, p6,];
    const __VLS_357 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_358 = __VLS_asFunctionalComponent(__VLS_357, new __VLS_357({
        dense: true,
    }));
    const __VLS_359 = __VLS_358({
        dense: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_358));
    const { default: __VLS_361 } = __VLS_360.slots;
    const __VLS_362 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
        cols: "12",
        sm: "6",
    }));
    const __VLS_364 = __VLS_363({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_363));
    const { default: __VLS_366 } = __VLS_365.slots;
    const __VLS_367 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_368 = __VLS_asFunctionalComponent(__VLS_367, new __VLS_367({
        modelValue: (__VLS_ctx.p6.event_date),
        label: "Date of the Event",
        type: "date",
        prependInnerIcon: "mdi-calendar",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_369 = __VLS_368({
        modelValue: (__VLS_ctx.p6.event_date),
        label: "Date of the Event",
        type: "date",
        prependInnerIcon: "mdi-calendar",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_368));
    // @ts-ignore
    [required, p6,];
    var __VLS_365;
    const __VLS_372 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        cols: "12",
        sm: "6",
    }));
    const __VLS_374 = __VLS_373({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    const { default: __VLS_376 } = __VLS_375.slots;
    const __VLS_377 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
        modelValue: (__VLS_ctx.p6.event_timeframe),
        label: "Time Frame of the Event",
        prependInnerIcon: "mdi-clock-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        placeholder: "e.g. 2:00 PM – 5:00 PM",
        required: true,
    }));
    const __VLS_379 = __VLS_378({
        modelValue: (__VLS_ctx.p6.event_timeframe),
        label: "Time Frame of the Event",
        prependInnerIcon: "mdi-clock-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        placeholder: "e.g. 2:00 PM – 5:00 PM",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_378));
    // @ts-ignore
    [required, p6,];
    var __VLS_375;
    var __VLS_360;
    const __VLS_382 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
        modelValue: (__VLS_ctx.p6.num_attendees),
        modelModifiers: { number: true, },
        label: "Number of People in Attendance",
        type: "number",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        rules: ([__VLS_ctx.required, __VLS_ctx.positiveNumber]),
        required: true,
        ...{ class: "mb-3" },
    }));
    const __VLS_384 = __VLS_383({
        modelValue: (__VLS_ctx.p6.num_attendees),
        modelModifiers: { number: true, },
        label: "Number of People in Attendance",
        type: "number",
        prependInnerIcon: "mdi-account-group",
        variant: "outlined",
        rules: ([__VLS_ctx.required, __VLS_ctx.positiveNumber]),
        required: true,
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_383));
    // @ts-ignore
    [required, p6, positiveNumber,];
    const __VLS_387 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
        ...{ class: "my-4" },
    }));
    const __VLS_389 = __VLS_388({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_388));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_392 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        modelValue: (__VLS_ctx.p6.attendee_names),
        label: "If your event provides food for 20 people or less, list the names of attendees (one per line)",
        prependInnerIcon: "mdi-format-list-bulleted",
        variant: "outlined",
        rows: "5",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_394 = __VLS_393({
        modelValue: (__VLS_ctx.p6.attendee_names),
        label: "If your event provides food for 20 people or less, list the names of attendees (one per line)",
        prependInnerIcon: "mdi-format-list-bulleted",
        variant: "outlined",
        rows: "5",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    // @ts-ignore
    [required, p6,];
    const __VLS_397 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_398 = __VLS_asFunctionalComponent(__VLS_397, new __VLS_397({
        ...{ class: "my-4" },
    }));
    const __VLS_399 = __VLS_398({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_398));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_402 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
        modelValue: (__VLS_ctx.p6.flyer_url),
        label: "Event Flyer URL (required — include meeting agenda with Approved Budget if ASUN-related)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "Paste a Google Drive or other link to your event flyer",
        persistentHint: true,
        required: true,
    }));
    const __VLS_404 = __VLS_403({
        modelValue: (__VLS_ctx.p6.flyer_url),
        label: "Event Flyer URL (required — include meeting agenda with Approved Budget if ASUN-related)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        hint: "Paste a Google Drive or other link to your event flyer",
        persistentHint: true,
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    // @ts-ignore
    [required, p6,];
    var __VLS_345;
    var __VLS_340;
    var __VLS_335;
}
if (__VLS_ctx.currentStepId === 'vendors') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_407 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_408 = __VLS_asFunctionalComponent(__VLS_407, new __VLS_407({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_409 = __VLS_408({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_408));
    const { default: __VLS_411 } = __VLS_410.slots;
    const __VLS_412 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        ...{ class: "pa-6" },
    }));
    const __VLS_414 = __VLS_413({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    const { default: __VLS_416 } = __VLS_415.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-5" },
    });
    for (const [vendor, i] of __VLS_getVForSourceType((__VLS_ctx.vendors))) {
        // @ts-ignore
        [vendors,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (i),
        });
        if (i > 0) {
            const __VLS_417 = {}.VDivider;
            /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
            // @ts-ignore
            VDivider;
            // @ts-ignore
            const __VLS_418 = __VLS_asFunctionalComponent(__VLS_417, new __VLS_417({
                ...{ class: "my-6" },
            }));
            const __VLS_419 = __VLS_418({
                ...{ class: "my-6" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_418));
        }
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-overline text-primary mb-3" },
        });
        (i + 1);
        const __VLS_422 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
            modelValue: (vendor.receipt_url),
            label: (`Receipt / Invoice URL — Vendor #${i + 1}`),
            prependInnerIcon: "mdi-paperclip",
            variant: "outlined",
            hint: "Paste a link to a scanned receipt or invoice",
            persistentHint: true,
            ...{ class: "mb-3" },
        }));
        const __VLS_424 = __VLS_423({
            modelValue: (vendor.receipt_url),
            label: (`Receipt / Invoice URL — Vendor #${i + 1}`),
            prependInnerIcon: "mdi-paperclip",
            variant: "outlined",
            hint: "Paste a link to a scanned receipt or invoice",
            persistentHint: true,
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_423));
        const __VLS_427 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_428 = __VLS_asFunctionalComponent(__VLS_427, new __VLS_427({
            modelValue: (vendor.vendor_name),
            label: (`Vendor #${i + 1} Name`),
            prependInnerIcon: "mdi-store",
            variant: "outlined",
            rules: ([__VLS_ctx.required]),
            required: true,
            ...{ class: "mb-3" },
        }));
        const __VLS_429 = __VLS_428({
            modelValue: (vendor.vendor_name),
            label: (`Vendor #${i + 1} Name`),
            prependInnerIcon: "mdi-store",
            variant: "outlined",
            rules: ([__VLS_ctx.required]),
            required: true,
            ...{ class: "mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_428));
        // @ts-ignore
        [required,];
        const __VLS_432 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        VRow;
        // @ts-ignore
        const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
            dense: true,
        }));
        const __VLS_434 = __VLS_433({
            dense: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_433));
        const { default: __VLS_436 } = __VLS_435.slots;
        const __VLS_437 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_438 = __VLS_asFunctionalComponent(__VLS_437, new __VLS_437({
            cols: "12",
            sm: "6",
        }));
        const __VLS_439 = __VLS_438({
            cols: "12",
            sm: "6",
        }, ...__VLS_functionalComponentArgsRest(__VLS_438));
        const { default: __VLS_441 } = __VLS_440.slots;
        const __VLS_442 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({
            modelValue: (vendor.approximate_amount),
            modelModifiers: { number: true, },
            label: (`Approximate Amount — Vendor #${i + 1} ($)`),
            type: "number",
            step: "0.01",
            min: "0",
            prependInnerIcon: "mdi-currency-usd",
            variant: "outlined",
            rules: ([__VLS_ctx.required, __VLS_ctx.positiveNumber]),
            required: true,
        }));
        const __VLS_444 = __VLS_443({
            modelValue: (vendor.approximate_amount),
            modelModifiers: { number: true, },
            label: (`Approximate Amount — Vendor #${i + 1} ($)`),
            type: "number",
            step: "0.01",
            min: "0",
            prependInnerIcon: "mdi-currency-usd",
            variant: "outlined",
            rules: ([__VLS_ctx.required, __VLS_ctx.positiveNumber]),
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_443));
        // @ts-ignore
        [required, positiveNumber,];
        var __VLS_440;
        const __VLS_447 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_448 = __VLS_asFunctionalComponent(__VLS_447, new __VLS_447({
            cols: "12",
            sm: "6",
        }));
        const __VLS_449 = __VLS_448({
            cols: "12",
            sm: "6",
        }, ...__VLS_functionalComponentArgsRest(__VLS_448));
        const { default: __VLS_451 } = __VLS_450.slots;
        const __VLS_452 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
            modelValue: (vendor.items_to_purchase),
            label: (`Items to be Purchased — Vendor #${i + 1}`),
            prependInnerIcon: "mdi-cart-outline",
            variant: "outlined",
            rules: ([__VLS_ctx.required]),
            required: true,
        }));
        const __VLS_454 = __VLS_453({
            modelValue: (vendor.items_to_purchase),
            label: (`Items to be Purchased — Vendor #${i + 1}`),
            prependInnerIcon: "mdi-cart-outline",
            variant: "outlined",
            rules: ([__VLS_ctx.required]),
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_453));
        // @ts-ignore
        [required,];
        var __VLS_450;
        var __VLS_435;
        const __VLS_457 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        VTextField;
        // @ts-ignore
        const __VLS_458 = __VLS_asFunctionalComponent(__VLS_457, new __VLS_457({
            modelValue: (vendor.reason_for_purchase),
            label: (`Reason for Purchase — Vendor #${i + 1}`),
            prependInnerIcon: "mdi-text-box",
            variant: "outlined",
            rules: ([__VLS_ctx.required]),
            required: true,
        }));
        const __VLS_459 = __VLS_458({
            modelValue: (vendor.reason_for_purchase),
            label: (`Reason for Purchase — Vendor #${i + 1}`),
            prependInnerIcon: "mdi-text-box",
            variant: "outlined",
            rules: ([__VLS_ctx.required]),
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_458));
        // @ts-ignore
        [required,];
    }
    var __VLS_415;
    var __VLS_410;
}
if (__VLS_ctx.currentStepId === 'dept_funding') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_462 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_464 = __VLS_463({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_463));
    const { default: __VLS_466 } = __VLS_465.slots;
    const __VLS_467 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_468 = __VLS_asFunctionalComponent(__VLS_467, new __VLS_467({
        ...{ class: "pa-6" },
    }));
    const __VLS_469 = __VLS_468({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_468));
    const { default: __VLS_471 } = __VLS_470.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_472 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
        modelValue: (__VLS_ctx.p8Valid),
    }));
    const __VLS_474 = __VLS_473({
        modelValue: (__VLS_ctx.p8Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_473));
    const { default: __VLS_476 } = __VLS_475.slots;
    // @ts-ignore
    [p8Valid,];
    const __VLS_477 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    VSelect;
    // @ts-ignore
    const __VLS_478 = __VLS_asFunctionalComponent(__VLS_477, new __VLS_477({
        modelValue: (__VLS_ctx.p8.department_account),
        items: (__VLS_ctx.departmentAccounts),
        label: "Department Account",
        prependInnerIcon: "mdi-bank-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-5" },
    }));
    const __VLS_479 = __VLS_478({
        modelValue: (__VLS_ctx.p8.department_account),
        items: (__VLS_ctx.departmentAccounts),
        label: "Department Account",
        prependInnerIcon: "mdi-bank-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_478));
    // @ts-ignore
    [required, p8, departmentAccounts,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-error" },
    });
    const __VLS_482 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_483 = __VLS_asFunctionalComponent(__VLS_482, new __VLS_482({
        modelValue: (__VLS_ctx.p8.budget_approved),
        rules: ([v => !!v || 'Required.']),
        inline: true,
    }));
    const __VLS_484 = __VLS_483({
        modelValue: (__VLS_ctx.p8.budget_approved),
        rules: ([v => !!v || 'Required.']),
        inline: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_483));
    const { default: __VLS_486 } = __VLS_485.slots;
    // @ts-ignore
    [p8,];
    const __VLS_487 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_488 = __VLS_asFunctionalComponent(__VLS_487, new __VLS_487({
        label: "Yes",
        value: "Yes",
        color: "primary",
    }));
    const __VLS_489 = __VLS_488({
        label: "Yes",
        value: "Yes",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_488));
    const __VLS_492 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
        label: "No",
        value: "No",
        color: "primary",
    }));
    const __VLS_494 = __VLS_493({
        label: "No",
        value: "No",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    const __VLS_497 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_498 = __VLS_asFunctionalComponent(__VLS_497, new __VLS_497({
        label: "N/A",
        value: "N/A",
        color: "primary",
    }));
    const __VLS_499 = __VLS_498({
        label: "N/A",
        value: "N/A",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_498));
    var __VLS_485;
    var __VLS_475;
    var __VLS_470;
    var __VLS_465;
}
if (__VLS_ctx.currentStepId === 'public_meeting') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_502 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_504 = __VLS_503({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    const { default: __VLS_506 } = __VLS_505.slots;
    const __VLS_507 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_508 = __VLS_asFunctionalComponent(__VLS_507, new __VLS_507({
        ...{ class: "pa-6" },
    }));
    const __VLS_509 = __VLS_508({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_508));
    const { default: __VLS_511 } = __VLS_510.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_512 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
        modelValue: (__VLS_ctx.p9Valid),
    }));
    const __VLS_514 = __VLS_513({
        modelValue: (__VLS_ctx.p9Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_513));
    const { default: __VLS_516 } = __VLS_515.slots;
    // @ts-ignore
    [p9Valid,];
    const __VLS_517 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_518 = __VLS_asFunctionalComponent(__VLS_517, new __VLS_517({
        modelValue: (__VLS_ctx.p9.public_meeting_date),
        label: "Public Meeting Approval Date",
        type: "date",
        prependInnerIcon: "mdi-calendar-check",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }));
    const __VLS_519 = __VLS_518({
        modelValue: (__VLS_ctx.p9.public_meeting_date),
        label: "Public Meeting Approval Date",
        type: "date",
        prependInnerIcon: "mdi-calendar-check",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_518));
    // @ts-ignore
    [required, p9,];
    var __VLS_515;
    var __VLS_510;
    var __VLS_505;
}
if (__VLS_ctx.currentStepId === 'final') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_522 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
        elevation: "2",
        rounded: "lg",
    }));
    const __VLS_524 = __VLS_523({
        elevation: "2",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_523));
    const { default: __VLS_526 } = __VLS_525.slots;
    const __VLS_527 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    VCardText;
    // @ts-ignore
    const __VLS_528 = __VLS_asFunctionalComponent(__VLS_527, new __VLS_527({
        ...{ class: "pa-6" },
    }));
    const __VLS_529 = __VLS_528({
        ...{ class: "pa-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_528));
    const { default: __VLS_531 } = __VLS_530.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-3" },
    });
    const __VLS_532 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
        modelValue: (__VLS_ctx.p10Valid),
    }));
    const __VLS_534 = __VLS_533({
        modelValue: (__VLS_ctx.p10Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_533));
    const { default: __VLS_536 } = __VLS_535.slots;
    // @ts-ignore
    [p10Valid,];
    const __VLS_537 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_538 = __VLS_asFunctionalComponent(__VLS_537, new __VLS_537({
        modelValue: (__VLS_ctx.p10.email),
        label: "Your Email (UNR email only — @unr.edu)",
        prependInnerIcon: "mdi-email-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required, (v) => /^[^@]+@unr\.edu$/i.test(v) || 'Must be a valid @unr.edu email.']),
        required: true,
        ...{ class: "mb-5" },
    }));
    const __VLS_539 = __VLS_538({
        modelValue: (__VLS_ctx.p10.email),
        label: "Your Email (UNR email only — @unr.edu)",
        prependInnerIcon: "mdi-email-outline",
        variant: "outlined",
        rules: ([__VLS_ctx.required, (v) => /^[^@]+@unr\.edu$/i.test(v) || 'Must be a valid @unr.edu email.']),
        required: true,
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_538));
    // @ts-ignore
    [required, p10,];
    const __VLS_542 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
        ...{ class: "mb-4" },
    }));
    const __VLS_544 = __VLS_543({
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_543));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-overline text-primary mb-1" },
    });
    const __VLS_547 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_548 = __VLS_asFunctionalComponent(__VLS_547, new __VLS_547({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }));
    const __VLS_549 = __VLS_548({
        type: "info",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_548));
    const { default: __VLS_551 } = __VLS_550.slots;
    var __VLS_550;
    const __VLS_552 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
        modelValue: (__VLS_ctx.p10.asun_employee_verified),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-2" },
    }));
    const __VLS_554 = __VLS_553({
        modelValue: (__VLS_ctx.p10.asun_employee_verified),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_553));
    const { default: __VLS_556 } = __VLS_555.slots;
    // @ts-ignore
    [p10,];
    {
        const { label: __VLS_557 } = __VLS_555.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_555;
    const __VLS_558 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
        modelValue: (__VLS_ctx.p10.officer_signature),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-2" },
    }));
    const __VLS_560 = __VLS_559({
        modelValue: (__VLS_ctx.p10.officer_signature),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
        ...{ class: "mb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_559));
    const { default: __VLS_562 } = __VLS_561.slots;
    // @ts-ignore
    [p10,];
    {
        const { label: __VLS_563 } = __VLS_561.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_561;
    const __VLS_564 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
        modelValue: (__VLS_ctx.p10.faculty_signature),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
    }));
    const __VLS_566 = __VLS_565({
        modelValue: (__VLS_ctx.p10.faculty_signature),
        color: "primary",
        rules: ([v => !!v || 'Required.']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_565));
    const { default: __VLS_568 } = __VLS_567.slots;
    // @ts-ignore
    [p10,];
    {
        const { label: __VLS_569 } = __VLS_567.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    }
    var __VLS_567;
    var __VLS_535;
    var __VLS_530;
    var __VLS_525;
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex justify-space-between mt-5" },
});
if (__VLS_ctx.currentStep > 0) {
    // @ts-ignore
    [currentStep,];
    const __VLS_570 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
        ...{ 'onClick': {} },
        variant: "outlined",
        color: "secondary",
        prependIcon: "mdi-arrow-left",
        rounded: "lg",
    }));
    const __VLS_572 = __VLS_571({
        ...{ 'onClick': {} },
        variant: "outlined",
        color: "secondary",
        prependIcon: "mdi-arrow-left",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_571));
    let __VLS_574;
    let __VLS_575;
    const __VLS_576 = ({ click: {} },
        { onClick: (__VLS_ctx.prevStep) });
    const { default: __VLS_577 } = __VLS_573.slots;
    // @ts-ignore
    [prevStep,];
    var __VLS_573;
}
else {
    const __VLS_578 = {}.VSpacer;
    /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
    // @ts-ignore
    VSpacer;
    // @ts-ignore
    const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({}));
    const __VLS_580 = __VLS_579({}, ...__VLS_functionalComponentArgsRest(__VLS_579));
}
if (__VLS_ctx.currentStepId !== 'final') {
    // @ts-ignore
    [currentStepId,];
    const __VLS_583 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_584 = __VLS_asFunctionalComponent(__VLS_583, new __VLS_583({
        ...{ 'onClick': {} },
        color: "primary",
        appendIcon: "mdi-arrow-right",
        rounded: "lg",
    }));
    const __VLS_585 = __VLS_584({
        ...{ 'onClick': {} },
        color: "primary",
        appendIcon: "mdi-arrow-right",
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_584));
    let __VLS_587;
    let __VLS_588;
    const __VLS_589 = ({ click: {} },
        { onClick: (__VLS_ctx.nextStep) });
    const { default: __VLS_590 } = __VLS_586.slots;
    // @ts-ignore
    [nextStep,];
    var __VLS_586;
}
else {
    const __VLS_591 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_592 = __VLS_asFunctionalComponent(__VLS_591, new __VLS_591({
        ...{ 'onClick': {} },
        color: "primary",
        prependIcon: "mdi-send",
        rounded: "lg",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_593 = __VLS_592({
        ...{ 'onClick': {} },
        color: "primary",
        prependIcon: "mdi-send",
        rounded: "lg",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_592));
    let __VLS_595;
    let __VLS_596;
    const __VLS_597 = ({ click: {} },
        { onClick: (__VLS_ctx.handleSubmit) });
    const { default: __VLS_598 } = __VLS_594.slots;
    // @ts-ignore
    [loading, handleSubmit,];
    var __VLS_594;
}
var __VLS_8;
const __VLS_599 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_600 = __VLS_asFunctionalComponent(__VLS_599, new __VLS_599({
    modelValue: (__VLS_ctx.successSnackbar),
    color: "success",
    timeout: "4000",
}));
const __VLS_601 = __VLS_600({
    modelValue: (__VLS_ctx.successSnackbar),
    color: "success",
    timeout: "4000",
}, ...__VLS_functionalComponentArgsRest(__VLS_600));
const { default: __VLS_603 } = __VLS_602.slots;
// @ts-ignore
[successSnackbar,];
const __VLS_604 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({
    start: true,
}));
const __VLS_606 = __VLS_605({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_605));
const { default: __VLS_608 } = __VLS_607.slots;
var __VLS_607;
var __VLS_602;
const __VLS_609 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_610 = __VLS_asFunctionalComponent(__VLS_609, new __VLS_609({
    modelValue: (__VLS_ctx.errorSnackbar),
    color: "error",
    timeout: "4000",
}));
const __VLS_611 = __VLS_610({
    modelValue: (__VLS_ctx.errorSnackbar),
    color: "error",
    timeout: "4000",
}, ...__VLS_functionalComponentArgsRest(__VLS_610));
const { default: __VLS_613 } = __VLS_612.slots;
// @ts-ignore
[errorSnackbar,];
const __VLS_614 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
    start: true,
}));
const __VLS_616 = __VLS_615({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_615));
const { default: __VLS_618 } = __VLS_617.slots;
var __VLS_617;
(__VLS_ctx.errorMessage);
// @ts-ignore
[errorMessage,];
var __VLS_612;
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
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['my-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
