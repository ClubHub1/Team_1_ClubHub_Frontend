import { RouterView } from 'vue-router';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const search = computed({
    get() {
        return route.query.search ?? '';
    },
    set(search) {
        router.replace({ query: { search } });
    },
});
function iconClicked() {
    router.push('/');
}
async function logoutUser() {
    await authStore.logout();
    router.push('/');
}
const links = {
    homeLink: {
        name: 'Home',
        link: '/'
    },
    aboutLink: {
        name: 'About Us',
        link: '/about'
    }
};
router.push('/');
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
const __VLS_6 = {}.VAppBar;
/** @type {[typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, typeof __VLS_components.VAppBar, typeof __VLS_components.vAppBar, ]} */ ;
// @ts-ignore
VAppBar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    elevation: (6),
    color: "#4E4E4E",
    scrollBehavior: "hide",
}));
const __VLS_8 = __VLS_7({
    elevation: (6),
    color: "#4E4E4E",
    scrollBehavior: "hide",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
{
    const { prepend: __VLS_11 } = __VLS_9.slots;
    const __VLS_12 = {}.VIcon;
    /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
    // @ts-ignore
    VIcon;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        icon: "$chLogo",
        size: "65",
        to: "/",
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        icon: "$chLogo",
        size: "65",
        to: "/",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    const __VLS_18 = ({ click: {} },
        { onClick: (__VLS_ctx.iconClicked) });
    // @ts-ignore
    [iconClicked,];
    var __VLS_15;
    const __VLS_20 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    VImg;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "mt-3" },
        src: "src/assets/clubhubText.png",
        cover: true,
        width: (200),
        height: (200),
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "mt-3" },
        src: "src/assets/clubhubText.png",
        cover: true,
        width: (200),
        height: (200),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
const __VLS_25 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
VDivider;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    thickness: (5),
    ...{ class: "mx3" },
    inset: true,
    vertical: true,
}));
const __VLS_27 = __VLS_26({
    thickness: (5),
    ...{ class: "mx3" },
    inset: true,
    vertical: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const __VLS_30 = {}.VAppBarTitle;
/** @type {[typeof __VLS_components.VAppBarTitle, typeof __VLS_components.vAppBarTitle, typeof __VLS_components.VAppBarTitle, typeof __VLS_components.vAppBarTitle, ]} */ ;
// @ts-ignore
VAppBarTitle;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    ...{ class: "text-h4 font-weight-bold" },
}));
const __VLS_32 = __VLS_31({
    ...{ class: "text-h4 font-weight-bold" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
{
    const { append: __VLS_35 } = __VLS_9.slots;
    if (__VLS_ctx.authStore.isAuthenticated) {
        // @ts-ignore
        [authStore,];
        const __VLS_36 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            appendIcon: "mdi-view-dashboard",
            ...{ class: "mr-5" },
            to: "/dashboard",
            rounded: "pill",
        }));
        const __VLS_38 = __VLS_37({
            appendIcon: "mdi-view-dashboard",
            ...{ class: "mr-5" },
            to: "/dashboard",
            rounded: "pill",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const { default: __VLS_40 } = __VLS_39.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "d-none d-md-inline" },
        });
        var __VLS_39;
    }
    if (__VLS_ctx.authStore.isAuthenticated) {
        // @ts-ignore
        [authStore,];
        const __VLS_41 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            appendIcon: "mdi-account",
            to: "/profile",
            rounded: "pill",
        }));
        const __VLS_43 = __VLS_42({
            appendIcon: "mdi-account",
            to: "/profile",
            rounded: "pill",
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        const { default: __VLS_45 } = __VLS_44.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "d-none d-md-inline" },
        });
        var __VLS_44;
    }
    else {
        const __VLS_46 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        VBtn;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
            appendIcon: "mdi-account",
            to: "/login",
            rounded: "pill",
        }));
        const __VLS_48 = __VLS_47({
            appendIcon: "mdi-account",
            to: "/login",
            rounded: "pill",
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        const { default: __VLS_50 } = __VLS_49.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "d-none d-sm-inline" },
        });
        var __VLS_49;
    }
    const __VLS_51 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        ...{ class: "ml-5" },
        appendIcon: "mdi-home",
        to: "/",
        rounded: "pill",
    }));
    const __VLS_53 = __VLS_52({
        ...{ class: "ml-5" },
        appendIcon: "mdi-home",
        to: "/",
        rounded: "pill",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_55 } = __VLS_54.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "d-none d-md-inline" },
    });
    var __VLS_54;
    if (__VLS_ctx.authStore.isAuthenticated) {
        // @ts-ignore
        [authStore,];
        const __VLS_56 = {}.VMenu;
        /** @type {[typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, typeof __VLS_components.VMenu, typeof __VLS_components.vMenu, ]} */ ;
        // @ts-ignore
        VMenu;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
        const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
        const { default: __VLS_60 } = __VLS_59.slots;
        {
            const { activator: __VLS_61 } = __VLS_59.slots;
            const [{ props }] = __VLS_getSlotParameters(__VLS_61);
            const __VLS_62 = {}.VBtn;
            /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
            // @ts-ignore
            VBtn;
            // @ts-ignore
            const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
                ...{ class: "ml-5" },
                icon: "mdi-dots-vertical",
                ...(props),
            }));
            const __VLS_64 = __VLS_63({
                ...{ class: "ml-5" },
                icon: "mdi-dots-vertical",
                ...(props),
            }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        }
        const __VLS_67 = {}.VList;
        /** @type {[typeof __VLS_components.VList, typeof __VLS_components.vList, typeof __VLS_components.VList, typeof __VLS_components.vList, ]} */ ;
        // @ts-ignore
        VList;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({}));
        const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
        const { default: __VLS_71 } = __VLS_70.slots;
        const __VLS_72 = {}.VListItem;
        /** @type {[typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, typeof __VLS_components.VListItem, typeof __VLS_components.vListItem, ]} */ ;
        // @ts-ignore
        VListItem;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            ...{ 'onClick': {} },
            appendIcon: "mdi-logout",
        }));
        const __VLS_74 = __VLS_73({
            ...{ 'onClick': {} },
            appendIcon: "mdi-logout",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        let __VLS_76;
        let __VLS_77;
        const __VLS_78 = ({ click: {} },
            { onClick: (__VLS_ctx.logoutUser) });
        const { default: __VLS_79 } = __VLS_75.slots;
        // @ts-ignore
        [logoutUser,];
        const __VLS_80 = {}.VListItemTitle;
        /** @type {[typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, typeof __VLS_components.VListItemTitle, typeof __VLS_components.vListItemTitle, ]} */ ;
        // @ts-ignore
        VListItemTitle;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
        const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
        const { default: __VLS_84 } = __VLS_83.slots;
        var __VLS_83;
        var __VLS_75;
        var __VLS_70;
        var __VLS_59;
    }
}
var __VLS_9;
const __VLS_85 = {}.VMain;
/** @type {[typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ]} */ ;
// @ts-ignore
VMain;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_89 } = __VLS_88.slots;
const __VLS_90 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
var __VLS_88;
const __VLS_95 = {}.VFooter;
/** @type {[typeof __VLS_components.VFooter, typeof __VLS_components.vFooter, typeof __VLS_components.VFooter, typeof __VLS_components.vFooter, ]} */ ;
// @ts-ignore
VFooter;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    ...{ class: "d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 mt-15" },
    color: "surface-light",
}));
const __VLS_97 = __VLS_96({
    ...{ class: "d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 mt-15" },
    color: "surface-light",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_99 } = __VLS_98.slots;
for (const [link] of __VLS_getVForSourceType((__VLS_ctx.links))) {
    // @ts-ignore
    [links,];
    const __VLS_100 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    VBtn;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        text: (link.name),
        to: (link.link),
        variant: "text",
        rounded: true,
    }));
    const __VLS_102 = __VLS_101({
        text: (link.name),
        to: (link.link),
        variant: "text",
        rounded: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1-0-100 text-center mt-2" },
});
(new Date().getFullYear());
__VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
var __VLS_98;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mx3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-sm-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-5']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-15']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1-0-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
