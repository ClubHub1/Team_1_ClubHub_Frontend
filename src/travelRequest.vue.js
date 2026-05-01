import { ref, computed } from 'vue';
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue';
import { feathersClient } from '@/backendAPI';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
// ── Form state ──────────────────────────────────────────────
const step = ref(1);
const totalSteps = 4;
const loading = ref(false);
const successSnackbar = ref(false);
const errorSnackbar = ref(false);
const errorMessage = ref('');
// Step 1 — Basic Info
const form = ref({
    club_name: '',
    full_name: '',
    email: '',
    travel_budget_url: '',
    // Step 2 — Trip Details
    mode_of_travel: '',
    transportation_funding: [],
    business_purpose: '',
    num_travelers: null,
    destination: '',
    departure_date: '',
    departure_time: '',
    return_date: '',
    return_time: '',
    purpose_of_trip: '',
    has_registration: 'No',
    conference_registration_url: '',
    registration_cost: 0,
    registration_funding: [],
    agenda_url: '',
    // Lodging
    lodging_info: '',
    nightly_rate: null,
    lodging_funding: '',
    lodging_screenshot_url: '',
    lodging_total_cost: null,
    // Step 3 — Group Travel
    travel_roster_url: '',
    business_travel_form_url: '',
    // Step 4 — Acknowledgement
    ack1: false,
    ack2: false,
    ack3: false,
    ack4: false,
    ack5: false,
});
const travelModes = ['Air', 'Personal Car', 'Bus', 'Car Rental', 'Train'];
const fundingSources = ['Club Support Funding', 'Club Account', 'ASUN/CSE Department Account', 'Personal Funds', 'Other'];
const businessPurposes = ['Individual Travel', 'Group Travel', 'CSE Staff'];
const lodgingPaymentOptions = ['Club Support Funding', 'Club Account', 'ASUN/CSE Department Account', 'Personal Funds', 'Other'];
const isGroupTravel = computed(() => form.value.business_purpose === 'Group Travel');
// Step form validity
const step1Valid = ref(false);
const step2Valid = ref(false);
const step3Valid = ref(true);
const step4Valid = computed(() => form.value.ack1 && form.value.ack2 && form.value.ack3 && form.value.ack4 && form.value.ack5);
const required = (v) => !!v || 'This field is required.';
const positiveNumber = (v) => (!v || Number(v) >= 0) || 'Must be 0 or greater.';
function nextStep() { if (step.value < totalSteps)
    step.value++; }
function prevStep() { if (step.value > 1)
    step.value--; }
async function handleSubmit() {
    if (!step4Valid.value)
        return;
    loading.value = true;
    try {
        const user = authStore.user;
        const membership = await feathersClient.service('Club Membership').find({
            query: { userid: user.user_id, is_active: true, $limit: 1 }
        });
        const rows = membership.data ?? membership;
        const clubId = rows[0]?.clubid;
        await feathersClient.service('travel-requests').create({
            club: clubId,
            requested_by: user.user_id,
            destination: form.value.destination,
            purpose: form.value.purpose_of_trip,
            departure_date: form.value.departure_date,
            return_date: form.value.return_date,
            num_travelers: form.value.num_travelers,
            estimated_cost: form.value.lodging_total_cost,
            transportation: form.value.mode_of_travel,
            lodging: form.value.lodging_info,
            notes: JSON.stringify({
                club_name: form.value.club_name,
                full_name: form.value.full_name,
                email: form.value.email,
                business_purpose: form.value.business_purpose,
                transportation_funding: form.value.transportation_funding,
                has_registration: form.value.has_registration,
                registration_cost: form.value.registration_cost,
                nightly_rate: form.value.nightly_rate,
                lodging_funding: form.value.lodging_funding,
            }),
        });
        successSnackbar.value = true;
        setTimeout(() => router.push('/dashboard'), 2000);
    }
    catch (e) {
        errorMessage.value = e?.message || 'Submission failed. Please try again.';
        errorSnackbar.value = true;
    }
    finally {
        loading.value = false;
    }
}
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
    maxWidth: "820",
}));
const __VLS_7 = __VLS_6({
    maxWidth: "820",
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
const __VLS_18 = {}.VStepper;
/** @type {[typeof __VLS_components.VStepper, typeof __VLS_components.vStepper, typeof __VLS_components.VStepper, typeof __VLS_components.vStepper, ]} */ ;
// @ts-ignore
VStepper;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.step),
    flat: true,
    ...{ class: "mb-6 bg-transparent" },
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.step),
    flat: true,
    ...{ class: "mb-6 bg-transparent" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_22 } = __VLS_21.slots;
