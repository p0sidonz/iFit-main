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
            @click="CreateNewPackageModal = !CreateNewPackageModal"
          >
            Create New Package
          </b-button>
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
      empty-text="No packages..."
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

      <template #cell(id)="data">
        {{ data.index + 1 }}
      </template>

      <template #cell(status)="data">
        <b-badge
          pill
          :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
          class="text-capitalize"
        >
          {{ data.item.status }}
        </b-badge>
      </template>
      <template #cell(created_at)="data">
        {{ data.item.created_at | moment("MMMM Do YYYY") }}
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
            @click="previewModalContent(data.item.id)"
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

            <b-dropdown-item @click="editPackage(data.item.id)">
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
      title="Create New Package"
      hide-footer
      v-model="CreateNewPackageModal"
      scrollable:false
    >
      <div>
        <div>
          <div class="demo-vertical-spacing">
            <b-form-group
              label="Title"
              label-for="blog-edit-title"
              required
              class="mb-2"
            >
              <b-form-input
                v-model="createPackage.title"
                id="blog-edit-title"
              />
            </b-form-group>

            <b-form-group
              label="Package description"
              label-for="blog-content"
              class="mb-2"
            >
              <quill-editor
                v-model="createPackage.description"
                :options="editorOption"
              >
                <div id="toolbar" slot="toolbar">
                  <!-- Add a bold button -->
                  <button class="ql-bold">Bold</button>
                  <button class="ql-italic">Italic</button>

                  <!-- Add font size dropdown -->
                  <select class="ql-size">
                    <option value="small" />
                    <!-- Note a missing, thus falsy value, is used to reset to default -->
                    <option selected />
                    <option value="large" />
                    <option value="huge" />
                  </select>

                  <select class="ql-font">
                    <option selected="selected" />
                    <option value="serif" />
                    <option value="monospace" />
                  </select>
                </div>
              </quill-editor>
            </b-form-group>
            <b-row>
              <b-col md="4">
                <b-form-group
                  label="Status"
                  label-for="status-package"
                  class="mb-2"
                >
                  <v-select
                    id="status-package"
                    v-model="createPackage.status"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="statusOption"
                  />
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  label="Days (Max. 365)"
                  label-for="sb-wrap"
                  class="mb-2"
                >
                  <b-form-spinbutton
                    v-model="createPackage.days"
                    id="sb-wrap"
                    wrap
                    min="1"
                    max="365"
                    placeholder="--"
                  />
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group
                  label="Currency"
                  label-for="currency"
                  class="mb-2"
                >
                  <v-select
                    id="status-package"
                    v-model="createPackage.currency"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="currencyOption"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group
              label="Package Amount"
              label-for="pkk2g"
              required
              class="mb-2"
            >
              <cleave
                id="pkk2g"
                v-model.number="createPackage.amount"
                class="form-control"
                :raw="false"
                placeholder="10,000"
                :options="number"
              />
            </b-form-group>

            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
              block
              @click="sendCreateMeal()"
            >
              <div v-if="isLoading">
                <b-spinner small />
                <span class="sr-only">Loading...</span>
              </div>
              <div v-else>Create Package</div>
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      id="previewPackage"
      size="lg"
      title="Previewing package"
      hide-footer
      centered
      v-model="showPreviewModal"
      scrollable:true
    >
      <div v-if="previewSingleDiet.value">
        <b-card class="card-apply-job">
          <b-card-header class="pb-1">
            <b-media no-body>
              <b-media-aside class="mr-1">
                <b-avatar
                  size="42"
                  :src="previewSingleDiet.value.User.avatar"
                />
              </b-media-aside>
              <b-media-body>
                <h5 class="mb-0">
                  {{ previewSingleDiet.value.User.fullname }}
                </h5>
                <small class="text-muted">
                  <span>{{
                    previewSingleDiet.value.created_at | moment("MMMM Do YYYY")
                  }}</span>
                </small>
              </b-media-body>
            </b-media>
          </b-card-header>
          <b-card-body>
            <h5 class="apply-job-title">
              {{ previewSingleDiet.value.title }}
            </h5>
            <b-card-text class="mb-2">
              <div
                class="blog-content"
                v-html="previewSingleDiet.value.description"
              />
            </b-card-text>

            <!-- payment  -->
            <div class="apply-job-package bg-light-primary rounded">
              <div>
                <sup class="text-body">
                  <small
                    v-if="previewSingleDiet.value.currency === '$ US Dollar'"
                    >$</small
                  >
                  <small v-if="previewSingleDiet.value.currency === '₹ INR'"
                    >₹</small
                  >
                </sup>
                <h2 class="d-inline mr-25">
                  {{ previewSingleDiet.value.amount }}
                </h2>
                <sub class="text-body"
                  ><small
                    >/
                    {{ previewSingleDiet.value.subscription_days }} days</small
                  ></sub
                >
              </div>
            </div>
            <!--/ payment  -->
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              block
              variant="primary"
            >
              Apply For This Package
            </b-button>
          </b-card-body>
        </b-card>
      </div>
      <!-- <div  v-if="previewSingleDiet.value">
        <div class="d-flex justify-content-center"> <h3>{{ previewSingleDiet.value.title }}</h3></div>

        <div
        
          class="blog-content"
          v-html="previewSingleDiet.value.description"
        />
      </div> -->
      <!-- user commnets -->
    </b-modal>

    <b-modal
      id="showEditModal"
      size="lg"
      title="Edit package"
      hide-footer
      centered
      v-model="showEditModal"
      scrollable:true
    >
      <div v-if="isLoading">
        <div class="text-center">
          <b-spinner variant="primary" label="Loading..." />
        </div>
      </div>

      <div v-if="!isLoading">
        <div v-if="editPackageContent">
          <div class="demo-vertical-spacing">
            <b-form-group
              label="Title"
              label-for="blog-edit-title"
              required
              class="mb-2"
            >
              <b-form-input
                v-model="editPackageContent.title"
                id="blog-edit-title"
              />
            </b-form-group>

            <b-form-group
              label="Package description"
              label-for="blog-content"
              class="mb-2"
            >
              <quill-editor
                v-model="editPackageContent.description"
                :options="editorOption"
              >
                <div id="toolbar" slot="toolbar">
                  <!-- Add a bold button -->
                  <button class="ql-bold">Bold</button>
                  <button class="ql-italic">Italic</button>

                  <!-- Add font size dropdown -->
                  <select class="ql-size">
                    <option value="small" />
                    <!-- Note a missing, thus falsy value, is used to reset to default -->
                    <option selected />
                    <option value="large" />
                    <option value="huge" />
                  </select>

                  <select class="ql-font">
                    <option selected="selected" />
                    <option value="serif" />
                    <option value="monospace" />
                  </select>
                </div>
              </quill-editor>
            </b-form-group>
            <b-row>
              <b-col md="4">
                <b-form-group
                  label="Status"
                  label-for="status-package"
                  class="mb-2"
                >
                  <v-select
                    id="status-package"
                    v-model="editPackageContent.status"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="statusOption"
                  />
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  label="Days (Max. 365)"
                  label-for="sb-wrap"
                  class="mb-2"
                >
                  <b-form-spinbutton
                    v-model="editPackageContent.subscription_days"
                    id="sb-wrap"
                    wrap
                    min="1"
                    max="365"
                    placeholder="--"
                  />
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group
                  label="Currency"
                  label-for="currency"
                  class="mb-2"
                >
                  <v-select
                    id="status-package"
                    v-model="editPackageContent.currency"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="currencyOption"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group
              label="Package Amount"
              label-for="package-amount"
              required
              class="mb-2"
            >
              <cleave
                id="bpackage-amount"
                v-model="editPackageContent.amount"
                class="form-control"
                :raw="false"
                :options="number"
                placeholder="10,000"
              />
            </b-form-group>

            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
              block
              @click="updatePackage(editPackageContent.id)"
              >Update Package</b-button
            >
          </div>
        </div>
      </div>
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
  BFormGroup,
  BFormSpinbutton,
  BCardText,
  BCardHeader,
  BSpinner,
} from "bootstrap-vue";
import Cleave from "vue-cleave-component";

