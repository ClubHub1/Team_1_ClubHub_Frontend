import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/components/dashboard/dashboardLayout.vue';
import { feathersClient } from '@/backendAPI';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const transactions = ref([]);
const loading = ref(false);
const addDialog = ref(false);
const deleteDialog = ref(false);
const deleteTarget = ref(null);
const snackbar = ref({ show: false, message: '', color: '' });
const filterCategory = ref('');
const filterType = ref('');
const searchQuery = ref('');
const formValid = ref(false);
const formLoading = ref(false);
const newTx = ref({
    title: '',
    amount: null,
    type: 'expense',
    category: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    payment_method: '',
    vendor_payer: '',
    receipt_url: '',
    reference_number: '',
    notes: '',
});
// Expanded categories
const expenseCategories = [
    'Event Expenses',
    'Office Supplies',
    'Food & Beverage',
    'Transportation',
    'Technology',
    'Marketing / Printing',
    'Dues / Fees',
    'Venue / Facility',
    'Equipment',
    'Awards / Gifts',
    'Travel & Lodging',
    'Uniforms / Apparel',
    'Other',
];
const incomeCategories = [
    'Dues Collected',
    'Fundraising',
    'Cash Sale',
    'Sponsorship',
    'University Allocation',
    'Donations',
    'Grants',
    'Ticket Sales',
    'Merchandise Sales',
    'Interest / Investment',
    'Other',
];
const paymentMethods = [
    'Cash',
    'Check',
    'Credit Card',
    'P-Card',
    'Bank Transfer',
    'Venmo / PayPal',
    'Zelle',
    'Other',
];
const allCategories = computed(() => newTx.value.type === 'income' ? incomeCategories : expenseCategories);
const allFilterCategories = [...new Set([...expenseCategories, ...incomeCategories])];
onMounted(async () => { await loadTransactions(); });
async function loadTransactions() {
    loading.value = true;
    try {
        const user = authStore.user;
        const membership = await feathersClient.service('ClubMembership').find({
            query: { userid: user.user_id, $limit: 1 }
        });
        const rows = membership.data ?? membership;
        const clubId = rows[0]?.clubid;
        const result = await feathersClient.service('transactions').find({
            query: { club: clubId, $limit: 500, $sort: { transaction_date: -1 } }
        });
        transactions.value = Array.isArray(result) ? result : result.data ?? [];
    }
    catch (e) {
        showSnack('Failed to load transactions.', 'error');
    }
    finally {
        loading.value = false;
    }
}
const filteredTransactions = computed(() => transactions.value.filter((tx) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = !q || tx.title?.toLowerCase().includes(q) || tx.category?.toLowerCase().includes(q) || tx.vendor_payer?.toLowerCase().includes(q);
    const matchCat = !filterCategory.value || tx.category === filterCategory.value;
    const matchType = !filterType.value ||
        (filterType.value === 'income' && tx.amount > 0) ||
        (filterType.value === 'expense' && tx.amount < 0);
    return matchSearch && matchCat && matchType;
}));
const totalBalance = computed(() => transactions.value.reduce((sum, tx) => sum + Number(tx.amount), 0));
const totalIncome = computed(() => transactions.value.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0));
const totalExpenses = computed(() => transactions.value.filter(t => t.amount < 0).reduce((s, t) => s + Number(t.amount), 0));
async function submitTransaction() {
    if (!formValid.value)
        return;
    formLoading.value = true;
    try {
        const user = authStore.user;
        const membership = await feathersClient.service('Club Membership').find({
            query: { userid: user.user_id, is_active: true, $limit: 1 }
        });
        const rows = membership.data ?? membership;
        const clubId = rows[0]?.clubid;
        const signedAmount = newTx.value.type === 'expense'
            ? -Math.abs(newTx.value.amount)
            : Math.abs(newTx.value.amount);
        const created = await feathersClient.service('transactions').create({
            club: clubId,
            created_by: user.user_id,
            title: newTx.value.title,
            amount: signedAmount,
            category: newTx.value.category,
            transaction_date: newTx.value.transaction_date,
            payment_method: newTx.value.payment_method,
            vendor_payer: newTx.value.vendor_payer,
            receipt_url: newTx.value.receipt_url,
            reference_number: newTx.value.reference_number,
            notes: newTx.value.notes,
        });
        transactions.value.unshift(created);
        addDialog.value = false;
        resetForm();
        showSnack('Transaction added!', 'success');
    }
    catch (e) {
        showSnack(e?.message || 'Failed to add transaction.', 'error');
    }
    finally {
        formLoading.value = false;
    }
}
function confirmDelete(tx) { deleteTarget.value = tx; deleteDialog.value = true; }
async function doDelete() {
    if (!deleteTarget.value)
        return;
    try {
        await feathersClient.service('transactions').remove(deleteTarget.value.transaction_id);
        transactions.value = transactions.value.filter(t => t.transaction_id !== deleteTarget.value.transaction_id);
        showSnack('Transaction deleted.', 'info');
    }
    catch {
        showSnack('Failed to delete.', 'error');
    }
    finally {
        deleteDialog.value = false;
        deleteTarget.value = null;
    }
}
function resetForm() {
    newTx.value = {
        title: '', amount: null, type: 'expense', category: '',
        transaction_date: new Date().toISOString().slice(0, 10),
        payment_method: '', vendor_payer: '', receipt_url: '',
        reference_number: '', notes: '',
    };
}
function showSnack(message, color) { snackbar.value = { show: true, message, color }; }
function formatCurrency(val) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val); }
function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
const required = (v) => !!v || 'Required.';
const positiveNumber = (v) => (!!v && Number(v) > 0) || 'Must be > 0.';
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
    maxWidth: "1100",
}));
const __VLS_7 = __VLS_6({
    maxWidth: "1100",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
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
const __VLS_10 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    ...{ 'onClick': {} },
    color: "primary",
    prependIcon: "mdi-plus",
    rounded: "lg",
}));
const __VLS_12 = __VLS_11({
    ...{ 'onClick': {} },
    color: "primary",
    prependIcon: "mdi-plus",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_14;
let __VLS_15;
const __VLS_16 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.addDialog = true;
            // @ts-ignore
            [addDialog,];
        } });
