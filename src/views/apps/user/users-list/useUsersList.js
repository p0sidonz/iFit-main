import { ref, watch, computed } from "@vue/composition-api";
import store from "@/store";
import { title } from "@core/utils/filter";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default function useUsersList() {
  // Use toast
  const toast = useToast();

  const refUserListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "user", sortable: true },
    { key: "email", sortable: true },
    { key: "role", sortable: true },
    // {
    //   key: "currentPlan",
    //   label: "Plan",
    //   formatter: title,
    //   sortable: true,
    // },
    { key: "status", sortable: true },
    { key: "actions" },
  ];
  const perPage = ref(10);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [5, 10, 25, 50];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(true);
  const roleFilter = ref(null);
  const planFilter = ref(null);
  const statusFilter = ref(null);
  const isLoading = ref(false);

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value
      ? refUserListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    };
  });

  const refetchData = () => {
    refUserListTable.value.refresh();
  };

  watch(
    [currentPage, perPage, searchQuery, roleFilter, planFilter, statusFilter],
    () => {
      refetchData();
    }
  );

  const fetchUsers = (ctx, callback) => {
    isLoading.value = true;
    store
      .dispatch("app-user/fetchUsers", {
        role: roleFilter.value,
        q: searchQuery.value,
        status: statusFilter.value,
        perPage: perPage.value,
        page: currentPage.value,
      })
      .then((response) => {
        isLoading.value = false;
        console.log("LIST", response);
        const test = response.data.data.Fitness_User;
        // const usersx = test.map(({ UserRelations }) => UserRelations)
        const users = test;
        const total = response.data.data.Fitness_User_aggregate.aggregate.count;
        callback(users);
        totalUsers.value = total;
      })
      .catch((error) => {
        isLoading.value = false;
        toast({
          component: ToastificationContent,
          props: {
            title: error,
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUserRoleVariant = (role) => {
    if (role === "subscriber") return "info";
    if (role === "author") return "warning";
    if (role === "trainer") return "success";
    if (role === "editor") return "danger";
    if (role === "user") return "primary";
    return "primary";
  };

  const resolveUserRoleIcon = (role) => {
    if (role === "subscriber") return "UserIcon";
    if (role === "author") return "SettingsIcon";
    if (role === "trainer") return "DatabaseIcon";
    if (role === "editor") return "Edit2Icon";
    if (role === "user") return "ServerIcon";
    return "UserIcon";
  };

  const resolveUserStatusVariant = (status) => {
    if (status === "pending") return "warning";
    if (status === "active") return "success";
    if (status === "inactive") return "secondary";
    return "primary";
  };

  return {
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
    refUserListTable,

    resolveUserRoleVariant,
    resolveUserRoleIcon,
    resolveUserStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
    isLoading,
  };
}
