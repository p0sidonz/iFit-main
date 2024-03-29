<template>
  <!-- Table Container Card -->
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label>Entries</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
          <b-button
            variant="primary"
            @click="CreateNewMealModal = !CreateNewMealModal"
          >
            Create New Workout
          </b-button>
        </b-col>

        <!-- Search -->
        <b-col cols="12" md="6">
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <v-select
              v-model="statusFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              class="invoice-filter-select"
              placeholder="Filter"
            >
              <template #selected-option="{ label }">
                <span class="text-truncate overflow-hidden">
                  {{ label }}
                </span>
              </template>
            </v-select>
          </div>
        </b-col>
      </b-row>
    </div>
    <b-table
      ref="refInvoiceListTable"
      :items="fetchInvoices"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

      <!-- 
      <template #head(invoiceStatus)>
        <feather-icon
          icon="TrendingUpIcon"
          class="mx-auto"
        />
      </template> -->

      <!-- Column: Id -->
      <!-- <template #cell(id)="data">
        <b-link
          :to="{ name: 'apps-invoice-preview', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
          #{{ data.value }}
        </b-link>
      </template> -->

      <!-- Column: Invoice Status -->
      <!-- <template #cell(invoiceStatus)="data">
        <b-avatar
          :id="`invoice-row-${data.item.id}`"
          size="32"
          :variant="`light-${resolveInvoiceStatusVariantAndIcon(data.item.invoiceStatus).variant}`"
        >
          <feather-icon
            :icon="resolveInvoiceStatusVariantAndIcon(data.item.invoiceStatus).icon"
          />
        </b-avatar>
        <b-tooltip
          :target="`invoice-row-${data.item.id}`"
          placement="top"
        >
          <p class="mb-0">
            {{ data.item.diet_name }}
          </p>
          <p class="mb-0">
            Balance: {{ data.item.balance }}
          </p>
          <p class="mb-0">
            Due Date: {{ data.item.dueDate }}
          </p>
        </b-tooltip>
      </template> -->

      <!-- Column: Client -->
      <!-- <template #cell(client)="data">
        <b-media vertical-align="center">
          <template #aside>
            <b-avatar
              size="32"
              :src="data.item.avatar"
              :text="avatarText(data.item.client.name)"
              :variant="`light-${resolveClientAvatarVariant(data.item.invoiceStatus)}`"
            />
          </template>
          <span class="font-weight-bold d-block text-nowrap">
            {{ data.item.client.name }}
          </span>
          <small class="text-muted">{{ data.item.client.companyEmail }}</small>
        </b-media>
      </template> -->

      <!-- Column: Issued Date -->
      <!-- <template #cell(issuedDate)="data">
        <span class="text-nowrap">
          {{ data.value }}
        </span>
      </template> -->

      <!-- Column: Balance -->
      <!-- <template #cell(balance)="data">
        <template v-if="data.value === 0">
          <b-badge
            pill
            variant="light-success"
          >
            Paid
          </b-badge>
        </template>
        <template v-else>
          {{ data.value }}
        </template>
      </template> -->

      <!-- Column: Actions -->
      <template #cell(actions)="data">
        <div class="text-nowrap">
          <feather-icon
            :id="`invoice-row-${data.item.id}-preview-icon`"
            icon="EyeIcon"
            size="16"
            class="mx-1"
            @click="
              $router.push({
                name: 'workout-edit',
                params: { id: data.item.id },
              })
            "
          />
          <b-tooltip
            title="Preview Workout"
            :target="`invoice-row-${data.item.id}-preview-icon`"
          />

          <!-- Dropdown -->
          <b-dropdown
            variant="link"
            toggle-class="p-0"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>

            <b-dropdown-item
              :to="{ name: 'workout-edit', params: { id: data.item.id } }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
            <b-dropdown-item @click="confirmText(data.item.id)">
              <feather-icon
                @click="confirmText(data.item.id)"
                icon="TrashIcon"
              />
              <span
                @click="confirmText(data.item.id)"
                class="align-middle ml-50"
                >Delete</span
              >
            </b-dropdown-item>
          </b-dropdown>
        </div>
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
            :total-rows="totalInvoices"
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

    <b-modal
      id="idk2"
      size="lg"
      title="Create New Workout"
      hide-footer
      v-model="CreateNewMealModal"
      scrollable:false
    >
      <div>
        <div class="demo-vertical-spacing">
          <b-input-group prepend="Title">
            <b-form-input
              v-model="createWorkout.title"
              required
              placeholder="Your Workout title..."
            />
          </b-input-group>

          <b-input-group prepend="Workout Description">
            <b-form-textarea v-model="createWorkout.description" />
          </b-input-group>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
            block
            @click="sendCreateMeal()"
            >Save</b-button
          >
        </div>
      </div>
    </b-modal>

    <b-modal
      id="idk"
      size="lg"
      title="Assigning diet to the customer"
      hide-footer
      v-model="modalShow"
      scrollable:true
    >
      <b-card no-body class="card-employee-task">
        <b-card-body>
          <div
            v-for="(employee, index) in AssignedClientsList"
            :key="index"
            class="
              employee-task
              d-flex
              justify-content-between
              align-items-center
            "
          >
            <b-media no-body>
              <b-media-aside class="mr-75">
                <b-avatar rounded size="42" :src="employee.avatar" />
              </b-media-aside>
              <b-media-body class="my-auto">
                <h6 class="mb-0">
                  {{ employee.fullname }}
                </h6>
                <small>Degesination</small>
              </b-media-body>
            </b-media>
            <div class="d-flex align-items-center">
              <b-form-checkbox
                v-model="selected"
                :value="employee.id"
                class="custom-control-primary"
              >
              </b-form-checkbox>
            </div>
          </div>
        </b-card-body>
        {{ selected }}
      </b-card>

      <b-button
        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
        variant="outline-danger"
        block
        @click="$bvModal.hide('idk')"
        >Close Me</b-button
      >
      <br />
      <b-button
        v-if="selected"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
        block
        @click="$bvModal.hide('idk')"
      >
        <div v-if="isLoading">
          <b-spinner small />
          <span class="sr-only">Loading...</span>
        </div>
        <div v-else>Save</div>
      </b-button>
    </b-modal>
  </b-card>
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
  BTooltip,
  BModal,
  VBModal,
  BMediaBody,
  BCardBody,
  BMediaAside,
  BFormCheckbox,
  BInputGroupPrepend,
  BInputGroupAppend,
  BInputGroup,
  BFormTextarea,
  BSpinner,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import vSelect from "vue-select";
