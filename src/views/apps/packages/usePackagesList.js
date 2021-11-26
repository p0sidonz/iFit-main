import { ref, watch, computed } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default function useWorkoutList() {
  // Use toast
  const toast = useToast();

  const refInvoiceListTable = ref(null);

  // Table Handlers
  const tableColumns = [
   { key: 'id', label: '#', sortable: true },
    { key: "title", sortable: false },
    { key: 'status', sortable: true },
    { key: 'subscription_days', sortable: true},
    { key: 'currency', sortable: true },
    { key: 'amount', sortable: true },

    { key: 'created_at', sortable: false },

    // { key: 'issuedDate', sortable: true },
    // { key: 'balance', sortable: true },
    { key: "actions" },
  ];
  const perPage = ref(10);
  const totalInvoices = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [10, 25, 50, 100];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(true);
  const statusFilter = ref(null);

  const dataMeta = computed(() => {
    const localItemsCount = refInvoiceListTable.value
      ? refInvoiceListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalInvoices.value,
    };
  });

  const refetchData = () => {
    refInvoiceListTable.value.refresh();
  };

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData();
  });

  const fetchInvoices = (ctx, callback) => {
    var x = JSON.parse(localStorage.getItem("userInfo"));

    store
      .dispatch("app-packages/fetchPackages", {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
        id: x.id
      })
      .then((response) => {
        const invoices = response.data.data.Fitness_trainer_package;
        console.log("workouts", response.data.data.Fitness_trainer_package);
        callback(invoices);

        // totalInvoices.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching invoices' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveInvoiceStatusVariantAndIcon = (status) => {
    if (status === "Partial Payment")
      return { variant: "warning", icon: "PieChartIcon" };
    if (status === "Paid")
      return { variant: "success", icon: "CheckCircleIcon" };
    if (status === "Downloaded")
      return { variant: "info", icon: "ArrowDownCircleIcon" };
    if (status === "Draft") return { variant: "primary", icon: "SaveIcon" };
    if (status === "Sent") return { variant: "secondary", icon: "SendIcon" };
    if (status === "Past Due") return { variant: "danger", icon: "InfoIcon" };
    return { variant: "secondary", icon: "XIcon" };
  };

  const resolveClientAvatarVariant = (status) => {
    if (status === "Partial Payment") return "primary";
    if (status === "Paid") return "danger";
    if (status === "Downloaded") return "secondary";
    if (status === "Draft") return "warning";
    if (status === "Sent") return "info";
    if (status === "Past Due") return "success";
    return "primary";
  };

  const resolveUserStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    resolveUserStatusVariant,
    fetchInvoices,
    tableColumns,
    perPage,
    currentPage,
    totalInvoices,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refInvoiceListTable,

    statusFilter,

    resolveInvoiceStatusVariantAndIcon,
    resolveClientAvatarVariant,

    refetchData,
  };
}