const { default: __VLS_17 } = __VLS_13.slots;
var __VLS_13;
const __VLS_18 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    ...{ class: "mb-6" },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_22 } = __VLS_21.slots;
const __VLS_23 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    cols: "12",
    sm: "4",
}));
const __VLS_25 = __VLS_24({
    cols: "12",
    sm: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_27 } = __VLS_26.slots;
const __VLS_28 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    color: (__VLS_ctx.totalBalance >= 0 ? 'primary' : 'error'),
    rounded: "lg",
    elevation: "3",
    ...{ class: "pa-4 text-white" },
}));
const __VLS_30 = __VLS_29({
    color: (__VLS_ctx.totalBalance >= 0 ? 'primary' : 'error'),
    rounded: "lg",
    elevation: "3",
    ...{ class: "pa-4 text-white" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_32 } = __VLS_31.slots;
// @ts-ignore
[totalBalance,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-overline opacity-80" },
});
const __VLS_33 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_37 } = __VLS_36.slots;
var __VLS_36;
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-h4 font-weight-bold" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.totalBalance));
// @ts-ignore
[totalBalance, formatCurrency,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-caption opacity-70 mt-1" },
});
var __VLS_31;
var __VLS_26;
const __VLS_38 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    cols: "12",
    sm: "4",
}));
const __VLS_40 = __VLS_39({
    cols: "12",
    sm: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_42 } = __VLS_41.slots;
const __VLS_43 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-4" },
    color: "green-lighten-5",
}));
const __VLS_45 = __VLS_44({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-4" },
    color: "green-lighten-5",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_47 } = __VLS_46.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-overline text-medium-emphasis" },
});
const __VLS_48 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    color: "success",
}));
const __VLS_50 = __VLS_49({
    color: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_52 } = __VLS_51.slots;
var __VLS_51;
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-h4 font-weight-bold text-success" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.totalIncome));
// @ts-ignore
[formatCurrency, totalIncome,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-caption text-medium-emphasis mt-1" },
});
(__VLS_ctx.transactions.filter(t => t.amount > 0).length);
// @ts-ignore
[transactions,];
var __VLS_46;
var __VLS_41;
const __VLS_53 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    cols: "12",
    sm: "4",
}));
const __VLS_55 = __VLS_54({
    cols: "12",
    sm: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_57 } = __VLS_56.slots;
const __VLS_58 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-4" },
    color: "red-lighten-5",
}));
const __VLS_60 = __VLS_59({
    rounded: "lg",
    elevation: "2",
    ...{ class: "pa-4" },
    color: "red-lighten-5",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_62 } = __VLS_61.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "d-flex align-center justify-space-between mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-overline text-medium-emphasis" },
});
const __VLS_63 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    color: "error",
}));
const __VLS_65 = __VLS_64({
    color: "error",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_67 } = __VLS_66.slots;
var __VLS_66;
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-h4 font-weight-bold text-error" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.totalExpenses));
// @ts-ignore
[formatCurrency, totalExpenses,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-caption text-medium-emphasis mt-1" },
});
(__VLS_ctx.transactions.filter(t => t.amount < 0).length);
// @ts-ignore
[transactions,];
var __VLS_61;
var __VLS_56;
var __VLS_21;
const __VLS_68 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-4" },
}));
const __VLS_70 = __VLS_69({
    elevation: "1",
    rounded: "lg",
    ...{ class: "pa-4 mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const { default: __VLS_72 } = __VLS_71.slots;
const __VLS_73 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    align: "center",
    dense: true,
}));
const __VLS_75 = __VLS_74({
    align: "center",
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_77 } = __VLS_76.slots;
const __VLS_78 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    cols: "12",
    sm: "5",
}));
const __VLS_80 = __VLS_79({
    cols: "12",
    sm: "5",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_82 } = __VLS_81.slots;
const __VLS_83 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search transactions...",
    prependInnerIcon: "mdi-magnify",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}));
