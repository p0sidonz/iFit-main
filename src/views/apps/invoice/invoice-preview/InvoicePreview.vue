<template>
  <section class="invoice-preview-wrapper">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="tasks === undefined">
      <h4 class="alert-heading">Error fetching invoice data</h4>
      <div class="alert-body">
        No invoice found with this invoice id. Check
        <b-link class="alert-link" :to="{ name: 'apps-invoice-list' }">
          Invoice List
        </b-link>
        for other invoices.
      </div>
    </b-alert>

    <b-row v-if="tasks" class="invoice-preview">
      <b-row cols="12">
        <b-col cols="12">
          <section id="diet">
            <b-card
              no-body
              class="diet"
              :style="{
                backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
              }"
            >
              <b-card-header>
                <b-card-title></b-card-title>

                <b-dropdown variant="link" no-caret right toggle-class="p-0">
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                  </template>

                  <b-dropdown-item href="#" @click="addTask(tasks.id)">
                    <feather-icon
                      icon="PlusIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                    Add New Meal
                  </b-dropdown-item>

                  <b-dropdown-item href="#">
                    <feather-icon
                      icon="EditIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                    Edit Meal
                  </b-dropdown-item>
                  <b-dropdown-item href="#">
                    <feather-icon
                      icon="XIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                    Delete Meal
                  </b-dropdown-item>
                </b-dropdown>
              </b-card-header>

              <b-card-body class="text-center">
                <h2 class="text-primary">
                  {{ tasks.diet_name }}
                </h2>
                <b-card-text class="mb-2">
                  {{ tasks.diet_description }}
                </b-card-text>
              </b-card-body>
            </b-card>

            <macros
              v-if="tasks"
              :macronutrients="tasks"
              @update-macronutrient="updateMicronutrient"
            >
            </macros>

            <b-card-actions
              v-for="data in tasks.meals"
              :key="data.index"
              action-collapse
              action-close
              class="text-primary"
              @close="removeMeal(data.id)"
              :title="data.meal_title.toUpperCase()"
            >
              <!-- <b-card-title class="mt-1 mb-75">
                {{ data.meal_title.toUpperCase() }}

      </b-card-title> -->

              <b-row>
                <!-- User Info: Left col -->
                <b-col
                  cols="21"
                  xl="12"
                  class="d-flex justify-content-between flex-column"
                >
                  <!-- User Avatar & Action Buttons -->
                  <b-table
                    responsive
                    :items="data.FoodLists"
                    :fields="fields"
                    v-model="visibleRows"
                    class="mb-0"
                  >
                    <!-- Optional default data cell scoped slot -->
                    <template #cell(action)="data">
                      <b-dropdown
                        variant="link"
                        toggle-class="text-decoration-none"
                        no-caret
                      >
                        <template v-slot:button-content>
                          <feather-icon
                            icon="MoreVerticalIcon"
                            size="16"
                            class="text-body align-middle mr-25"
                          />
                        </template>
                        <b-dropdown-item @click="handleTaskClick(data.item)">
                          <feather-icon icon="Edit2Icon" class="mr-50" />
                          <span>Edit</span>
                        </b-dropdown-item>
                        <b-dropdown-item
                          @click="removeSingleFood(data.item.id)"
                        >
                          <feather-icon icon="TrashIcon" class="mr-50" />
                          <span>Delete</span>
                        </b-dropdown-item>
                      </b-dropdown>
                    </template>
                  </b-table>
                  <b-card-footer> </b-card-footer>
                  <b-button
                    variant="outline-primary"
                    @click="addFood(data.id)"
                    :task="data"
                  >
                    Add Food
                  </b-button>

                  <!-- User Stats -->
                </b-col>
              </b-row>
            </b-card-actions>
          </section>
        </b-col>
      </b-row>

      <!-- Right Col: Card -->
    </b-row>

    <!-- <invoice-sidebar-send-invoice />
    <invoice-sidebar-add-payment /> -->
  </section>
</template>

<script>
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import router from "@/router";
import {
  BCol,
  BCardBody,
  BTableLite,
  BAlert,
  VBToggle,
  BFormInput,
  BInputGroup,
  BInputGroupPrepend,
  BDropdown,
  BDropdownItem,
  BFormCheckbox,
  BLink,
  BCardHeader,
  BCard,
  BImg,
  BButton,
  BRow,
  BTable,
  BCardText,
  BCardTitle,
  BBadge,
  BCardFooter,
      BAvatar,

} from "bootstrap-vue";
import Logo from "@core/layouts/components/Logo.vue";
import Ripple from "vue-ripple-directive";
import invoiceStoreModule from "../invoiceStoreModule";
import InvoiceSidebarSendInvoice from "../InvoiceSidebarSendInvoice.vue";
import InvoiceSidebarAddPayment from "../InvoiceSidebarAddPayment.vue";

export default {
  directives: {
    Ripple,
    "b-toggle": VBToggle,
  },
  components: {
    BRow,
    BCard,
    BCardBody,
    BTableLite,
    BAlert,
    BLink,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BAvatar,
    BAlert,
    BCardHeader,
    BCard,
    BImg,
    BButton,
    BCol,
    BTable,
    BCardText,
    BCardTitle,
    BBadge,
    BCardFooter,
    Logo,
    InvoiceSidebarAddPayment,
    InvoiceSidebarSendInvoice,
  },
  setup() {
    const tasks = ref(null);
    const paymentDetails = ref({});

    // Invoice Description
    // ? Your real data will contain this information
    const invoiceDescription = [
      {
        taskTitle: "Native App Development",
        taskDescription:
          "Developed a full stack native app using React Native, Bootstrap & Python",
        rate: "$60.00",
        hours: "30",
        total: "$1,800.00",
      },
      {
        taskTitle: "UI Kit Design",
        taskDescription:
          "Designed a UI kit for native app using Sketch, Figma & Adobe XD",
        rate: "$60.00",
        hours: "20",
        total: "$1200.00",
      },
    ];

    const INVOICE_APP_STORE_MODULE_NAME = "app-invoice";

    // Register module
    if (!store.hasModule(INVOICE_APP_STORE_MODULE_NAME))
      store.registerModule(INVOICE_APP_STORE_MODULE_NAME, invoiceStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(INVOICE_APP_STORE_MODULE_NAME))
        store.unregisterModule(INVOICE_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-invoice/fetchInvoice", {
        id: router.currentRoute.params.id,
      })
      .then((response) => {
        tasks.value = response.data.data.Fitness_Diet_by_pk;
        // paymentDetails.value = response.data.paymentDetails
      })
      .catch((error) => {
        console.log(error);
      });

    const printInvoice = () => {
      window.print();
    };

    return {
      tasks,
      paymentDetails,
      invoiceDescription,
      printInvoice,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
</style>

<style lang="scss">
@media print {
  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // Invoice Specific Styles
  .invoice-preview-wrapper {
    .row.invoice-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .invoice-preview-card {
        .card-body:nth-of-type(2) {
          .row {
            > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .invoice-actions {
      display: none;
    }
  }
}
</style>
