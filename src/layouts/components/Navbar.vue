<template>
  <div
    v-if="isLoggedIn"
    class="navbar-container d-flex content align-items-center"
  >
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
                  <dark-Toggler class="d-xl-none" />

      <search-bar />
      <notification-dropdown />

      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ userInfo.username }}
            </p>
            <span class="user-status">
              <b-badge pill variant="light-primary">{{
                userInfo.role.toUpperCase()
              }}</b-badge>
            </span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="userInfo.avatar"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          :to="`/user/${userInfo.username}`"
        >
          <feather-icon size="16" icon="UserIcon" class="mr-50" />
          <span>Profile</span> <div class="text-right"> <b-badge pill variant="info" class="badge-glow ">BETA</b-badge></div>

        </b-dropdown-item>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          :to="`/apps/chat`"
        >
          <feather-icon size="16" icon="MessageSquareIcon" class="mr-50" />
          <span>Chat</span>
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item
          :to="{ name: 'account-settings' }"
          link-class="d-flex align-items-center"
        >
          <feather-icon size="16" icon="SettingsIcon" class="mr-50" />
          <span>Settings</span>
        </b-dropdown-item>

        <b-dropdown-item
          v-if="userInfo.role === 'trainer'"
          :to="{ name: 'dashboard' }"
          link-class="d-flex align-items-center"
        >
          <feather-icon size="16" icon="SettingsIcon" class="mr-50" />
          <span>Dashboard</span>
        </b-dropdown-item>
        <b-dropdown-item
          v-if="userInfo.role === 'user'"
          :to="{ name: 'apps-trainers-list' }"
          link-class="d-flex align-items-center"
        >
          <feather-icon size="16" icon="SettingsIcon" class="mr-50" />
          <span>Dashboard</span>
        </b-dropdown-item>

        <b-dropdown-item
          :to="{ name: 'trainer-pricing' }"
          link-class="d-flex align-items-center danger dropdown-bg: danger"
          variant=""
        >
          <feather-icon size="16" icon="ArrowUpCircleIcon" class="mr-50" />
          <span>UPGRADE</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
          <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>

  <div v-else class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <dark-Toggler class="d-none d-lg-block" />

      <!-- Bookmarks Container -->
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-link class="nav-link">
        <feather-icon icon="CalendarIcon" size="21" />
      </b-link>

      <b-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="flat-primary"
        :to="{ name: 'login' }"
      >
        Login / Register
      </b-button>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
  BBadge,
  BButton,
} from "bootstrap-vue";
import DarkToggler from "@core/layouts/components/app-navbar/components/DarkToggler.vue";
import SearchBar from "./SearchBar.vue";
import NotificationDropdown from "./NotificationDropdown.vue";
import Ripple from "vue-ripple-directive";
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from "@/auth/utils";

export default {
  components: {
    BBadge,
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
    SearchBar,
    NotificationDropdown,
    BButton,

    // Navbar Components
    DarkToggler,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      isLoggedIn: isUserLoggedIn(),
    };
  },

  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    logout() {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("apollo-token");
      // Redirect to login page
      this.$router.push({ name: "login" });
    },
  },

  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
    // isUserLoggedIn() {
    //   return this.$store.getters.isUserLoggedIn;
    // },
  },
};
</script>