const __VLS_85 = __VLS_84({
    modelValue: (__VLS_ctx.searchQuery),
    label: "Search transactions...",
    prependInnerIcon: "mdi-magnify",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
// @ts-ignore
[searchQuery,];
var __VLS_81;
const __VLS_88 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    cols: "12",
    sm: "3",
}));
const __VLS_90 = __VLS_89({
    cols: "12",
    sm: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const { default: __VLS_92 } = __VLS_91.slots;
const __VLS_93 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
VSelect;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    modelValue: (__VLS_ctx.filterCategory),
    items: (['', ...__VLS_ctx.allFilterCategories]),
    label: "Category",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}));
const __VLS_95 = __VLS_94({
    modelValue: (__VLS_ctx.filterCategory),
    items: (['', ...__VLS_ctx.allFilterCategories]),
    label: "Category",
    variant: "outlined",
    density: "compact",
    clearable: true,
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
// @ts-ignore
[filterCategory, allFilterCategories,];
var __VLS_91;
const __VLS_98 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    cols: "12",
    sm: "4",
}));
const __VLS_100 = __VLS_99({
    cols: "12",
    sm: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const { default: __VLS_102 } = __VLS_101.slots;
const __VLS_103 = {}.VBtnToggle;
/** @type {[typeof __VLS_components.VBtnToggle, typeof __VLS_components.vBtnToggle, typeof __VLS_components.VBtnToggle, typeof __VLS_components.vBtnToggle, ]} */ ;
// @ts-ignore
VBtnToggle;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.filterType),
    density: "compact",
    rounded: "lg",
    mandatory: true,
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.filterType),
    density: "compact",
    rounded: "lg",
    mandatory: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_107 } = __VLS_106.slots;
