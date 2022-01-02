<template>
  <div>
    <user-list-add-new
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
    />

    <!-- Filters -->
    <users-list-filters
      :role-filter.sync="roleFilter"
      :plan-filter.sync="planFilter"
      :status-filter.sync="statusFilter"
      :role-options="roleOptions"
      :plan-options="planOptions"
      :status-options="statusOptions"
    />

    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>
          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />

              <div
                v-if="
                  totalOfflineClient === 5 ||
                  (totalOfflineClient > 5 && pkg_detail.title === 'Basic')
                "
              >
                <b-button
                  id="popover-button-danger"
                  v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                  variant="outline-danger"
                >
                  Max 5 client limit reached
                </b-button>

                <b-popover
                  target="popover-button-danger"
                  variant="danger"
                  triggers="focus"
                  placement="top"
                >
                  <template #title>
                    <span>Upgrade your package!</span>
                  </template>
                  <span
                    >Your plan limit of 5 client is reached. Please upgrade your
                    plan or remove the existing clients</span
                  >
                </b-popover>
              </div>

              <b-button
                v-else
                variant="primary"
                @click="isAddNewUserSidebarActive = true"
              >
                <span class="text-nowrap">Add User</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="fetchUsers"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <!-- Column: User -->

        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>

        <template #cell(user)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.avatar"
                :text="avatarText(data.item.fullame)"
                :variant="`light-${resolveUserRoleVariant(data.item.role)}`"
                :to="{
                  name: 'apps-users-view',
                  params: { id: data.item.traineelist.id },
                }"
              />
            </template>
            <b-link
              :to="{
                name: 'apps-users-view',
                params: { id: data.item.traineelist.id },
              }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.fullname }}
            </b-link>
            <small class="text-muted">@{{ data.item.username }}</small>
          </b-media>
        </template>

        <!-- Column: Role -->
        <template #cell(role)="data">
          <div class="text-nowrap">
            <feather-icon
              :icon="resolveUserRoleIcon(data.item.role)"
              size="18"
              class="mr-50"
              :class="`text-${resolveUserRoleVariant(data.item.role)}`"
            />
            <span class="align-text-top text-capitalize">{{
              data.item.role
            }}</span>
          </div>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveUserStatusVariant(
              data.item.traineelist.status
            )}`"
            class="text-capitalize"
          >
          </b-badge>
          {{ data.item.traineelist.status }}
        </template>
        <!-- Column: Status -->
        <template #cell(type)="data">
          <b-badge
            pill
            :variant="`light-${
              data.item.traineelist.is_offline ? 'dark' : 'success'
            }`"
            >{{
              data.item.traineelist.is_offline ? "Offline" : "Online"
            }}</b-badge
          >
        </template>
        <template #cell(expiry)="data">
          <div v-if="!data.item.traineelist.is_offline">
            <div
              v-if="
                timeCalc(data.item.traineelist.user_subscriptions[0].end_date)
              "
            >
              <b-badge pill variant="light-danger">
                Expired on
                {{
                  data.item.traineelist.user_subscriptions[0].end_date
                }}</b-badge
              >
            </div>
            <div
              v-if="
                timeCalc(
                  data.item.traineelist.user_subscriptions[0].end_date
                ) === false
              "
            >
              <b-badge pill variant="light-primary">
                {{
                  data.item.traineelist.user_subscriptions[0].end_date
                    | moment("from", "now", true)
                }}
                remaining</b-badge
              >
            </div>
          </div>

                    <div v-if="data.item.traineelist.is_offline">
            <div
              v-if="
                timeCalc(data.item.traineelist.end_date)
              "
            >
              <b-badge pill variant="light-danger">
                Expired on
                {{
                  data.item.traineelist.end_date
                }}</b-badge
              >
            </div>
            <div
              v-if="
                timeCalc(
                  data.item.traineelist.end_date
                ) === false
              "
            >
              <b-badge pill variant="light-primary">
                {{
                  data.item.traineelist.end_date
                    | moment("from", "now", true)
                }}
                remaining</b-badge
              >
            </div>
          </div>

        </template>
        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="flat-primary"
            :to="{
              name: 'apps-users-view',
              params: { id: data.item.traineelist.id },
            }"
          >
            View Dashboard
          </b-button>
          <b-button
            v-if="data.item.traineelist.is_offline"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="flat-danger"
            @click="deleteUserModal(data.item.traineelist.id)"
          >
            X
          </b-button>
        </template>
      </b-table>

      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span class="text-muted"
              >Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
              {{ dataMeta.of }} entries</span
            >
          </b-col>

          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-end
            "
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalUsers"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  VBPopover,
  BPopover,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import UsersListFilters from "./UsersListFilters.vue";
import useUsersList from "./useUsersList";
import userStoreModule from "../userStoreModule";
import UserListAddNew from "./UserListAddNew.vue";
import gql from "graphql-tag";
import Ripple from "vue-ripple-directive";
import { DELETE_USERRELATION_BY_ID } from "@/queries/";
export default {
  components: {
    UsersListFilters,
    UserListAddNew,

    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BSpinner,
    BPopover,

    vSelect,
  },

  directives: {
    "b-popover": VBPopover,

    Ripple,
  },

  methods: {
    timeCalc(date) {
      var m = this.$moment(date);
      var now = this.$moment();
      let o = m.isBefore(now);
      return o;
    },

    deleteUserModal(id) {
      this.$bvModal
        .msgBoxConfirm("Are you sure?", {
          cancelVariant: "outline-secondary",
        })
        .then((value) => {
          this.boxOne = value;

          if (value === true) {
            this.$apollo.mutate({
              mutation: DELETE_USERRELATION_BY_ID,
              variables: {
                id: id,
              },
            });
            this.refetchData();
            // location.reload();
          } else {
            console.log("fail to delete");
          }
        });
    },
  },

  setup() {
    const USER_APP_STORE_MODULE_NAME = "app-user";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    const isAddNewUserSidebarActive = ref(false);

    const roleOptions = [
      { label: "User", value: "user" },
      { label: "Trainer", value: "trainer" },
      // { label: 'Editor', value: 'editor' },
      // { label: 'Maintainer', value: 'maintainer' },
      // { label: 'Subscriber', value: 'subscriber' },
    ];

    const planOptions = [
      { label: "Offline", value: "offline" },
      // { label: 'Enterprise', value: 'enterprise' },
      // { label: 'Team', value: 'team' },
    ];

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ];
    const pkg_detail = JSON.parse(localStorage.getItem("pkg-detail"));

    const {
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      isLoading,
      totalOfflineClient,
      refUserListTable,
      refetchData,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    } = useUsersList();
    return {
      // Sidebar
      isAddNewUserSidebarActive,
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      isLoading,
      totalOfflineClient,
      refUserListTable,
      refetchData,
      //offline clinet
      // Filter
      avatarText,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,

      roleOptions,
      planOptions,
      statusOptions,
      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
      pkg_detail,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