// @ts-ignore
[step,];
const __VLS_23 = {}.VStepperHeader;
/** @type {[typeof __VLS_components.VStepperHeader, typeof __VLS_components.vStepperHeader, typeof __VLS_components.VStepperHeader, typeof __VLS_components.vStepperHeader, ]} */ ;
// @ts-ignore
VStepperHeader;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_27 } = __VLS_26.slots;
const __VLS_28 = {}.VStepperItem;
/** @type {[typeof __VLS_components.VStepperItem, typeof __VLS_components.vStepperItem, ]} */ ;
// @ts-ignore
VStepperItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    title: "Travel Request",
    value: (1),
    complete: (__VLS_ctx.step > 1),
    color: "primary",
}));
const __VLS_30 = __VLS_29({
    title: "Travel Request",
    value: (1),
    complete: (__VLS_ctx.step > 1),
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
// @ts-ignore
[step,];
const __VLS_33 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const __VLS_38 = {}.VStepperItem;
/** @type {[typeof __VLS_components.VStepperItem, typeof __VLS_components.vStepperItem, ]} */ ;
// @ts-ignore
VStepperItem;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    title: "Trip Details",
    value: (2),
    complete: (__VLS_ctx.step > 2),
    color: "primary",
}));
const __VLS_40 = __VLS_39({
    title: "Trip Details",
    value: (2),
    complete: (__VLS_ctx.step > 2),
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[step,];
const __VLS_43 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const __VLS_48 = {}.VStepperItem;
/** @type {[typeof __VLS_components.VStepperItem, typeof __VLS_components.vStepperItem, ]} */ ;
// @ts-ignore
VStepperItem;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    title: "Group Travel",
    value: (3),
    complete: (__VLS_ctx.step > 3),
    color: "primary",
}));
const __VLS_50 = __VLS_49({
    title: "Group Travel",
    value: (3),
    complete: (__VLS_ctx.step > 3),
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
// @ts-ignore
[step,];
const __VLS_53 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const __VLS_58 = {}.VStepperItem;
/** @type {[typeof __VLS_components.VStepperItem, typeof __VLS_components.vStepperItem, ]} */ ;
// @ts-ignore
VStepperItem;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    title: "Acknowledgement",
    value: (4),
    color: "primary",
}));
const __VLS_60 = __VLS_59({
    title: "Acknowledgement",
    value: (4),
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
var __VLS_26;
var __VLS_21;
if (__VLS_ctx.step === 1) {
    // @ts-ignore
    [step,];
    const __VLS_63 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        modelValue: (__VLS_ctx.step1Valid),
    }));
    const __VLS_65 = __VLS_64({
        modelValue: (__VLS_ctx.step1Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_67 } = __VLS_66.slots;
    // @ts-ignore
    [step1Valid,];
    const __VLS_68 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-5" },
        border: "start",
        borderColor: "light-blue",
    }));
    const __VLS_70 = __VLS_69({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-5" },
        border: "start",
        borderColor: "light-blue",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const { default: __VLS_72 } = __VLS_71.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.u, __VLS_intrinsics.u)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.u, __VLS_intrinsics.u)({});
    const __VLS_73 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        type: "warning",
        variant: "tonal",
        density: "compact",
        ...{ class: "mt-3" },
        rounded: "lg",
    }));
    const __VLS_75 = __VLS_74({
        type: "warning",
        variant: "tonal",
        density: "compact",
        ...{ class: "mt-3" },
        rounded: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const { default: __VLS_77 } = __VLS_76.slots;
    var __VLS_76;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mt-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.ol, __VLS_intrinsics.ol)({
        ...{ class: "text-body-2 ml-4 mt-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
    var __VLS_71;
    const __VLS_78 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-6" },
        border: "start",
        borderColor: "light-blue",
    }));
    const __VLS_80 = __VLS_79({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-6" },
        border: "start",
        borderColor: "light-blue",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_82 } = __VLS_81.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "https://www.unr.edu/student-engagement/clubs-and-organizations/travel",
        target: "_blank",
        ...{ class: "text-primary" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "mailto:cseaccounting@unr.edu",
        ...{ class: "text-primary" },
    });
    var __VLS_81;
    const __VLS_83 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }));
    const __VLS_85 = __VLS_84({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    const { default: __VLS_87 } = __VLS_86.slots;
    const __VLS_88 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.form.club_name),
        label: "* Club/Organization/Department Name",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.form.club_name),
        label: "* Club/Organization/Department Name",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    // @ts-ignore
    [form, required,];
    const __VLS_93 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        modelValue: (__VLS_ctx.form.full_name),
        label: "* Your Full Name",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_95 = __VLS_94({
        modelValue: (__VLS_ctx.form.full_name),
        label: "* Your Full Name",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    // @ts-ignore
    [form, required,];
    const __VLS_98 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        modelValue: (__VLS_ctx.form.email),
        label: "* Your Email Address",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_100 = __VLS_99({
        modelValue: (__VLS_ctx.form.email),
        label: "* Your Email Address",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    // @ts-ignore
    [form, required,];
    const __VLS_103 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }));
    const __VLS_105 = __VLS_104({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    const { default: __VLS_107 } = __VLS_106.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "https://nevada.box.com/s/oquufnsbi693co1xg26cekhkhkx1t758",
        target: "_blank",
        ...{ class: "text-primary" },
    });
    var __VLS_106;
    const __VLS_108 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.form.travel_budget_url),
        label: "* Attach Travel Budget (paste file URL or Drive link)",
        rules: ([__VLS_ctx.required]),
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        hint: "Upload your filled Excel budget to Google Drive and paste the link here",
        persistentHint: true,
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.form.travel_budget_url),
        label: "* Attach Travel Budget (paste file URL or Drive link)",
        rules: ([__VLS_ctx.required]),
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        hint: "Upload your filled Excel budget to Google Drive and paste the link here",
        persistentHint: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    // @ts-ignore
    [form, required,];
    var __VLS_86;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-end mt-4" },
    });
    const __VLS_113 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        ...{ 'onClick': {} },
        color: "primary",
        disabled: (!__VLS_ctx.step1Valid),
        appendIcon: "mdi-arrow-right",
        size: "large",
    }));
    const __VLS_115 = __VLS_114({
        ...{ 'onClick': {} },
        color: "primary",
        disabled: (!__VLS_ctx.step1Valid),
        appendIcon: "mdi-arrow-right",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = ({ click: {} },
        { onClick: (__VLS_ctx.nextStep) });
    const { default: __VLS_120 } = __VLS_116.slots;
    // @ts-ignore
    [step1Valid, nextStep,];
    var __VLS_116;
    var __VLS_66;
}
else if (__VLS_ctx.step === 2) {
    // @ts-ignore
    [step,];
    const __VLS_121 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        modelValue: (__VLS_ctx.step2Valid),
    }));
    const __VLS_123 = __VLS_122({
        modelValue: (__VLS_ctx.step2Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    const { default: __VLS_125 } = __VLS_124.slots;
    // @ts-ignore
    [step2Valid,];
    const __VLS_126 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }));
    const __VLS_128 = __VLS_127({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const { default: __VLS_130 } = __VLS_129.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-1" },
    });
    const __VLS_131 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
        type: "warning",
        variant: "tonal",
        density: "compact",
        rounded: "lg",
        ...{ class: "mb-3" },
    }));
    const __VLS_133 = __VLS_132({
        type: "warning",
        variant: "tonal",
        density: "compact",
        rounded: "lg",
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    const { default: __VLS_135 } = __VLS_134.slots;
    var __VLS_134;
    const __VLS_136 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        modelValue: (__VLS_ctx.form.mode_of_travel),
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-5" },
    }));
    const __VLS_138 = __VLS_137({
        modelValue: (__VLS_ctx.form.mode_of_travel),
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    const { default: __VLS_140 } = __VLS_139.slots;
    // @ts-ignore
    [form, required,];
    for (const [m] of __VLS_getVForSourceType((__VLS_ctx.travelModes))) {
        // @ts-ignore
        [travelModes,];
        const __VLS_141 = {}.VRadio;
        /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
        // @ts-ignore
        VRadio;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            key: (m),
            label: (m),
            value: (m),
            color: "primary",
        }));
        const __VLS_143 = __VLS_142({
            key: (m),
            label: (m),
            value: (m),
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    }
    var __VLS_139;
    const __VLS_146 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        ...{ class: "mb-5" },
    }));
    const __VLS_148 = __VLS_147({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-5" },
    });
    for (const [s] of __VLS_getVForSourceType((__VLS_ctx.fundingSources))) {
        // @ts-ignore
        [fundingSources,];
        const __VLS_151 = {}.VCheckbox;
        /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
        // @ts-ignore
        VCheckbox;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
            key: (s),
            modelValue: (__VLS_ctx.form.transportation_funding),
            label: (s),
            value: (s),
            color: "primary",
            density: "compact",
            hideDetails: true,
        }));
        const __VLS_153 = __VLS_152({
            key: (s),
            modelValue: (__VLS_ctx.form.transportation_funding),
            label: (s),
            value: (s),
            color: "primary",
            density: "compact",
            hideDetails: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        // @ts-ignore
        [form,];
    }
    const __VLS_156 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        ...{ class: "mb-5" },
    }));
    const __VLS_158 = __VLS_157({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-3" },
    });
    const __VLS_161 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
        modelValue: (__VLS_ctx.form.business_purpose),
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-5" },
    }));
    const __VLS_163 = __VLS_162({
        modelValue: (__VLS_ctx.form.business_purpose),
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    const { default: __VLS_165 } = __VLS_164.slots;
    // @ts-ignore
    [form, required,];
    for (const [b] of __VLS_getVForSourceType((__VLS_ctx.businessPurposes))) {
        // @ts-ignore
        [businessPurposes,];
        const __VLS_166 = {}.VRadio;
        /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
        // @ts-ignore
        VRadio;
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
            key: (b),
            label: (b),
            value: (b),
            color: "primary",
        }));
        const __VLS_168 = __VLS_167({
            key: (b),
            label: (b),
            value: (b),
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    }
    var __VLS_164;
    const __VLS_171 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
        ...{ class: "mb-5" },
    }));
    const __VLS_173 = __VLS_172({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    const __VLS_176 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
    const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
    const { default: __VLS_180 } = __VLS_179.slots;
    const __VLS_181 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
        cols: "12",
        sm: "6",
    }));
    const __VLS_183 = __VLS_182({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    const { default: __VLS_185 } = __VLS_184.slots;
    const __VLS_186 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
        modelValue: (__VLS_ctx.form.num_travelers),
        modelModifiers: { number: true, },
        label: "* How many people will be traveling?",
        type: "number",
        min: "1",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }));
    const __VLS_188 = __VLS_187({
        modelValue: (__VLS_ctx.form.num_travelers),
        modelModifiers: { number: true, },
        label: "* How many people will be traveling?",
        type: "number",
        min: "1",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    // @ts-ignore
    [form, required,];
    var __VLS_184;
    const __VLS_191 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
        cols: "12",
        sm: "6",
    }));
    const __VLS_193 = __VLS_192({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_192));
    const { default: __VLS_195 } = __VLS_194.slots;
    const __VLS_196 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        modelValue: (__VLS_ctx.form.destination),
        label: "* Travel Destination (City, State)",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }));
    const __VLS_198 = __VLS_197({
        modelValue: (__VLS_ctx.form.destination),
        label: "* Travel Destination (City, State)",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    // @ts-ignore
    [form, required,];
    var __VLS_194;
    var __VLS_179;
    const __VLS_201 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({}));
    const __VLS_203 = __VLS_202({}, ...__VLS_functionalComponentArgsRest(__VLS_202));
    const { default: __VLS_205 } = __VLS_204.slots;
    const __VLS_206 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
        cols: "12",
        sm: "6",
    }));
    const __VLS_208 = __VLS_207({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    const { default: __VLS_210 } = __VLS_209.slots;
    const __VLS_211 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
        modelValue: (__VLS_ctx.form.departure_date),
        label: "* Departure Date",
        type: "date",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }));
    const __VLS_213 = __VLS_212({
        modelValue: (__VLS_ctx.form.departure_date),
        label: "* Departure Date",
        type: "date",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    // @ts-ignore
    [form, required,];
    var __VLS_209;
    const __VLS_216 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        cols: "12",
        sm: "6",
    }));
    const __VLS_218 = __VLS_217({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    const { default: __VLS_220 } = __VLS_219.slots;
    const __VLS_221 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
        modelValue: (__VLS_ctx.form.departure_time),
        label: "* Departure Time",
        type: "time",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }));
    const __VLS_223 = __VLS_222({
        modelValue: (__VLS_ctx.form.departure_time),
        label: "* Departure Time",
        type: "time",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    // @ts-ignore
    [form, required,];
    var __VLS_219;
    var __VLS_204;
    const __VLS_226 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({}));
    const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
    const { default: __VLS_230 } = __VLS_229.slots;
    const __VLS_231 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
        cols: "12",
        sm: "6",
    }));
    const __VLS_233 = __VLS_232({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_232));
    const { default: __VLS_235 } = __VLS_234.slots;
    const __VLS_236 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        modelValue: (__VLS_ctx.form.return_date),
        label: "* Return to Reno, NV Date",
        type: "date",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }));
    const __VLS_238 = __VLS_237({
        modelValue: (__VLS_ctx.form.return_date),
        label: "* Return to Reno, NV Date",
        type: "date",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    // @ts-ignore
    [form, required,];
    var __VLS_234;
    const __VLS_241 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    VCol;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        cols: "12",
        sm: "6",
    }));
    const __VLS_243 = __VLS_242({
        cols: "12",
        sm: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    const { default: __VLS_245 } = __VLS_244.slots;
    const __VLS_246 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
        modelValue: (__VLS_ctx.form.return_time),
        label: "* Return to Reno, NV Time",
        type: "time",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }));
    const __VLS_248 = __VLS_247({
        modelValue: (__VLS_ctx.form.return_time),
        label: "* Return to Reno, NV Time",
        type: "time",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    // @ts-ignore
    [form, required,];
    var __VLS_244;
    var __VLS_229;
    const __VLS_251 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
        ...{ class: "my-5" },
    }));
    const __VLS_253 = __VLS_252({
        ...{ class: "my-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_252));
    const __VLS_256 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        modelValue: (__VLS_ctx.form.purpose_of_trip),
        label: "* Purpose of Trip (If a conference or meeting is involved, give the name of the organization, location and time of meeting, etc.)",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        rows: "4",
        ...{ class: "mb-5" },
    }));
    const __VLS_258 = __VLS_257({
        modelValue: (__VLS_ctx.form.purpose_of_trip),
        label: "* Purpose of Trip (If a conference or meeting is involved, give the name of the organization, location and time of meeting, etc.)",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        rows: "4",
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    // @ts-ignore
    [form, required,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-2" },
    });
    const __VLS_261 = {}.VRadioGroup;
    /** @type {[typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, typeof __VLS_components.VRadioGroup, typeof __VLS_components.vRadioGroup, ]} */ ;
    // @ts-ignore
    VRadioGroup;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
        modelValue: (__VLS_ctx.form.has_registration),
        inline: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_263 = __VLS_262({
        modelValue: (__VLS_ctx.form.has_registration),
        inline: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
    const { default: __VLS_265 } = __VLS_264.slots;
    // @ts-ignore
    [form,];
    const __VLS_266 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
        label: "Yes",
        value: "Yes",
        color: "primary",
    }));
    const __VLS_268 = __VLS_267({
        label: "Yes",
        value: "Yes",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_267));
    const __VLS_271 = {}.VRadio;
    /** @type {[typeof __VLS_components.VRadio, typeof __VLS_components.vRadio, ]} */ ;
    // @ts-ignore
    VRadio;
    // @ts-ignore
    const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
        label: "No",
        value: "No",
        color: "primary",
    }));
    const __VLS_273 = __VLS_272({
        label: "No",
        value: "No",
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_272));
    var __VLS_264;
    const __VLS_276 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }));
    const __VLS_278 = __VLS_277({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-4" },
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    const { default: __VLS_280 } = __VLS_279.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    var __VLS_279;
    const __VLS_281 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
        modelValue: (__VLS_ctx.form.conference_registration_url),
        label: "* Conference/Meeting Registration (paste file URL or screenshot link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-4" },
        rules: ([__VLS_ctx.required]),
    }));
    const __VLS_283 = __VLS_282({
        modelValue: (__VLS_ctx.form.conference_registration_url),
        label: "* Conference/Meeting Registration (paste file URL or screenshot link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-4" },
        rules: ([__VLS_ctx.required]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_282));
    // @ts-ignore
    [form, required,];
    const __VLS_286 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
        modelValue: (__VLS_ctx.form.registration_cost),
        modelModifiers: { number: true, },
        label: "* Total Cost of all Registrations (if none, put $0.00)",
        type: "number",
        step: "0.01",
        min: "0",
        rules: ([__VLS_ctx.positiveNumber]),
        prependInnerIcon: "mdi-currency-usd",
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_288 = __VLS_287({
        modelValue: (__VLS_ctx.form.registration_cost),
        modelModifiers: { number: true, },
        label: "* Total Cost of all Registrations (if none, put $0.00)",
        type: "number",
        step: "0.01",
        min: "0",
        rules: ([__VLS_ctx.positiveNumber]),
        prependInnerIcon: "mdi-currency-usd",
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    // @ts-ignore
    [form, positiveNumber,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-5" },
    });
    for (const [s] of __VLS_getVForSourceType((__VLS_ctx.fundingSources))) {
        // @ts-ignore
        [fundingSources,];
        const __VLS_291 = {}.VCheckbox;
        /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
        // @ts-ignore
        VCheckbox;
        // @ts-ignore
        const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
            key: (s),
            modelValue: (__VLS_ctx.form.registration_funding),
            label: (s),
            value: (s),
            color: "primary",
            density: "compact",
            hideDetails: true,
        }));
        const __VLS_293 = __VLS_292({
            key: (s),
            modelValue: (__VLS_ctx.form.registration_funding),
            label: (s),
            value: (s),
            color: "primary",
            density: "compact",
            hideDetails: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_292));
        // @ts-ignore
        [form,];
    }
    const __VLS_296 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        ...{ class: "mb-5" },
    }));
    const __VLS_298 = __VLS_297({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-2" },
    });
    const __VLS_301 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
        modelValue: (__VLS_ctx.form.agenda_url),
        label: "* Agenda (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-5" },
    }));
    const __VLS_303 = __VLS_302({
        modelValue: (__VLS_ctx.form.agenda_url),
        label: "* Agenda (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    // @ts-ignore
    [form, required,];
    const __VLS_306 = {}.VDivider;
    /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
    // @ts-ignore
    VDivider;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
        ...{ class: "mb-5" },
    }));
    const __VLS_308 = __VLS_307({
        ...{ class: "mb-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    const __VLS_311 = {}.VTextarea;
    /** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
    // @ts-ignore
    VTextarea;
    // @ts-ignore
    const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
        modelValue: (__VLS_ctx.form.lodging_info),
        label: "* Lodging Information — Please provide the hotel name and address",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        rows: "3",
        ...{ class: "mb-4" },
    }));
    const __VLS_313 = __VLS_312({
        modelValue: (__VLS_ctx.form.lodging_info),
        label: "* Lodging Information — Please provide the hotel name and address",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        rows: "3",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_312));
    // @ts-ignore
    [form, required,];
    const __VLS_316 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        modelValue: (__VLS_ctx.form.nightly_rate),
        modelModifiers: { number: true, },
        label: "* Nightly Rate excluding taxes",
        type: "number",
        step: "0.01",
        min: "0",
        rules: ([__VLS_ctx.required]),
        prependInnerIcon: "mdi-currency-usd",
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_318 = __VLS_317({
        modelValue: (__VLS_ctx.form.nightly_rate),
        modelModifiers: { number: true, },
        label: "* Nightly Rate excluding taxes",
        type: "number",
        step: "0.01",
        min: "0",
        rules: ([__VLS_ctx.required]),
        prependInnerIcon: "mdi-currency-usd",
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
    // @ts-ignore
    [form, required,];
    const __VLS_321 = {}.VSelect;
    /** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
    // @ts-ignore
    VSelect;
    // @ts-ignore
    const __VLS_322 = __VLS_asFunctionalComponent(__VLS_321, new __VLS_321({
        modelValue: (__VLS_ctx.form.lodging_funding),
        items: (__VLS_ctx.lodgingPaymentOptions),
        label: "* How will you be paying for lodging?",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_323 = __VLS_322({
        modelValue: (__VLS_ctx.form.lodging_funding),
        items: (__VLS_ctx.lodgingPaymentOptions),
        label: "* How will you be paying for lodging?",
        rules: ([__VLS_ctx.required]),
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_322));
    // @ts-ignore
    [form, required, lodgingPaymentOptions,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-2" },
    });
    const __VLS_326 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
        modelValue: (__VLS_ctx.form.lodging_screenshot_url),
        label: "* Lodging Screenshot (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-4" },
    }));
    const __VLS_328 = __VLS_327({
        modelValue: (__VLS_ctx.form.lodging_screenshot_url),
        label: "* Lodging Screenshot (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        rules: ([__VLS_ctx.required]),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_327));
    // @ts-ignore
    [form, required,];
    const __VLS_331 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_332 = __VLS_asFunctionalComponent(__VLS_331, new __VLS_331({
        modelValue: (__VLS_ctx.form.lodging_total_cost),
        modelModifiers: { number: true, },
        label: "* Total Cost of Lodging All Nights Includes Taxes (0.00 Format)",
        type: "number",
        step: "0.01",
        min: "0",
        rules: ([__VLS_ctx.required]),
        prependInnerIcon: "mdi-currency-usd",
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_333 = __VLS_332({
        modelValue: (__VLS_ctx.form.lodging_total_cost),
        modelModifiers: { number: true, },
        label: "* Total Cost of Lodging All Nights Includes Taxes (0.00 Format)",
        type: "number",
        step: "0.01",
        min: "0",
        rules: ([__VLS_ctx.required]),
        prependInnerIcon: "mdi-currency-usd",
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_332));
    // @ts-ignore
    [form, required,];
    const __VLS_336 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        color: "light-blue-lighten-4",
        rounded: "lg",
        border: "start",
        borderColor: "light-blue",
    }));
    const __VLS_338 = __VLS_337({
        color: "light-blue-lighten-4",
        rounded: "lg",
        border: "start",
        borderColor: "light-blue",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    const { default: __VLS_340 } = __VLS_339.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "https://suppliers.nevada.edu/lite",
        target: "_blank",
        ...{ class: "text-primary" },
    });
    var __VLS_339;
    var __VLS_129;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-space-between mt-4" },
    });
    const __VLS_341 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({
        ...{ 'onClick': {} },
        variant: "outlined",
        prependIcon: "mdi-arrow-left",
        size: "large",
    }));
    const __VLS_343 = __VLS_342({
        ...{ 'onClick': {} },
        variant: "outlined",
        prependIcon: "mdi-arrow-left",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_342));
    let __VLS_345;
    let __VLS_346;
    const __VLS_347 = ({ click: {} },
        { onClick: (__VLS_ctx.prevStep) });
    const { default: __VLS_348 } = __VLS_344.slots;
    // @ts-ignore
    [prevStep,];
    var __VLS_344;
    const __VLS_349 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
        ...{ 'onClick': {} },
        color: "primary",
        disabled: (!__VLS_ctx.step2Valid),
        appendIcon: "mdi-arrow-right",
        size: "large",
    }));
    const __VLS_351 = __VLS_350({
        ...{ 'onClick': {} },
        color: "primary",
        disabled: (!__VLS_ctx.step2Valid),
        appendIcon: "mdi-arrow-right",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_350));
    let __VLS_353;
    let __VLS_354;
    const __VLS_355 = ({ click: {} },
        { onClick: (__VLS_ctx.nextStep) });
    const { default: __VLS_356 } = __VLS_352.slots;
    // @ts-ignore
    [nextStep, step2Valid,];
    var __VLS_352;
    var __VLS_124;
}
else if (__VLS_ctx.step === 3) {
    // @ts-ignore
    [step,];
    const __VLS_357 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    VForm;
    // @ts-ignore
    const __VLS_358 = __VLS_asFunctionalComponent(__VLS_357, new __VLS_357({
        modelValue: (__VLS_ctx.step3Valid),
    }));
    const __VLS_359 = __VLS_358({
        modelValue: (__VLS_ctx.step3Valid),
    }, ...__VLS_functionalComponentArgsRest(__VLS_358));
    const { default: __VLS_361 } = __VLS_360.slots;
    // @ts-ignore
    [step3Valid,];
    const __VLS_362 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }));
    const __VLS_364 = __VLS_363({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_363));
    const { default: __VLS_366 } = __VLS_365.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-h5 font-weight-bold mb-5" },
    });
    const __VLS_367 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_368 = __VLS_asFunctionalComponent(__VLS_367, new __VLS_367({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-5" },
        border: "start",
        borderColor: "light-blue",
    }));
    const __VLS_369 = __VLS_368({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-5" },
        border: "start",
        borderColor: "light-blue",
    }, ...__VLS_functionalComponentArgsRest(__VLS_368));
    const { default: __VLS_371 } = __VLS_370.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "https://nevada.box.com/shared/static/zyvmpdnojxa0hkbgfphuavmsru4toz7m.pdf",
        target: "_blank",
        ...{ class: "text-primary" },
    });
    var __VLS_370;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-2" },
    });
    const __VLS_372 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        modelValue: (__VLS_ctx.form.travel_roster_url),
        label: "Travel Roster (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-6" },
    }));
    const __VLS_374 = __VLS_373({
        modelValue: (__VLS_ctx.form.travel_roster_url),
        label: "Travel Roster (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    // @ts-ignore
    [form,];
    const __VLS_377 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-5" },
        border: "start",
        borderColor: "light-blue",
    }));
    const __VLS_379 = __VLS_378({
        color: "light-blue-lighten-4",
        rounded: "lg",
        ...{ class: "mb-5" },
        border: "start",
        borderColor: "light-blue",
    }, ...__VLS_functionalComponentArgsRest(__VLS_378));
    const { default: __VLS_381 } = __VLS_380.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "https://nevada.box.com/shared/static/kk7kktwt3dj75qnqz3lw4b1zyrztmt0r.pdf",
        target: "_blank",
        ...{ class: "text-primary" },
    });
    var __VLS_380;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 font-weight-medium mb-2" },
    });
    const __VLS_382 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
        modelValue: (__VLS_ctx.form.business_travel_form_url),
        label: "Business Travel Form (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_384 = __VLS_383({
        modelValue: (__VLS_ctx.form.business_travel_form_url),
        label: "Business Travel Form (paste file URL or Drive link)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_383));
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-2" },
    });
    const __VLS_387 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
        label: "Additional Business Travel Form (optional)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-3" },
    }));
    const __VLS_389 = __VLS_388({
        label: "Additional Business Travel Form (optional)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_388));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-2" },
    });
    const __VLS_392 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        label: "Additional Business Travel Form (optional)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-3" },
    }));
    const __VLS_394 = __VLS_393({
        label: "Additional Business Travel Form (optional)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-2" },
    });
    const __VLS_397 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    VTextField;
    // @ts-ignore
    const __VLS_398 = __VLS_asFunctionalComponent(__VLS_397, new __VLS_397({
        label: "Additional Business Travel Form (optional)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
    }));
    const __VLS_399 = __VLS_398({
        label: "Additional Business Travel Form (optional)",
        prependInnerIcon: "mdi-paperclip",
        variant: "outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_398));
    var __VLS_365;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-space-between mt-4" },
    });
    const __VLS_402 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
        ...{ 'onClick': {} },
        variant: "outlined",
        prependIcon: "mdi-arrow-left",
        size: "large",
    }));
    const __VLS_404 = __VLS_403({
        ...{ 'onClick': {} },
        variant: "outlined",
        prependIcon: "mdi-arrow-left",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    let __VLS_406;
    let __VLS_407;
    const __VLS_408 = ({ click: {} },
        { onClick: (__VLS_ctx.prevStep) });
    const { default: __VLS_409 } = __VLS_405.slots;
    // @ts-ignore
    [prevStep,];
    var __VLS_405;
    const __VLS_410 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
        ...{ 'onClick': {} },
        color: "primary",
        appendIcon: "mdi-arrow-right",
        size: "large",
    }));
    const __VLS_412 = __VLS_411({
        ...{ 'onClick': {} },
        color: "primary",
        appendIcon: "mdi-arrow-right",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_411));
    let __VLS_414;
    let __VLS_415;
    const __VLS_416 = ({ click: {} },
        { onClick: (__VLS_ctx.nextStep) });
    const { default: __VLS_417 } = __VLS_413.slots;
    // @ts-ignore
    [nextStep,];
    var __VLS_413;
    var __VLS_360;
}
else if (__VLS_ctx.step === 4) {
    // @ts-ignore
    [step,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_418 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }));
    const __VLS_420 = __VLS_419({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-6 mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_419));
    const { default: __VLS_422 } = __VLS_421.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "text-h5 font-weight-bold mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-6" },
    });
    for (const [ack, key, idx] of __VLS_getVForSourceType(({
        ack1: 'By Clicking this I Agree to Update any Travel Changes to the Accounting Office AS SOON AS POSSIBLE.',
        ack2: 'By Clicking This I Agree to Sign the DocuSign in a Timely Manner.',
        ack3: 'By Clicking This I Agree to Regularly Check Comments in Pack Life and Respond',
        ack4: 'By Clicking This I Agree That Only Travelers on the Approved Roster for This Travel Request, May Travel.',
    }))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (key),
            ...{ class: "mb-5" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-body-2 font-weight-medium text-error mb-1" },
        });
        const __VLS_423 = {}.VCheckbox;
        /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
        // @ts-ignore
        VCheckbox;
        // @ts-ignore
        const __VLS_424 = __VLS_asFunctionalComponent(__VLS_423, new __VLS_423({
            modelValue: (__VLS_ctx.form[key]),
            label: ('* ' + ack),
            color: "primary",
            hideDetails: true,
        }));
        const __VLS_425 = __VLS_424({
            modelValue: (__VLS_ctx.form[key]),
            label: ('* ' + ack),
            color: "primary",
            hideDetails: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_424));
        // @ts-ignore
        [form,];
    }
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 font-weight-medium text-error mb-1" },
    });
    const __VLS_428 = {}.VCheckbox;
    /** @type {[typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ]} */ ;
    // @ts-ignore
    VCheckbox;
    // @ts-ignore
    const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
        modelValue: (__VLS_ctx.form.ack5),
        color: "primary",
        hideDetails: true,
    }));
    const __VLS_430 = __VLS_429({
        modelValue: (__VLS_ctx.form.ack5),
        color: "primary",
        hideDetails: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_429));
    const { default: __VLS_432 } = __VLS_431.slots;
    // @ts-ignore
    [form,];
    {
        const { label: __VLS_433 } = __VLS_431.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({
            ...{ class: "text-error" },
        });
    }
    var __VLS_431;
    var __VLS_421;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-space-between mt-4" },
    });
    const __VLS_434 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({
        ...{ 'onClick': {} },
        variant: "outlined",
        prependIcon: "mdi-arrow-left",
        size: "large",
    }));
    const __VLS_436 = __VLS_435({
        ...{ 'onClick': {} },
        variant: "outlined",
        prependIcon: "mdi-arrow-left",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_435));
    let __VLS_438;
    let __VLS_439;
    const __VLS_440 = ({ click: {} },
        { onClick: (__VLS_ctx.prevStep) });
    const { default: __VLS_441 } = __VLS_437.slots;
    // @ts-ignore
    [prevStep,];
    var __VLS_437;
    const __VLS_442 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({
        ...{ 'onClick': {} },
        color: "primary",
        disabled: (!__VLS_ctx.step4Valid),
        loading: (__VLS_ctx.loading),
        prependIcon: "mdi-send",
        size: "large",
    }));
    const __VLS_444 = __VLS_443({
        ...{ 'onClick': {} },
        color: "primary",
        disabled: (!__VLS_ctx.step4Valid),
        loading: (__VLS_ctx.loading),
        prependIcon: "mdi-send",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_443));
    let __VLS_446;
    let __VLS_447;
    const __VLS_448 = ({ click: {} },
        { onClick: (__VLS_ctx.handleSubmit) });
    const { default: __VLS_449 } = __VLS_445.slots;
    // @ts-ignore
    [step4Valid, loading, handleSubmit,];
    var __VLS_445;
}
var __VLS_8;
const __VLS_450 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
    modelValue: (__VLS_ctx.successSnackbar),
    color: "success",
    timeout: "3000",
}));
const __VLS_452 = __VLS_451({
    modelValue: (__VLS_ctx.successSnackbar),
    color: "success",
    timeout: "3000",
}, ...__VLS_functionalComponentArgsRest(__VLS_451));
const { default: __VLS_454 } = __VLS_453.slots;
// @ts-ignore
[successSnackbar,];
const __VLS_455 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_456 = __VLS_asFunctionalComponent(__VLS_455, new __VLS_455({
    start: true,
}));
const __VLS_457 = __VLS_456({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_456));
const { default: __VLS_459 } = __VLS_458.slots;
var __VLS_458;
var __VLS_453;
const __VLS_460 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    modelValue: (__VLS_ctx.errorSnackbar),
    color: "error",
    timeout: "4000",
}));
const __VLS_462 = __VLS_461({
    modelValue: (__VLS_ctx.errorSnackbar),
    color: "error",
    timeout: "4000",
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
const { default: __VLS_464 } = __VLS_463.slots;
// @ts-ignore
[errorSnackbar,];
const __VLS_465 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_466 = __VLS_asFunctionalComponent(__VLS_465, new __VLS_465({
    start: true,
}));
const __VLS_467 = __VLS_466({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_466));
const { default: __VLS_469 } = __VLS_468.slots;
var __VLS_468;
(__VLS_ctx.errorMessage);
// @ts-ignore
[errorMessage,];
var __VLS_463;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['my-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