// @ts-ignore
[filterType,];
const __VLS_108 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    value: "",
    size: "small",
}));
const __VLS_110 = __VLS_109({
    value: "",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_112 } = __VLS_111.slots;
var __VLS_111;
const __VLS_113 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    value: "income",
    size: "small",
    color: "success",
}));
const __VLS_115 = __VLS_114({
    value: "income",
    size: "small",
    color: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
const { default: __VLS_117 } = __VLS_116.slots;
var __VLS_116;
const __VLS_118 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    value: "expense",
    size: "small",
    color: "error",
}));
const __VLS_120 = __VLS_119({
    value: "expense",
    size: "small",
    color: "error",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_122 } = __VLS_121.slots;
var __VLS_121;
var __VLS_106;
var __VLS_101;
var __VLS_76;
var __VLS_71;
const __VLS_123 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    elevation: "2",
    rounded: "lg",
}));
const __VLS_125 = __VLS_124({
    elevation: "2",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
const { default: __VLS_127 } = __VLS_126.slots;
const __VLS_128 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ class: "px-6 pt-5 pb-2" },
}));
const __VLS_130 = __VLS_129({
    ...{ class: "px-6 pt-5 pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const { default: __VLS_132 } = __VLS_131.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-h6" },
});
const __VLS_133 = {}.VChip;
/** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
// @ts-ignore
VChip;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    ...{ class: "ml-2" },
    size: "small",
    color: "primary",
    variant: "tonal",
}));
const __VLS_135 = __VLS_134({
    ...{ class: "ml-2" },
    size: "small",
    color: "primary",
    variant: "tonal",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_137 } = __VLS_136.slots;
(__VLS_ctx.filteredTransactions.length);
// @ts-ignore
[filteredTransactions,];
var __VLS_136;
var __VLS_131;
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pa-6" },
    });
    for (const [i] of __VLS_getVForSourceType((5))) {
        const __VLS_138 = {}.VSkeletonLoader;
        /** @type {[typeof __VLS_components.VSkeletonLoader, typeof __VLS_components.vSkeletonLoader, ]} */ ;
        // @ts-ignore
        VSkeletonLoader;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
            key: (i),
            type: "list-item-two-line",
            ...{ class: "mb-2" },
        }));
        const __VLS_140 = __VLS_139({
            key: (i),
            type: "list-item-two-line",
            ...{ class: "mb-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    }
}
else if (__VLS_ctx.filteredTransactions.length === 0) {
    // @ts-ignore
    [filteredTransactions,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center py-16" },
    });
    const __VLS_143 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        size: "56",
        color: "grey-lighten-1",
    }));
    const __VLS_145 = __VLS_144({
        size: "56",
        color: "grey-lighten-1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    const { default: __VLS_147 } = __VLS_146.slots;
    var __VLS_146;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-h6 mt-3 text-medium-emphasis" },
    });
    const __VLS_148 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        ...{ 'onClick': {} },
        color: "primary",
        variant: "text",
        ...{ class: "mt-1" },
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onClick': {} },
        color: "primary",
        variant: "text",
        ...{ class: "mt-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_152;
    let __VLS_153;
    const __VLS_154 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.filteredTransactions.length === 0))
                    return;
                __VLS_ctx.addDialog = true;
                // @ts-ignore
                [addDialog,];
            } });
    const { default: __VLS_155 } = __VLS_151.slots;
    var __VLS_151;
}
else {
    const __VLS_156 = {}.VList;
    /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
    // @ts-ignore
    VList;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        lines: "two",
        ...{ class: "pa-0" },
    }));
    const __VLS_158 = __VLS_157({
        lines: "two",
        ...{ class: "pa-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    const { default: __VLS_160 } = __VLS_159.slots;
    for (const [tx, idx] of __VLS_getVForSourceType((__VLS_ctx.filteredTransactions))) {
        (tx.transaction_id);
        // @ts-ignore
        [filteredTransactions,];
        if (idx > 0) {
            const __VLS_161 = {}.VDivider;
            /** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
            // @ts-ignore
            VDivider;
            // @ts-ignore
            const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({}));
            const __VLS_163 = __VLS_162({}, ...__VLS_functionalComponentArgsRest(__VLS_162));
        }
        const __VLS_166 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        VListItem;
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
            ...{ class: "py-3 px-6" },
        }));
        const __VLS_168 = __VLS_167({
            ...{ class: "py-3 px-6" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_167));
        const { default: __VLS_170 } = __VLS_169.slots;
        {
            const { prepend: __VLS_171 } = __VLS_169.slots;
            const __VLS_172 = {}.VAvatar;
            /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
            // @ts-ignore
            VAvatar;
            // @ts-ignore
            const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
                color: (tx.amount > 0 ? 'success' : 'error'),
                variant: "tonal",
                size: "42",
            }));
            const __VLS_174 = __VLS_173({
                color: (tx.amount > 0 ? 'success' : 'error'),
                variant: "tonal",
                size: "42",
            }, ...__VLS_functionalComponentArgsRest(__VLS_173));
            const { default: __VLS_176 } = __VLS_175.slots;
            const __VLS_177 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            VIcon;
            // @ts-ignore
            const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
                size: "20",
            }));
            const __VLS_179 = __VLS_178({
                size: "20",
            }, ...__VLS_functionalComponentArgsRest(__VLS_178));
            const { default: __VLS_181 } = __VLS_180.slots;
            (tx.amount > 0 ? 'mdi-arrow-down-circle' : 'mdi-arrow-up-circle');
            var __VLS_180;
            var __VLS_175;
        }
        const __VLS_182 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        VListItemTitle;
        // @ts-ignore
        const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
            ...{ class: "font-weight-medium" },
        }));
        const __VLS_184 = __VLS_183({
            ...{ class: "font-weight-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_183));
        const { default: __VLS_186 } = __VLS_185.slots;
        (tx.title);
        var __VLS_185;
        const __VLS_187 = {}.VListItemSubtitle;
        /** @type {[typeof __VLS_components.VListItemSubtitle, typeof __VLS_components.vListItemSubtitle, typeof __VLS_components.VListItemSubtitle, typeof __VLS_components.vListItemSubtitle, ]} */ ;
        // @ts-ignore
        VListItemSubtitle;
        // @ts-ignore
        const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({}));
        const __VLS_189 = __VLS_188({}, ...__VLS_functionalComponentArgsRest(__VLS_188));
        const { default: __VLS_191 } = __VLS_190.slots;
        const __VLS_192 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            size: "x-small",
            variant: "tonal",
            color: "blue-grey",
            ...{ class: "mr-2" },
        }));
        const __VLS_194 = __VLS_193({
            size: "x-small",
            variant: "tonal",
            color: "blue-grey",
            ...{ class: "mr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        const { default: __VLS_196 } = __VLS_195.slots;
        (tx.category);
        var __VLS_195;
        if (tx.payment_method) {
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-2" },
            });
            const __VLS_197 = {}.VChip;
            /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
            // @ts-ignore
            VChip;
            // @ts-ignore
            const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
                size: "x-small",
                variant: "tonal",
                color: "purple",
            }));
            const __VLS_199 = __VLS_198({
                size: "x-small",
                variant: "tonal",
                color: "purple",
            }, ...__VLS_functionalComponentArgsRest(__VLS_198));
            const { default: __VLS_201 } = __VLS_200.slots;
            (tx.payment_method);
            var __VLS_200;
        }
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-caption text-medium-emphasis" },
        });
        (__VLS_ctx.formatDate(tx.transaction_date));
        // @ts-ignore
        [formatDate,];
        if (tx.vendor_payer) {
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-caption text-medium-emphasis ml-2" },
            });
            (tx.vendor_payer);
        }
        if (tx.notes) {
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-caption text-medium-emphasis ml-2" },
            });
            (tx.notes);
        }
        if (tx.receipt_url) {
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.a, __VLS_intrinsics.a)({
                href: (tx.receipt_url),
                target: "_blank",
                ...{ class: "text-caption text-primary" },
            });
            const __VLS_202 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            VIcon;
            // @ts-ignore
            const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
                size: "12",
            }));
            const __VLS_204 = __VLS_203({
                size: "12",
            }, ...__VLS_functionalComponentArgsRest(__VLS_203));
            const { default: __VLS_206 } = __VLS_205.slots;
            var __VLS_205;
        }
        var __VLS_190;
        {
            const { append: __VLS_207 } = __VLS_169.slots;
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "d-flex align-center" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: (['text-h6', 'font-weight-bold', tx.amount > 0 ? 'text-success' : 'text-error']) },
            });
            (tx.amount > 0 ? '+' : '');
            (__VLS_ctx.formatCurrency(tx.amount));
            // @ts-ignore
            [formatCurrency,];
            const __VLS_208 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            VBtn;
            // @ts-ignore
            const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
                ...{ 'onClick': {} },
                icon: "mdi-delete-outline",
                size: "small",
                variant: "text",
                color: "grey",
            }));
            const __VLS_210 = __VLS_209({
                ...{ 'onClick': {} },
                icon: "mdi-delete-outline",
                size: "small",
                variant: "text",
                color: "grey",
            }, ...__VLS_functionalComponentArgsRest(__VLS_209));
            let __VLS_212;
            let __VLS_213;
            const __VLS_214 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.filteredTransactions.length === 0))
                            return;
                        __VLS_ctx.confirmDelete(tx);
                        // @ts-ignore
                        [confirmDelete,];
                    } });
            var __VLS_211;
        }
        var __VLS_169;
    }
    var __VLS_159;
}
var __VLS_126;
var __VLS_8;
const __VLS_216 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
VDialog;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    modelValue: (__VLS_ctx.addDialog),
    maxWidth: "580",
    persistent: true,
}));
const __VLS_218 = __VLS_217({
    modelValue: (__VLS_ctx.addDialog),
    maxWidth: "580",
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const { default: __VLS_220 } = __VLS_219.slots;
// @ts-ignore
[addDialog,];
const __VLS_221 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    rounded: "lg",
}));
const __VLS_223 = __VLS_222({
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
const { default: __VLS_225 } = __VLS_224.slots;
const __VLS_226 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
    ...{ class: "pa-5 pb-3" },
}));
const __VLS_228 = __VLS_227({
    ...{ class: "pa-5 pb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const { default: __VLS_230 } = __VLS_229.slots;
const __VLS_231 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    start: true,
    color: "primary",
}));
const __VLS_233 = __VLS_232({
    start: true,
    color: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
const { default: __VLS_235 } = __VLS_234.slots;
var __VLS_234;
var __VLS_229;
const __VLS_236 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({}));
const __VLS_238 = __VLS_237({}, ...__VLS_functionalComponentArgsRest(__VLS_237));
const __VLS_241 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    ...{ class: "pa-5" },
    ...{ style: {} },
}));
const __VLS_243 = __VLS_242({
    ...{ class: "pa-5" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
const { default: __VLS_245 } = __VLS_244.slots;
const __VLS_246 = {}.VForm;
/** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
// @ts-ignore
VForm;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.formValid),
}));
const __VLS_248 = __VLS_247({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.formValid),
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
let __VLS_250;
let __VLS_251;
const __VLS_252 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.submitTransaction) });
const { default: __VLS_253 } = __VLS_249.slots;
// @ts-ignore
[formValid, submitTransaction,];
const __VLS_254 = {}.VBtnToggle;
/** @type {[typeof __VLS_components.VBtnToggle, typeof __VLS_components.vBtnToggle, typeof __VLS_components.VBtnToggle, typeof __VLS_components.vBtnToggle, ]} */ ;
// @ts-ignore
VBtnToggle;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    modelValue: (__VLS_ctx.newTx.type),
    mandatory: true,
    rounded: "lg",
    ...{ class: "mb-5 w-100" },
}));
const __VLS_256 = __VLS_255({
    modelValue: (__VLS_ctx.newTx.type),
    mandatory: true,
    rounded: "lg",
    ...{ class: "mb-5 w-100" },
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
const { default: __VLS_258 } = __VLS_257.slots;
// @ts-ignore
[newTx,];
const __VLS_259 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
    value: "expense",
    color: "error",
    ...{ style: {} },
}));
const __VLS_261 = __VLS_260({
    value: "expense",
    color: "error",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
const { default: __VLS_263 } = __VLS_262.slots;
const __VLS_264 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    start: true,
}));
const __VLS_266 = __VLS_265({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
const { default: __VLS_268 } = __VLS_267.slots;
var __VLS_267;
var __VLS_262;
const __VLS_269 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
    value: "income",
    color: "success",
    ...{ style: {} },
}));
const __VLS_271 = __VLS_270({
    value: "income",
    color: "success",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_270));