import "quill/dist/quill.core.css";
// eslint-disable-next-line
import "quill/dist/quill.snow.css";
// eslint-disable-next-line
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import { avatarText } from "@core/utils/filter";
import vSelect from "vue-select";
import { onUnmounted } from "@vue/composition-api";
import store from "@/store";
import usePackagesList from "./usePackagesList";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";

import packagesStoreModule from "./packagesStoreModule.js";
// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCardHeader,
    BCardText,
    Cleave,
    BFormGroup,
    quillEditor,
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
    BFormSpinbutton,
    BSpinner,
  },

  data() {
    return {
      isLoading: false,
      showEditModal: false,
      editPackageContent: {},
      showPreviewModal: false,
      modalShow: false,
      selected: null,
      CreateNewPackageModal: false,
      number: {
        numeral: true,
      },

      createPackage: {
        title: "",
        description: "",
        status: "",
        days: 0,
        amount: null,
        currency: null,
      },
      categoryOption: ["Fashion", "Food", "Gaming", "Quote", "Video"],
      statusOption: ["Inactive", "Active"],
      currencyOption: ["₹ INR", "$ US Dollar"],
      editorOption: {
        modules: {
          toolbar: "#toolbar",
        },
      },
    };
  },

  methods: {
    async updatePackage(id) {
      await store
        .dispatch("app-packages/updatePackage", {
          id: id,
          data: this.editPackageContent,
        })
        .then((response) => {
          if (response.data.data.update_Fitness_trainer_package_by_pk) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Success",
                icon: "BellIcon",
                variant: "success",
              },
            });
            this.showEditModal = false;
            this.refetchData();
          }
        })
        .catch((error) => {
          console.log(error)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              variant: "danger",
            },
          });
        });
    },

    async editPackage(id) {
      await store
        .dispatch("app-packages/editPackage", id)
        .then((response) => {
          if (response.data.data.Fitness_trainer_package_by_pk) {
            this.editPackageContent =
              response.data.data.Fitness_trainer_package_by_pk;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.showEditModal = true;
      this.refetchData();
    },

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
            .dispatch("app-todo/deleteDiet", id)
            .then((response) => {
              console.log(
                "DIET DELETE RESPONSE",
                response.data.data.delete_Fitness_Diet_by_pk
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

    async previewModalContent(id) {
      this.previewSingleDiet.value = null;
      await store
        .dispatch("app-packages/previewProgram", id)
        .then((response) => {
          if (response.data.data.Fitness_trainer_package_by_pk) {
            this.previewSingleDiet.value =
              response.data.data.Fitness_trainer_package_by_pk;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.showPreviewModal = true;
    },

    sendCreateMeal() {
      this.isLoading = true;
      console.log("hehehe");
      if (
        this.createPackage.title === "" ||
        this.createPackage.description === ""
      ) {
        return this.$toast({
          component: ToastificationContent,
          props: {
            title: "Please fill all the details",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      }
      if (this.createPackage.days < 28) {
        return this.$toast({
          component: ToastificationContent,
          props: {
            title: "Subscription Days should be greater than 28",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      }
      if (
        this.createPackage.currency === "₹ INR" &&
        this.createPackage.amount < 150
      ) {
        return this.$toast({
          component: ToastificationContent,
          props: {
            title: "INR price should be greater then 150",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      }

      if (
        this.createPackage.currency === "$ US Dollar" &&
        this.createPackage.amount < 3
      ) {
        return this.$toast({
          component: ToastificationContent,
          props: {
            title: "USD price should be greater then 3",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      } else {
        store
          .dispatch("app-packages/createProgram", this.createPackage)
          .then((response) => {
            if (response.data.data.insert_Fitness_trainer_package_one.id) {
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
            }
            // totalInvoices.value = total
          })
          .catch((error) => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Sorry",
                icon: "BellIcon",
                variant: "danger",
                text: `${error}`,
              },
            });
          });
        this.refetchData();
      }
    },
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },

  setup() {
    const toast = useToast();

    const TODO_APP_STORE_MODULE_NAME = "app-packages";

    const fetchPackagesList = ref({});
    const previewSingleDiet = ref({});
    // Register module
    if (!store.hasModule(TODO_APP_STORE_MODULE_NAME))
      store.registerModule(TODO_APP_STORE_MODULE_NAME, packagesStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TODO_APP_STORE_MODULE_NAME))
        store.unregisterModule(TODO_APP_STORE_MODULE_NAME);
    });

    const fetchPackages = (taskData) => {
      store
        .dispatch("app-packages/fetchPackages")
        .then((response) => {
          console.log("RESPONSE MANUALLs", response.data.data.Fitness_User);
          fetchPackagesList.value = response.data.data.Fitness_User;
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

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ];

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
    } = usePackagesList();

    const resolveUserStatusVariant = (status) => {
      if (status === "pending") return "warning";
      if (status === "Active") return "success";
      if (status === "Inactive") return "danger";
      return "primary";
    };

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
      fetchPackages,
      statusFilter,

      refetchData,

      statusOptions,

      avatarText,
      resolveInvoiceStatusVariantAndIcon,
      resolveClientAvatarVariant,
      fetchPackagesList,
      resolveUserStatusVariant,
      previewSingleDiet,
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
@import "@core/scss/vue/pages/page-blog.scss";
</style>
