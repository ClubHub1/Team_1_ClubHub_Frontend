import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { feathersClient } from './backendAPI';
import useUserStore from './stores/user';
import useClubStore from './stores/clubStore';
const clubStore = useClubStore();
const userStore = useUserStore();
const clubs = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();
async function fetchClubs() {
    try {
        const res = await feathersClient.service('ClubMembership').find({
            query: { $select: ['clubid'], userid: userStore.id }
        });
        const ids = res.data.map(m => m.clubid);
        const clubRes = await feathersClient.service('Club').find({
            query: { club_id: { $in: ids } }
        });
        clubs.value = clubRes.data;
    }
    catch (e) {
        error.value = e.message || 'Failed to load clubs.';
    }
    finally {
        loading.value = false;
    }
}
function goToManage(id) {
    //console.log(id)
    console.log(clubs.value[0]);
    clubStore.setName(clubs.value[id].name);
    clubStore.setDescription(clubs.value[id].description);
    clubStore.setId(clubs.value[id].club_id);
    clubStore.setLogoUrl(clubs.value[id].logo_url);
    router.push(`/clubDash`);
}
onMounted(fetchClubs);
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
    maxWidth: "1000",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "py-8" },
    maxWidth: "1000",
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
const __VLS_6 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
VBtn;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    color: "primary",
    rounded: "lg",
    prependIcon: "mdi-plus",
    to: "/registerClub",
}));
const __VLS_8 = __VLS_7({
    color: "primary",
    rounded: "lg",
    prependIcon: "mdi-plus",
    to: "/registerClub",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
var __VLS_9;
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center py-12" },
    });
    const __VLS_11 = {}.VProgressCircular;
    /** @type {[typeof __VLS_components.VProgressCircular, typeof __VLS_components.vProgressCircular, ]} */ ;
    // @ts-ignore
    VProgressCircular;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        indeterminate: true,
        color: "primary",
        size: "48",
    }));
    const __VLS_13 = __VLS_12({
        indeterminate: true,
        color: "primary",
        size: "48",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    const __VLS_16 = {}.VAlert;
    /** @type {[typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ]} */ ;
    // @ts-ignore
    VAlert;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }));
    const __VLS_18 = __VLS_17({
        type: "error",
        variant: "tonal",
        rounded: "lg",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    const { default: __VLS_20 } = __VLS_19.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_19;
}
else if (__VLS_ctx.clubs.length === 0) {
    // @ts-ignore
    [clubs,];
    const __VLS_21 = {}.VCard;
    /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
    // @ts-ignore
    VCard;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-10 text-center" },
    }));
    const __VLS_23 = __VLS_22({
        elevation: "2",
        rounded: "lg",
        ...{ class: "pa-10 text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_25 } = __VLS_24.slots;
    const __VLS_26 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        size: "56",
        color: "grey-lighten-1",
        ...{ class: "mb-4" },
    }));
    const __VLS_28 = __VLS_27({
        size: "56",
        color: "grey-lighten-1",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const { default: __VLS_30 } = __VLS_29.slots;
    var __VLS_29;
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "text-h6 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-medium-emphasis mb-6" },
    });
    const __VLS_31 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        color: "primary",
        rounded: "lg",
        prependIcon: "mdi-plus",
        to: "/registerClub",
    }));
    const __VLS_33 = __VLS_32({
        color: "primary",
        rounded: "lg",
        prependIcon: "mdi-plus",
        to: "/registerClub",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_35 } = __VLS_34.slots;
    var __VLS_34;
    var __VLS_24;
}
else {
    const __VLS_36 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    VRow;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const { default: __VLS_40 } = __VLS_39.slots;
    for (const [club, index] of __VLS_getVForSourceType((__VLS_ctx.clubs))) {
        // @ts-ignore
        [clubs,];
        const __VLS_41 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        VCol;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            key: (index),
            cols: "12",
            sm: "6",
            md: "4",
        }));
        const __VLS_43 = __VLS_42({
            key: (index),
            cols: "12",
            sm: "6",
            md: "4",
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        const { default: __VLS_45 } = __VLS_44.slots;
        const __VLS_46 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        VCard;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
            rounded: "lg",
            elevation: "2",
            ...{ class: "d-flex flex-column" },
            ...{ style: {} },
        }));
        const __VLS_48 = __VLS_47({
            rounded: "lg",
            elevation: "2",
            ...{ class: "d-flex flex-column" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        const { default: __VLS_50 } = __VLS_49.slots;
        const __VLS_51 = {}.VCardText;
        /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
        // @ts-ignore
        VCardText;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            ...{ class: "flex-grow-1 pa-5" },
        }));
        const __VLS_53 = __VLS_52({
            ...{ class: "flex-grow-1 pa-5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        const { default: __VLS_55 } = __VLS_54.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex align-start mb-3" },
        });
        const __VLS_56 = {}.VAvatar;
        /** @type {[typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ]} */ ;
        // @ts-ignore
        VAvatar;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            color: "primary",
            variant: "tonal",
            size: "40",
            ...{ class: "mr-3 mt-1" },
        }));
        const __VLS_58 = __VLS_57({
            color: "primary",
            variant: "tonal",
            size: "40",
            ...{ class: "mr-3 mt-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        const { default: __VLS_60 } = __VLS_59.slots;
        const __VLS_61 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        VIcon;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            color: "primary",
        }));
        const __VLS_63 = __VLS_62({
            color: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        const { default: __VLS_65 } = __VLS_64.slots;
        var __VLS_64;
        var __VLS_59;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ class: "text-body-1 font-weight-bold" },
        });
        (club.name);
        const __VLS_66 = {}.VChip;
        /** @type {[typeof __VLS_components.VChip, typeof __VLS_components.vChip, typeof __VLS_components.VChip, typeof __VLS_components.vChip, ]} */ ;
        // @ts-ignore
        VChip;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
            size: "x-small",
            color: "success",
            variant: "tonal",
            ...{ class: "mt-1" },
        }));
        const __VLS_68 = __VLS_67({
            size: "x-small",
            color: "success",
            variant: "tonal",
            ...{ class: "mt-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        const { default: __VLS_70 } = __VLS_69.slots;
        (club.activity_status || 'Active');
        var __VLS_69;
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-body-2 text-medium-emphasis" },
            ...{ style: {} },
        });
        (club.description || 'No description provided.');
        var __VLS_54;
        if (club.logo_url) {
            const __VLS_71 = {}.VImg;
            /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
            // @ts-ignore
            VImg;
            // @ts-ignore
            const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
                ...{ class: "mx-auto mb-5" },
                rounded: "lg",
                width: (200),
                maxHeight: (300),
                src: (`http://localhost:42063${club.logo_url}`),
            }));
            const __VLS_73 = __VLS_72({
                ...{ class: "mx-auto mb-5" },
                rounded: "lg",
                width: (200),
                maxHeight: (300),
                src: (`http://localhost:42063${club.logo_url}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        }
        else {
            const __VLS_76 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            VIcon;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                ...{ class: "mb-15 mx-auto" },
                icon: "mdi-image-off-outline",
                size: "x-large",
            }));
            const __VLS_78 = __VLS_77({
                ...{ class: "mb-15 mx-auto" },
                icon: "mdi-image-off-outline",
                size: "x-large",
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        }
        const __VLS_81 = {}.VCardActions;
        /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
        // @ts-ignore
        VCardActions;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
            ...{ class: "pa-4 pt-0" },
        }));
        const __VLS_83 = __VLS_82({
            ...{ class: "pa-4 pt-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        const { default: __VLS_85 } = __VLS_84.slots;
        const __VLS_86 = {}.VSpacer;
        /** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
        // @ts-ignore
        VSpacer;
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
        const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
        const __VLS_91 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
            ...{ 'onClick': {} },
            color: "primary",
            variant: "flat",
            rounded: "lg",
            size: "small",
            prependIcon: "mdi-cog",
        }));
        const __VLS_93 = __VLS_92({
            ...{ 'onClick': {} },
            color: "primary",
            variant: "flat",
            rounded: "lg",
            size: "small",
            prependIcon: "mdi-cog",
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        let __VLS_95;
        let __VLS_96;
        const __VLS_97 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.clubs.length === 0))
                        return;
                    __VLS_ctx.goToManage(index);
                    // @ts-ignore
                    [goToManage,];
                } });
        const { default: __VLS_98 } = __VLS_94.slots;
        var __VLS_94;
        var __VLS_84;
        var __VLS_49;
        var __VLS_44;
    }
    var __VLS_39;
}
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
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-15']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
