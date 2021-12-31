import { t } from "@/@core/libs/i18n/utils";
import Vue from "vue";
import Vuex from 'vuex'
import VueRouter from "vue-router";
import store from "../store"
// Routes
import { canNavigate } from "@/libs/acl/routeProtection";
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from "@/auth/utils";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/pages/home/Home.vue"),
      meta: {
        requiresAuth: true,
        role: ["user", "trainer"],
        pageTitle: "Home",
        breadcrumb: [
          {
            text: "Home",
            active: true,
          },
        ],
      },
    },

    /*-----LOGIN and REGISTER-----*/
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login.vue"),
      meta: {
        layout: "full",
        requiresAuth: false,
        redirectIfLoggedIn: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/Register.vue"),
      meta: {
        layout: "full",
        redirectIfLoggedIn: true,
        requiresAuth: false,
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/auth/ForgotPassword.vue"),
      meta: {
        layout: "full",
        requiresAuth: false,
        redirectIfLoggedIn: true,
      },
    },

    {
      path: "/reset-password/:token",
      name: "reset-password",
      component: () => import("@/views/auth/ResetPassword.vue"),
      props: true,
      meta: {
        layout: "full",
        requiresAuth: false,
        redirectIfLoggedIn: true,
      },
    },


    {
      path: "/verify_email/:token",
      name: "verify-email",
      component: () => import("@/views/auth/VerifyEmail.vue"),
      props: true,
      meta: {
        layout: "full",
        requiresAuth: false,
        redirectIfLoggedIn: true,
      },
    },

    /*-----END OF LOGIN and REGISTER-----*/

    /*-----calendar-----*/

    {
      path: "/apps/calendar",
      name: "apps-calendar",
      component: () => import("@/views/apps/calendar/Calendar.vue"),
    },

    /*-----ACCOUNT SETTINGS-----*/
    {
      path: "/accounts/edit",
      name: "account-settings",
      component: () => import("@/views/pages/account-setting/AccountSetting"),
      meta: {
        role: ["user", "trainer"],
        requiresAuth: true,
        pageTitle: "Account Settings",
        breadcrumb: [
          {
            text: "Pages",
          },
          {
            text: "Account Settings",
            active: true,
          },
        ],
      },
    },

    /*-----END OF ACCOUNT SETTINGS-----*/

    {
      path: "/upgrade",
      name: "trainer-pricing",
      component: () => import("@/views/pages/pricing/Pricing.vue"),
      meta: {
        role: ["user", "trainer"],
        resource: "ACL",
        requiresAuth: true,

        breadcrumb: [
          {
            text: "Upgrade to trainer",
          },
          {
            text: "Packages",
            active: true,
          },
        ],
      },
    },

    {
      path: "/user/:username",
      name: "profile",
      component: () => import("@/views/pages/profile/Profile.vue"),
      meta: {
        role: ["user", "trainer"],
        requiresAuth: true,
        pageTitle: "Profile",
      },
    },

    {
      path: "/user/:username/:post_id",
      meta: {
        role: ["user", "trainer"],
        requiresAuth: true,
      },
      props: true,
      name: "postid",
      component: () => import("@/views/pages/profile/postById.vue"),
    },

    {
      path: "/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        layout: "full",
      },
    },

    // *===============================================---*
    // *--------- USER ---- ---------------------------------------*
    // // *===============================================---*
    {
      path: "/apps/users/list",
      name: "apps-users-list",
      component: () => import("@/views/apps/user/users-list/UsersList.vue"),
      meta: {
        requiresAuth: true,
        role: ["trainer"],
      },
    },
    {
      path: "/apps/users/view/:id",
      name: "apps-users-view",
      component: () => import("@/views/apps/user/users-view/UsersView.vue"),
      meta: {
        requiresAuth: true,
        role: ["trainer"],
      },
    },
    {
      path: "/apps/users/edit/:id",
      name: "apps-users-edit",
      component: () => import("@/views/apps/user/users-edit/UsersEdit.vue"),
      meta: {
        requiresAuth: true,
        role: ["trainer"],
      },
    },
    {
      path: "/apps/users/diet/:id",
      name: "apps-diet-view",
      component: () =>
        import("@/views/apps/user/users-create-diet/usersDiet.vue"),
      meta: {
        requiresAuth: true,
      },
    },

    // *===============================================---*
    // *--------- TRANER DASHBOARD/ USER  ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/apps/trainers/list",
      name: "apps-trainers-list",
      component: () =>
        import("@/views/user-dashboard/trainers-list/UsersList.vue"),
      meta: {
        requiresAuth: true,
        role: ["user"],
      },
    },
    {
      path: "/apps/trainers/view/:id",
      name: "apps-trainers-view",
      component: () =>
        import("@/views/user-dashboard/trainer-view/UsersView.vue"),
      meta: {
        role: ["user"],

        requiresAuth: true,
      },
    },

    {
      path: "/apps/trainers/view/program/:id",
      name: "user-program-view",
      component: () =>
        import("@/views/user-dashboard/program-view/ProgramvVew.vue"),
      meta: {
        role: ["user"],

        requiresAuth: true,
      },
      props: true,
    },
    {
      path: "/apps/trainers/view/diet/:id",
      name: "trainer-diet-view",
      component: () => import("@/views/user-dashboard/diet-view/dietView.vue"),
      meta: {
        role: ["user"],

        requiresAuth: true,
      },
    },

    // *===============================================---*
    // *--------- NUTRITION ---- ---------------------------------------*
    // // *===============================================---*
    {
      path: "/apps/nutrition/edit/:id",
      name: "nutrition-edit",
      component: () => import("@/views/apps/nutrition/Todo.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },

    {
      path: "/apps/nutrition/list/",
      name: "nutrition-list",
      component: () => import("@/views/apps/nutrition/Nlist.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },

    // *===============================================---*
    // *--------- WORKOUTS ---- ---------------------------------------*
    // // *===============================================---*
    // {
    //   path: '/apps/workout/list/:id',
    //   name: 'nutrition-edit',
    //   component: () => import('@/views/apps/workout/Todo.vue'),

    // },

    {
      path: "/apps/workout/list/",
      name: "workout-list",
      component: () => import("@/views/apps/workout/list.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },
    {
      path: "/apps/workout/edit/:id",
      name: "workout-edit",
      component: () => import("@/views/apps/workout/edit.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },

    // *===============================================---*
    // *--------- PROGRAMS ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/apps/programs/list/",
      name: "program-list",
      component: () => import("@/views/apps/program/list.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },
    {
      path: "/apps/programs/edit/:id",
      name: "program-edit",
      component: () => import("@/views/apps/program/edit.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },

    // *===============================================---*
    // *--------- DASHBOARD ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/dashboard/dashboard.vue"),
      meta: {
        requiresAuth: true,
        role: ["trainer"],
      },
    },
    // *===============================================---*
    // *--------- CREATE PACKAGES ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/trainer-packages",
      name: "trainer-packages",
      component: () => import("@/views/apps/packages/list.vue"),
      meta: {
        role: ["trainer"],
        requiresAuth: true,
      },
    },
    // {
    //   path: "/trainer-packages/view/:id",
    //   name: "packages-view",
    //   component: () => import("@/views/apps/packages/view.vue"),
    // },

    // *===============================================---*
    // *--------- CHAT  ---------------------------------------*
    // *===============================================---*
    {
      path: "/apps/chat",
      name: "apps-chat",
      component: () => import("@/views/apps/chat/Chat.vue"),
      meta: {
        contentRenderer: "sidebar-left",
        contentClass: "chat-application",
        requiresAuth: true,
        role: ["trainer", "user"],
      },

    },

    {
      path: "/not-authorized",
      name: "misc-not-authorized",
      component: () => import("@/views/pages/miscellaneous/NotAuthorized.vue"),
      meta: {
        layout: "full",
        requiresAuth: false,

      },
    },

    {
      path: "/pages/faq",
      name: "pages-faq",
      component: () => import("@/views/pages/faq/Faq.vue"),
      meta: {
        pageTitle: "FAQ",

        breadcrumb: [
          {
            text: "Pages",
          },
          {
            text: "FAQ",
            active: true,
          },
        ],
      },
    },

    // // Invoice
    // {
    //   path: '/apps/invoice/list',
    //   name: 'apps-invoice-list',
    //   component: () => import('@/views/apps/invoice/invoice-list/InvoiceList.vue'),
    // },
    // {
    //   path: '/apps/invoice/preview/:id',
    //   name: 'apps-invoice-preview',
    //   component: () => import('@/views/apps/invoice/invoice-preview/InvoicePreview.vue'),
    // },
    // {
    //   path: '/apps/invoice/add/',
    //   name: 'apps-invoice-add',
    //   component: () => import('@/views/apps/invoice/invoice-add/InvoiceAdd.vue'),
    // },
    // {
    //   path: '/apps/invoice/edit/:id',
    //   name: 'apps-invoice-edit',
    //   component: () => import('@/views/apps/invoice/invoice-edit/InvoiceEdit.vue'),
    // },

    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

router.beforeEach((to, _, next) => {
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "boxed";
  }

  let chkState = store.getters.appLoading
  console.log(chkState)
  const userData = getUserData();
  let lacksRole = null;
  const isLoggedIn = isUserLoggedIn();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (userData) {
    lacksRole = to.matched.some((record) => {
      return record.meta.role && !record.meta.role.includes(userData.role);
    });
  }
  if (requiresAuth && !isLoggedIn && to.name !== "login") {
    next({ name: "login" });
  } else if (isLoggedIn && to.meta.redirectIfLoggedIn) {
    next({ name: "home" });
  } else if (requiresAuth && isLoggedIn && lacksRole) {
    next({ name: "misc-not-authorized" });
  } else {
    next();
  }
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach((to, from, next) => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