const { default: __VLS_273 } = __VLS_272.slots;
const __VLS_274 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
VIcon;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
    start: true,
}));
const __VLS_276 = __VLS_275({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_275));
const { default: __VLS_278 } = __VLS_277.slots;
var __VLS_277;
var __VLS_272;
var __VLS_257;
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-3" },
});
const __VLS_279 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_280 = __VLS_asFunctionalComponent(__VLS_279, new __VLS_279({
    modelValue: (__VLS_ctx.newTx.title),
    label: "Title / Description",
    prependInnerIcon: "mdi-format-title",
    rules: ([__VLS_ctx.required]),
    variant: "outlined",
    ...{ class: "mb-3" },
}));
const __VLS_281 = __VLS_280({
    modelValue: (__VLS_ctx.newTx.title),
    label: "Title / Description",
    prependInnerIcon: "mdi-format-title",
    rules: ([__VLS_ctx.required]),
    variant: "outlined",
    ...{ class: "mb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_280));
// @ts-ignore
[newTx, required,];
const __VLS_284 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    dense: true,
}));
const __VLS_286 = __VLS_285({
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
const { default: __VLS_288 } = __VLS_287.slots;
const __VLS_289 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
    cols: "6",
}));
const __VLS_291 = __VLS_290({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
const { default: __VLS_293 } = __VLS_292.slots;
const __VLS_294 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
    modelValue: (__VLS_ctx.newTx.amount),
    modelModifiers: { number: true, },
    label: "Amount ($)",
    type: "number",
    step: "0.01",
    min: "0.01",
    rules: ([__VLS_ctx.required, __VLS_ctx.positiveNumber]),
    prependInnerIcon: "mdi-currency-usd",
    variant: "outlined",
}));
const __VLS_296 = __VLS_295({
    modelValue: (__VLS_ctx.newTx.amount),
    modelModifiers: { number: true, },
    label: "Amount ($)",
    type: "number",
    step: "0.01",
    min: "0.01",
    rules: ([__VLS_ctx.required, __VLS_ctx.positiveNumber]),
    prependInnerIcon: "mdi-currency-usd",
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
// @ts-ignore
[newTx, required, positiveNumber,];
var __VLS_292;
const __VLS_299 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
    cols: "6",
}));
const __VLS_301 = __VLS_300({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
const { default: __VLS_303 } = __VLS_302.slots;
const __VLS_304 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    modelValue: (__VLS_ctx.newTx.transaction_date),
    label: "Date",
    type: "date",
    rules: ([__VLS_ctx.required]),
    prependInnerIcon: "mdi-calendar",
    variant: "outlined",
}));
const __VLS_306 = __VLS_305({
    modelValue: (__VLS_ctx.newTx.transaction_date),
    label: "Date",
    type: "date",
    rules: ([__VLS_ctx.required]),
    prependInnerIcon: "mdi-calendar",
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
// @ts-ignore
[newTx, required,];
var __VLS_302;
var __VLS_287;
const __VLS_309 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
VRow;
// @ts-ignore
const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
    dense: true,
}));
const __VLS_311 = __VLS_310({
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_310));
const { default: __VLS_313 } = __VLS_312.slots;
const __VLS_314 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    cols: "6",
}));
const __VLS_316 = __VLS_315({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
const { default: __VLS_318 } = __VLS_317.slots;
const __VLS_319 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
VSelect;
// @ts-ignore
const __VLS_320 = __VLS_asFunctionalComponent(__VLS_319, new __VLS_319({
    modelValue: (__VLS_ctx.newTx.category),
    items: (__VLS_ctx.allCategories),
    label: "Category",
    prependInnerIcon: "mdi-tag-outline",
    rules: ([__VLS_ctx.required]),
    variant: "outlined",
}));
const __VLS_321 = __VLS_320({
    modelValue: (__VLS_ctx.newTx.category),
    items: (__VLS_ctx.allCategories),
    label: "Category",
    prependInnerIcon: "mdi-tag-outline",
    rules: ([__VLS_ctx.required]),
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_320));
// @ts-ignore
[newTx, required, allCategories,];
var __VLS_317;
const __VLS_324 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
VCol;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    cols: "6",
}));
const __VLS_326 = __VLS_325({
    cols: "6",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
const { default: __VLS_328 } = __VLS_327.slots;
const __VLS_329 = {}.VSelect;
/** @type {[typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ]} */ ;
// @ts-ignore
VSelect;
// @ts-ignore
const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({
    modelValue: (__VLS_ctx.newTx.payment_method),
    items: (__VLS_ctx.paymentMethods),
    label: "Payment Method",
    prependInnerIcon: "mdi-credit-card-outline",
    variant: "outlined",
}));
const __VLS_331 = __VLS_330({
    modelValue: (__VLS_ctx.newTx.payment_method),
    items: (__VLS_ctx.paymentMethods),
    label: "Payment Method",
    prependInnerIcon: "mdi-credit-card-outline",
    variant: "outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_330));
// @ts-ignore
[newTx, paymentMethods,];
var __VLS_327;
var __VLS_312;
const __VLS_334 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
    ...{ class: "my-4" },
}));
const __VLS_336 = __VLS_335({
    ...{ class: "my-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-3" },
});
(__VLS_ctx.newTx.type === 'expense' ? 'Vendor Information' : 'Payer Information');
// @ts-ignore
[newTx,];
const __VLS_339 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent(__VLS_339, new __VLS_339({
    modelValue: (__VLS_ctx.newTx.vendor_payer),
    label: (__VLS_ctx.newTx.type === 'expense' ? 'Vendor / Merchant Name' : 'Payer / Source Name'),
    prependInnerIcon: (__VLS_ctx.newTx.type === 'expense' ? 'mdi-store' : 'mdi-account'),
    variant: "outlined",
    ...{ class: "mb-3" },
}));
const __VLS_341 = __VLS_340({
    modelValue: (__VLS_ctx.newTx.vendor_payer),
    label: (__VLS_ctx.newTx.type === 'expense' ? 'Vendor / Merchant Name' : 'Payer / Source Name'),
    prependInnerIcon: (__VLS_ctx.newTx.type === 'expense' ? 'mdi-store' : 'mdi-account'),
    variant: "outlined",
    ...{ class: "mb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
// @ts-ignore
[newTx, newTx, newTx,];
const __VLS_344 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    modelValue: (__VLS_ctx.newTx.reference_number),
    label: "Reference / Check / Invoice Number (optional)",
    prependInnerIcon: "mdi-pound",
    variant: "outlined",
    ...{ class: "mb-3" },
}));
const __VLS_346 = __VLS_345({
    modelValue: (__VLS_ctx.newTx.reference_number),
    label: "Reference / Check / Invoice Number (optional)",
    prependInnerIcon: "mdi-pound",
    variant: "outlined",
    ...{ class: "mb-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
// @ts-ignore
[newTx,];
const __VLS_349 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
    ...{ class: "my-4" },
}));
const __VLS_351 = __VLS_350({
    ...{ class: "my-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_350));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-overline text-primary mb-3" },
});
const __VLS_354 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
VTextField;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
    modelValue: (__VLS_ctx.newTx.receipt_url),
    label: "Receipt URL (optional)",
    prependInnerIcon: "mdi-paperclip",
    variant: "outlined",
    hint: "Paste a link to a scanned receipt, Google Drive file, or image",
    persistentHint: true,
    ...{ class: "mb-4" },
}));
const __VLS_356 = __VLS_355({
    modelValue: (__VLS_ctx.newTx.receipt_url),
    label: "Receipt URL (optional)",
    prependInnerIcon: "mdi-paperclip",
    variant: "outlined",
    hint: "Paste a link to a scanned receipt, Google Drive file, or image",
    persistentHint: true,
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
// @ts-ignore
[newTx,];
const __VLS_359 = {}.VTextarea;
/** @type {[typeof __VLS_components.VTextarea, typeof __VLS_components.vTextarea, ]} */ ;
// @ts-ignore
VTextarea;
// @ts-ignore
const __VLS_360 = __VLS_asFunctionalComponent(__VLS_359, new __VLS_359({
    modelValue: (__VLS_ctx.newTx.notes),
    label: "Additional Notes (optional)",
    prependInnerIcon: "mdi-note-text",
    variant: "outlined",
    rows: "2",
    hideDetails: true,
}));
const __VLS_361 = __VLS_360({
    modelValue: (__VLS_ctx.newTx.notes),
    label: "Additional Notes (optional)",
    prependInnerIcon: "mdi-note-text",
    variant: "outlined",
    rows: "2",
    hideDetails: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_360));
// @ts-ignore
[newTx,];
var __VLS_249;
var __VLS_244;
const __VLS_364 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({}));
const __VLS_366 = __VLS_365({}, ...__VLS_functionalComponentArgsRest(__VLS_365));
const __VLS_369 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
VCardActions;
// @ts-ignore
const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
    ...{ class: "pa-4" },
}));
const __VLS_371 = __VLS_370({
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_370));
const { default: __VLS_373 } = __VLS_372.slots;
const __VLS_374 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
    ...{ 'onClick': {} },
    variant: "text",
}));
const __VLS_376 = __VLS_375({
    ...{ 'onClick': {} },
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_375));
let __VLS_378;
let __VLS_379;
const __VLS_380 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.addDialog = false;
            __VLS_ctx.resetForm();
            // @ts-ignore
            [addDialog, resetForm,];
        } });
