import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

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
      component: () => import("@/views/Home.vue"),
      meta: {
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
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/Register.vue"),
      meta: {
        layout: "full",
      },
    },

    /*-----END OF LOGIN and REGISTER-----*/


        /*-----calendar-----*/

        {
          path: '/apps/calendar',
          name: 'apps-calendar',
          component: () => import('@/views/apps/calendar/Calendar.vue'),
        },

        
        
    /*-----ACCOUNT SETTINGS-----*/
    {
      path: "/accounts/edit",
      name: "account-settings",
      component: () => import("@/views/pages/account-setting/AccountSetting"),
      meta: {
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
        pageTitle: "Profile",
      },
    },

    {
      path: "/user/:username/:post_id",
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
    },
    {
      path: "/apps/users/view/:id",
      name: "apps-users-view",
      component: () => import("@/views/apps/user/users-view/UsersView.vue"),
    },
    {
      path: "/apps/users/edit/:id",
      name: "apps-users-edit",
      component: () => import("@/views/apps/user/users-edit/UsersEdit.vue"),
    },
    {
      path: "/apps/users/diet/:id",
      name: "apps-diet-view",
      component: () =>
        import("@/views/apps/user/users-create-diet/usersDiet.vue"),
    },

    // *===============================================---*
    // *--------- TRANER DASHBOARD/ USER  ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/apps/trainers/list",
      name: "apps-trainers-list",
      component: () => import("@/views/user-dashboard/trainers-list/UsersList.vue"),
    },
    {
      path: "/apps/trainers/view/:id",
      name: "apps-trainers-view",
      component: () => import("@/views/user-dashboard/trainer-view/UsersView.vue"),
    },

    {
      path: "/apps/trainers/view/program/:id",
      name: "user-program-view",
      component: () => import("@/views/user-dashboard/program-view/ProgramvVew.vue"),
      props: true,

    },
    {
      path: "/apps/trainers/view/diet/:id",
      name: "trainer-diet-view",
      component: () => import("@/views/user-dashboard/diet-view/dietView.vue"),
    },



    // *===============================================---*
    // *--------- NUTRITION ---- ---------------------------------------*
    // // *===============================================---*
    {
      path: "/apps/nutrition/edit/:id",
      name: "nutrition-edit",
      component: () => import("@/views/apps/nutrition/Todo.vue"),
    },

    {
      path: "/apps/nutrition/list/",
      name: "nutrition-list",
      component: () => import("@/views/apps/nutrition/Nlist.vue"),
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
    },
    {
      path: "/apps/workout/edit/:id",
      name: "workout-edit",
      component: () => import("@/views/apps/workout/edit.vue"),
    },

    // *===============================================---*
    // *--------- PROGRAMS ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/apps/programs/list/",
      name: "program-list",
      component: () => import("@/views/apps/program/list.vue"),
    },
    {
      path: "/apps/programs/edit/:id",
      name: "program-edit",
      component: () => import("@/views/apps/program/edit.vue"),
    },

    // *===============================================---*
    // *--------- DASHBOARD ---- ---------------------------------------*
    // // *===============================================---*

    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/dashboard/dashboard.vue"),
    },
    // *===============================================---*
    // *--------- CREATE PACKAGES ---- ---------------------------------------*
    // // *===============================================---*


    {
      path: "/trainer-packages",
      name: "trainer-packages",
      component: () => import("@/views/apps/packages/list.vue"),
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

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.auth.isUserLoggedIn;
  console.log(isLoggedIn);
  if (isLoggedIn) {
    return next();
  }
  if (!isLoggedIn && to.path !== "/login") {
    return next("/login");
  }
  return next();
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