import { onUnmounted } from "@vue/composition-api";
import store from "@/store";
import useWorkoutList from "./useWorkoutList";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";

import workoutStoreModule from "./workoutStoreModule";
// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BInputGroupPrepend,
    BFormTextarea,
    BInputGroupAppend,
    BInputGroup,
    BCard,
    BCardBody,
    BModal,
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
    BMediaBody,
    BPagination,
    BTooltip,
    VBModal,
    vSelect,
    BMediaAside,
    BFormCheckbox,
    BSpinner,
  },

  data() {
    return {
      modalShow: false,
      selected: null,
      CreateNewMealModal: false,
      createWorkout: {
        title: "",
        description: "",
      },
      isLoading: false,
    };
  },

  methods: {
    confirmText(id) {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store
            .dispatch("app-workout/deleteWorkout", id)
            .then((response) => {
              console.log(response)
              console.log(
                "DIET DELETE RESPONSE",
                response.data.data.delete_Fitness_workout_by_pk
              );
              // totalInvoices.value = total
            })
            .then(
              this.$swal({
                icon: "success",
                title: "Deleted!",
                text: "Your file has been deleted.",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              })
            );
          this.refetchData();
        }
      });
    },

    modalContent() {
      this.modalShow = true;
      this.fetchAssignedClients();
    },

    sendCreateMeal() {
      this.isLoading = true;
      console.log(this.createMeal);
      if (
        this.createWorkout.title === "" ||
        this.createWorkout.description === ""
      ) {
        this.isLoading = false;
        return this.$toast({
          component: ToastificationContent,
          props: {
            title: "Please enter the workout name and description",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      } else {
        store
          .dispatch("app-workout/createWorkout", {
            workoutdata: this.createWorkout,
          })
          .then((response) => {
            this.isLoading = false;
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Success",
                icon: "BellIcon",
                variant: "success",
              },
            });
            this.$bvModal.hide("idk2");
            this.refetchData();

            // totalInvoices.value = total
          })
          .catch((error) => {
            this.isLoading = false;
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Sorry!",
                variant: "danger",
                text: `${error}`,
              },
            });
          });
      }
    },
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },

  setup() {
    const toast = useToast();

    const TODO_APP_STORE_MODULE_NAME = "app-workout";

    const AssignedClientsList = ref({});

    // Register module
    if (!store.hasModule(TODO_APP_STORE_MODULE_NAME))
      store.registerModule(TODO_APP_STORE_MODULE_NAME, workoutStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TODO_APP_STORE_MODULE_NAME))
        store.unregisterModule(TODO_APP_STORE_MODULE_NAME);
    });

    const statusOptions = ["Vegetarian", "NonVegetarian", "Vegan"];

    const fetchAssignedClients = (taskData) => {
      store
        .dispatch("app-workout/fetchAssignedClients")
        .then((response) => {
          console.log("RESPONSE MANUALLs", response.data.data.Fitness_User);
          AssignedClientsList.value = response.data.data.Fitness_User;
          // totalInvoices.value = total
        })
        .catch((error) => {
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

    const {
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

      refetchData,

      resolveInvoiceStatusVariantAndIcon,
      resolveClientAvatarVariant,
    } = useWorkoutList();

    return {
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
      fetchAssignedClients,
      statusFilter,

      refetchData,

      statusOptions,

      avatarText,
      resolveInvoiceStatusVariantAndIcon,
      resolveClientAvatarVariant,
      AssignedClientsList,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