const { default: __VLS_381 } = __VLS_377.slots;
var __VLS_377;
const __VLS_382 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
VSpacer;
// @ts-ignore
const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({}));
const __VLS_384 = __VLS_383({}, ...__VLS_functionalComponentArgsRest(__VLS_383));
const __VLS_387 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
    ...{ 'onClick': {} },
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.formLoading),
    disabled: (!__VLS_ctx.formValid),
    prependIcon: "mdi-check",
}));
const __VLS_389 = __VLS_388({
    ...{ 'onClick': {} },
    color: "primary",
    rounded: "lg",
    loading: (__VLS_ctx.formLoading),
    disabled: (!__VLS_ctx.formValid),
    prependIcon: "mdi-check",
}, ...__VLS_functionalComponentArgsRest(__VLS_388));
let __VLS_391;
let __VLS_392;
const __VLS_393 = ({ click: {} },
    { onClick: (__VLS_ctx.submitTransaction) });
const { default: __VLS_394 } = __VLS_390.slots;
// @ts-ignore
[formValid, submitTransaction, formLoading,];
var __VLS_390;
var __VLS_372;
var __VLS_224;
var __VLS_219;
const __VLS_395 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
VDialog;
// @ts-ignore
const __VLS_396 = __VLS_asFunctionalComponent(__VLS_395, new __VLS_395({
    modelValue: (__VLS_ctx.deleteDialog),
    maxWidth: "380",
}));
const __VLS_397 = __VLS_396({
    modelValue: (__VLS_ctx.deleteDialog),
    maxWidth: "380",
}, ...__VLS_functionalComponentArgsRest(__VLS_396));
const { default: __VLS_399 } = __VLS_398.slots;
// @ts-ignore
[deleteDialog,];
const __VLS_400 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
VCard;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    rounded: "lg",
}));
const __VLS_402 = __VLS_401({
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
const { default: __VLS_404 } = __VLS_403.slots;
const __VLS_405 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
VCardTitle;
// @ts-ignore
const __VLS_406 = __VLS_asFunctionalComponent(__VLS_405, new __VLS_405({
    ...{ class: "pa-5" },
}));
const __VLS_407 = __VLS_406({
    ...{ class: "pa-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_406));
const { default: __VLS_409 } = __VLS_408.slots;
var __VLS_408;
const __VLS_410 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
VCardText;
// @ts-ignore
const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
    ...{ class: "pb-2" },
}));
const __VLS_412 = __VLS_411({
    ...{ class: "pb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_411));
const { default: __VLS_414 } = __VLS_413.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.deleteTarget?.title);
// @ts-ignore
[deleteTarget,];
var __VLS_413;
const __VLS_415 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
VCardActions;
// @ts-ignore
const __VLS_416 = __VLS_asFunctionalComponent(__VLS_415, new __VLS_415({
    ...{ class: "pa-4" },
}));
const __VLS_417 = __VLS_416({
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_416));
const { default: __VLS_419 } = __VLS_418.slots;
const __VLS_420 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
    ...{ 'onClick': {} },
    variant: "text",
}));
const __VLS_422 = __VLS_421({
    ...{ 'onClick': {} },
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_421));
let __VLS_424;
let __VLS_425;
const __VLS_426 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.deleteDialog = false;
            // @ts-ignore
            [deleteDialog,];
        } });
const { default: __VLS_427 } = __VLS_423.slots;
var __VLS_423;
const __VLS_428 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
VSpacer;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({}));
const __VLS_430 = __VLS_429({}, ...__VLS_functionalComponentArgsRest(__VLS_429));
const __VLS_433 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_434 = __VLS_asFunctionalComponent(__VLS_433, new __VLS_433({
    ...{ 'onClick': {} },
    color: "error",
    prependIcon: "mdi-delete",
}));
const __VLS_435 = __VLS_434({
    ...{ 'onClick': {} },
    color: "error",
    prependIcon: "mdi-delete",
}, ...__VLS_functionalComponentArgsRest(__VLS_434));
let __VLS_437;
let __VLS_438;
const __VLS_439 = ({ click: {} },
    { onClick: (__VLS_ctx.doDelete) });
const { default: __VLS_440 } = __VLS_436.slots;
// @ts-ignore
[doDelete,];
var __VLS_436;
var __VLS_418;
var __VLS_403;
var __VLS_398;
const __VLS_441 = {}.VSnackbar;
/** @type {[typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, typeof __VLS_components.VSnackbar, typeof __VLS_components.vSnackbar, ]} */ ;
// @ts-ignore
VSnackbar;
// @ts-ignore
const __VLS_442 = __VLS_asFunctionalComponent(__VLS_441, new __VLS_441({
    modelValue: (__VLS_ctx.snackbar.show),
    color: (__VLS_ctx.snackbar.color),
    timeout: "3000",
}));
const __VLS_443 = __VLS_442({
    modelValue: (__VLS_ctx.snackbar.show),
    color: (__VLS_ctx.snackbar.color),
    timeout: "3000",
}, ...__VLS_functionalComponentArgsRest(__VLS_442));
const { default: __VLS_445 } = __VLS_444.slots;
// @ts-ignore
[snackbar, snackbar,];
(__VLS_ctx.snackbar.message);
// @ts-ignore
[snackbar,];
var __VLS_444;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-success']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-overline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
