<template>
  <div>
    <section v-if="Object.keys(pricing).length" id="pricing-plan">
      <!-- title text and switch button -->
      <div class="text-center">
        <h1 class="mt-5">Pricing Plans</h1>
        <b-badge variant="primary" class="badge-glow">
          🤑 Launching OFFER <br />
          50% FLAT OFF ON ALL THE PLANS 🤑
        </b-badge>
        <br />
        <br />
        <br />
        <p class="mb-4 pb-75">
          We don't take this much rest while working out So Why now? The prices
          are simple and straightforward, Select the package and serve your
          clients.
        </p>

        <div
          class="d-flex align-items-center justify-content-center mb-5 pb-50"
        >
          <h6 class="mr-1 mb-0">₹INR</h6>

          <b-form-checkbox
            :checked="showDollarPrice"
            name="check-button"
            switch
            inline
            @input="toggleCurrency"
          >
          </b-form-checkbox>

          <h6 class="ml-50 mb-0">$USD</h6>
        </div>
      </div>
      <!--/ title text and switch button -->
      <!-- pricing plan cards -->

      <b-row class="pricing-card">
        <b-col
          offset-sm-2
          sm="10"
          md="12"
          offset-lg="2"
          lg="10"
          class="mx-auto"
        >
          <b-row>
            <b-col md="4">
              <b-card align="center">
                <div class="pricing-badge text-right"></div>

                <!-- img -->
                <b-img
                  v-if="pricing.basicPlan.img"
                  :src="pricing.basicPlan.img"
                  class="mb-2 mt-5"
                  alt="basic svg img"
                />
                <!--/ img -->
                <h3>{{ pricing.basicPlan.title }}</h3>
                <b-card-text>
                  {{ pricing.basicPlan.subtitle }}
                </b-card-text>

                <!-- annual plan -->
                <div class="annual-plan">
                  <div class="plan-price mt-2">
                    <sup class="font-medium-1 font-weight-bold text-primary">
                      {{ showDollarPrice ? "$" : "₹" }}</sup
                    >
                    <span
                      v-if="!showDollarPrice"
                      class="
                        pricing-basic-value
                        font-weight-bolder
                        text-primary
                      "
                      >{{
                        monthlyPlanShow
                          ? pricing.basicPlan.monthlyPrice
                          : pricing.basicPlan.yearlyPlan.perMonth
                      }}</span
                    >
                    <span
                      v-else
                      class="
                        pricing-basic-value
                        font-weight-bolder
                        text-primary
                      "
                      >{{ pricing.basicPlan.dollar_price }}</span
                    >

                    <sub
                      class="
                        pricing-duration
                        text-body
                        font-medium-1 font-weight-bold
                      "
                      >/month</sub
                    >
                  </div>

                  <small
                    class="
                      annual-pricing
                      text-muted text-decoration-line-through
                    "
                  >
                    <del v-if="!showDollarPrice">
                      ₹ {{ pricing.basicPlan.monthlyPrice * 2 }} / month</del
                    >
                    <del v-else>
                      ₹ {{ pricing.basicPlan.dollar_price * 2 }} / month</del
                    >
                  </small>
                </div>
                <!--/ annual plan -->

                <!-- plan benefit -->
                <b-list-group class="list-group-circle text-left">
                  <b-list-group-item
                    v-for="(data, index) in pricing.basicPlan.planBenefits"
                    :key="index"
                  >
                    {{ data }}
                  </b-list-group-item>
                </b-list-group>
                <!--/ plan benefit -->

                <!-- buttons -->
                <b-button
                  v-ripple.400="'rgba(40, 199, 111, 0.15)'"
                  block
                  class="mt-2"
                  variant="primary"
                  @click="
                    modelswitch(
                      pricing.basicPlan.title,
                      pricing.basicPlan.id,
                      pricing.basicPlan.subtitle
                    )
                  "
                >
                  Buy
                </b-button>
              </b-card>
            </b-col>
            <b-col md="4">
              <b-card class="popular" align="center">
                <div
                  v-show="pricing.enterprisePlan.popular"
                  class="pricing-badge text-right"
                >
                  <b-badge variant="light-primary" pill> Popular </b-badge>
                </div>
                <!-- img -->
                <b-img
                  v-if="pricing.enterprisePlan.img"
                  :src="pricing.enterprisePlan.img"
                  class="mb-1"
                  alt="standardPlan"
                />
                <!--/ img -->
                <h3>{{ pricing.enterprisePlan.title }}</h3>
                <b-card-text>{{ pricing.enterprisePlan.subtitle }}</b-card-text>

                <!-- annual plan -->
                <div class="annual-plan">
                  <div class="plan-price mt-2">
                    <sup class="font-medium-1 font-weight-bold text-primary">{{
                      showDollarPrice ? "$" : "₹"
                    }}</sup>
                    <span
                      v-if="!showDollarPrice"
                      class="
                        pricing-basic-value
                        font-weight-bolder
                        text-primary
                      "
                      >{{
                        !pricing.enterprisePlan.isYearlyPlan
                          ? pricing.enterprisePlan.yearlyPrice
                          : "NaN"
                      }}</span
                    >

                    <span
                      v-else
                      class="
                        pricing-basic-value
                        font-weight-bolder
                        text-primary
                      "
                      >{{ pricing.enterprisePlan.dollar_price }}</span
                    >

                    <sub
                      class="
                        pricing-duration
                        text-body
                        font-medium-1 font-weight-bold
                      "
                      >/month<br />
                      (Billed Annually)</sub
                    >
                  </div>
                  <small
                    class="
                      annual-pricing
                      text-muted text-decoration-line-through
                    "
                  >
                    <del v-if="!showDollarPrice">
                      ₹ {{ pricing.enterprisePlan.yearlyPrice * 2 }} /
                      month</del
                    >
                    <del v-else>
                      $ {{ pricing.enterprisePlan.dollar_price * 2 }} /
                      month</del
                    >
                  </small>
                </div>
                <!--/ annual plan -->

                <!-- plan benefit -->
                <b-list-group
                  v-for="(data, index) in pricing.enterprisePlan.planBenefits"
                  :key="index"
                  class="list-group-circle text-left"
                >
                  <b-list-group-item>
                    {{ data }}
                  </b-list-group-item>
                </b-list-group>
                <!--/ plan benefit -->

                <!-- buttons -->
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  block
                  class="mt-2"
                  variant="primary"
                  @click="
                    modelswitch(
                      pricing.enterprisePlan.title,
                      pricing.enterprisePlan.id,
                      pricing.enterprisePlan.subtitle
                    )
                  "
                >
                  Buy
                </b-button>
              </b-card>
            </b-col>
            <b-col md="4">
              <b-card align="center">
                <div
                  v-show="pricing.standardPlan.popular"
                  class="pricing-badge text-right"
                >
                  <b-badge variant="light-primary" pill> Popular </b-badge>
                </div>
                <!-- img -->
                <b-img
                  v-if="pricing.standardPlan.img"
                  :src="
                    pricing.standardPlan.img ||
                    'https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/demo-1/img/Pot2.527b9edc.svg'
                  "
                  class="mb-1"
                  alt="standardPlan"
                />
                <!--/ img -->
                <h3>{{ pricing.standardPlan.title }}</h3>
                <b-card-text>{{ pricing.standardPlan.subtitle }}</b-card-text>

                <!-- annual plan -->
                <div class="annual-plan">
                  <div class="plan-price mt-2">
                    <sup class="font-medium-1 font-weight-bold text-primary">{{
                      showDollarPrice ? "$" : "₹"
                    }}</sup>
                    <span
                      v-if="!showDollarPrice"
                      class="
                        pricing-basic-value
                        font-weight-bolder
                        text-primary
                      "
                      >{{
                        monthlyPlanShow
                          ? pricing.standardPlan.monthlyPrice
                          : pricing.standardPlan.yearlyPlan.perMonth
                      }}</span
                    >

                    <span
                      v-else
                      class="
                        pricing-basic-value
                        font-weight-bolder
                        text-primary
                      "
                      >{{ pricing.standardPlan.dollar_price }}</span
                    >

                    <sub
                      class="
                        pricing-duration
                        text-body
                        font-medium-1 font-weight-bold
                      "
                      >/month</sub
                    >
                  </div>
                  <small
                    class="
                      annual-pricing
                      text-muted text-decoration-line-through
                    "
                  >
                    <del v-if="!showDollarPrice">
                      ₹ {{ pricing.standardPlan.monthlyPrice * 2 }} / month</del
                    >

                    <del v-else>
                      $ {{ pricing.standardPlan.dollar_price * 2 }} / month</del
                    >
                  </small>
                </div>
                <!--/ annual plan -->

                <!-- plan benefit -->
                <b-list-group class="list-group-circle text-left">
                  <b-list-group-item
                    v-for="(data, index) in pricing.standardPlan.planBenefits"
                    :key="index"
                  >
                    {{ data }}
                  </b-list-group-item>
                </b-list-group>
                <!--/ plan benefit -->

                <!-- buttons -->
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  block
                  class="mt-2"
                  variant="primary"
                  @click="
                    modelswitch(
                      pricing.standardPlan.title,
                      pricing.standardPlan.id,
                      pricing.standardPlan.subtitle
                    )
                  "
                >
                  Buy
                </b-button>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-modal
        v-model="showModal"
        size="lg"
        hide-footer
        no-close-on-backdrop
        lazy
      >
        <div v-if="!payment_done">
          <div class="modal-body px-sm-5 mx-30">
            <h1 class="text-center mb-1" id="addNewCardTitle">
              Billing Detail
            </h1>
            <!-- <p class="text-center">Add card for future billing</p> -->
          </div>

          <validation-observer v-slot="{ invalid }" ref="refFormObserver">
            <b-form class="p-2" @submit.prevent="onSubmit;">
              <b-row>
                <b-col md="3" xl="3">
                  <validation-provider
                    #default="validationContext"
                    name="First Name"
                    rules="required"
                  >
                    <b-form-group label="First Name" label-for="v-first-name">
                      <b-form-input
                        id="v-first-name"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                        placeholder="Jon"
                        v-model="billingData.firstName"
                      />

                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col md="3" xl="3">
                  <validation-provider
                    #default="validationContext"
                    name="Last Name"
                    rules="required"
                  >
                    <b-form-group label="Last Name" label-for="v-last-name">
                      <b-form-input
                        id="v-last-name"
                        placeholder="Doe"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                        v-model="billingData.lastName"
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col md="6" xl="6">
                  <validation-provider
                    #default="validationContext"
                    name="Email"
                    rules="required|email"
                  >
                    <b-form-group label="Email address" label-for="email">
                      <b-form-input
                        id="email"
                        placeholder="john.doe@gmail.com"
                        v-model="billingData.email"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col cols="12">
                  <validation-provider
                    #default="validationContext"
                    name="Address line"
                    rules="required"
                  >
                    <b-form-group label="Address line" label-for="v-address-1">
                      <b-form-input
                        id="v-address-1"
                        placeholder="123 New York Street"
                        v-model="billingData.address_line_1"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col cols="6">
                  <b-form-group label="Address line 2" label-for="v-address-2">
                    <b-form-input
                      id="v-address-2"
                      v-model="billingData.address_line_2"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6" xl="6">
                  <validation-provider
                    #default="validationContext"
                    name="Mobile"
                    rules="required"
                  >
                    <b-form-group label="Mobile" label-for="Mobile">
                      <b-form-input
                        id="Mobile"
                        placeholder="7000799192"
                        v-model="billingData.contact"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col md="6" xl="6">
                  <validation-provider
                    #default="validationContext"
                    name="City"
                    rules="required"
                  >
                    <b-form-group label="City" label-for="v-city">
                      <b-form-input
                        id="v-city"
                        placeholder="NY"
                        v-model="billingData.city"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col md="6" xl="6">
                  <validation-provider
                    #default="validationContext"
                    name="Zip Code"
                    rules="required"
                  >
                    <b-form-group label="Zip Code" label-for="v-zip">
                      <b-form-input
                        id="v-zip"
                        placeholder="90102"
                        v-model="billingData.zip"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col md="6" xl="6">
                  <validation-provider
                    #default="validationContext"
                    name="State"
                    rules="required"
                  >
                    <b-form-group label="State" label-for="v-state">
                      <b-form-input
                        id="v-state"
                        placeholder="New York"
                        v-model="billingData.state"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col md="6" xl="6">
                  <validation-provider
                    #default="validationContext"
                    name="Country"
                    rules="required"
                  >
                    <b-form-group label="Country" label-for="v-country">
                      <b-form-input
                        id="v-country"
                        placeholder="USA"
                        v-model="billingData.country"
                        autofocus
                        :state="getValidationState(validationContext)"
                        trim
                      />
                      <b-form-invalid-feedback>
                        {{ validationContext.errors[0] }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
            </b-form>
            <div class="d-flex justify-content-center">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="relief-primary"
                :disabled="invalid"
                @click="displayRazorPay()"
              >
                Pay
              </b-button>
            </div>
          </validation-observer>
        </div>
        <div v-else>
          <div class="modal-body px-sm-5 mx-30">
            <h1 class="text-center mb-1 text-success" id="addNewCardTitle">
              Success! 🎉
            </h1>
            <p class="text-center">
              Your order number is
              <b-badge pill variant="success">
                {{ success_order_id }}
              </b-badge>
              Keep it for future reference.
            </p>
            <p class="text-center">
              Payment reciept has been sent to your registered email. Click
              <b-badge href="/dashboard" pill variant="light-primary">
                here
              </b-badge>
              to visit the traning dashboard.
            </p>
          </div>
        </div>
      </b-modal>
      <!-- pricing plan cards -->
      <!--/ pricing faq -->
    </section>
    <section v-else>
      <b-spinner small class="mr-1" variant="primary" />
      can't fetch
    </section>
  </div>
</template>

<script>
import {
  BFormCheckbox,
  BRow,
  BCol,
  BCard,
  BImg,
  BCardText,
  BListGroup,
  BListGroupItem,
  BButton,
  BBadge,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BForm,
  BSpinner,
} from "bootstrap-vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import axios from "@axios";
import store from "@/store";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
import { required, email } from "@validations";
import { min, max, numeric } from "vee-validate/dist/rules";

import { useMutation } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "@vue/composition-api";

/* eslint-disable global-require */
export default {
  components: {
    BFormCheckbox,
    BButton,
    BCardText,
    BListGroup,
    BListGroupItem,
    BRow,
    BCol,
    BCard,
    BBadge,
    BImg,
    AppCollapseItem,
    AppCollapse,
    BFormGroup,
    BFormInput,
    ValidationObserver,
    ValidationProvider,
    BFormInvalidFeedback,
    BForm,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      status: "monthly",
      monthlyPlanShow: true,
      pricing: {},
      isCompoLoading: false,
    };
  },

  mounted() {
    console.log("mounted haha");
    // As an instance method inside a component
    this.$loadScript("https://checkout.razorpay.com/v1/checkout.js")
      .then(() => {
        console.log("RezorPay has been initiated");
      })
      .catch(() => {
        console.log("Failed to fetch script");
      });
  },
  async created() {
    this.isCompoLoading = true;
    try {
      const data = await this.$apollo.query({
        query: gql`
          query get_Upgrade_packages {
            Fitness_upgrade_packages {
              id
              title
              subtitle
              img
              monthlyPrice
              yearlyPrice
              planBenefits
              popular
              dollar_price
            }
          }
        `,
      });

      if (data.data.Fitness_upgrade_packages.length) {
        let y = {};

        let result = data.data.Fitness_upgrade_packages.map((item, index) => {
          if (item.title === "Basic") {
            y["basicPlan"] = {};
            Object.assign(y.basicPlan, item);
          }
          if (item.title === "Standard") {
            y["standardPlan"] = {};
            Object.assign(y.standardPlan, item);
          }
          if (item.title === "Standard+") {
            y["enterprisePlan"] = {};
            Object.assign(y.enterprisePlan, item);
          }
          return y;
        });

        this.pricing = result[0];
        this.isCompoLoading = false;
      }
    } catch (error) {
      this.isCompoLoading = false;

      console.log(error);
    }
  },

  methods: {
    toggleCurrency() {
      this.showDollarPrice = !this.showDollarPrice;
    },

    tooglePlan() {
      if (this.status === "monthly") {
        this.monthlyPlanShow = true;
      } else {
        this.monthlyPlanShow = false;
      }
    },
  },

  setup() {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userData);
    const current_package_id = ref();
    const current_package_name = ref();
    const current_package_description = ref();
    const payment_done = ref(false);
    const success_order_id = ref(123456);
    const showModal = ref(false);
    let elements = null;
    const showDollarPrice = ref(false);

    const displayRazorPay = async () => {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      axios
        .post(
          process.env.VUE_APP_GRAPHQL_HTTP,
          {
            query: `
          mutation MyMutation(
            $package_id: Int!
            $is_dollar: Boolean!

          ) {
            rzrCreateOrder(
              package_id: $package_id
              is_dollar: $is_dollar

            ) {
              amount
              order_id
              currency
              status
              error
            }
          }
              
              
              `,
            variables: {
              package_id: current_package_id.value,
              is_dollar: showDollarPrice.value,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: freshTocken,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data);

          var options = {
            key: process.env.VUE_APP_RZR_KEY,
            amount: response.data.data.rzrCreateOrder.amount,
            currency: response.data.data.rzrCreateOrder.currency,
            name: `Plan type: ${current_package_name.value}`,
            description: current_package_description.value,
            order_id: response.data.data.rzrCreateOrder.order_id,
            prefill: {
              name:
                billingData.value.firstName + " " + billingData.value.lastName,
              email: billingData.value.email,
              contact: billingData.value.contact,
            },
            handler: function (response) {
              payment_done.value = true;
              success_order_id.value = response.razorpay_order_id;

              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature);
            },

            notify: {
              sms: true,
              email: true,
            },
            notes: {
              packageName: current_package_name.value,
              packageId: current_package_id.value,
              userId: userData.id,
              ...billingData.value,
            },
            theme: {
              color: "#7367f0",
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const billingData = ref({
      email: "",
      firstName: "",
      lastName: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      contact: "",
    });
    const { refFormObserver, getValidationState, resetForm, clearForm } =
      formValidation();

    const modelswitch = (pkg_name, pkg_id, pkg_desc) => {
      current_package_name.value = pkg_name;
      current_package_id.value = pkg_id;
      current_package_description.value = pkg_desc;
      showModal.value = true;
    };
    // const modelswitch = async () => {
    //   showModal.value = true;
    //   stripe = await loadStripe(
    //     "pk_test_51K4fciSFyy9zHynvZLORcaM2JG8se1V8LV0cKCdzTCyLCIp71muDRop0OUeDkGQGx2rk0rNihflE0oiX2dQzS5pq00vTGx8sIu"
    //   );

    //   const ELEMENT_TYPE = "card";
    //   elements = stripe.elements();
    //   const element = elements.create(ELEMENT_TYPE);
    //   element.mount("#card-element");
    //   element.on("change", function (event) {
    //     if (event.complete) {
    //       stripeCardValid.value = true;
    //     }else {
    //       stripeCardValid.value = false;
    //     }
    //   });
    // };
    // const handleSubmit = async (event) => {
    //   if (!stripe) {
    //     return;
    //   }
    //   const cardElement = elements.getElement("card");
    //   const result = await stripe.createPaymentMethod({
    //     type: "card",
    //     card: cardElement,
    //     billing_details: {
    //       email: billingData.value.email,

    //       // name: billingData.value.firstName + " " + billingData.value.lastName,
    //       // address: {
    //       //   city: billingData.value.city,
    //       //   country: billingData.value.country,
    //       //   line1: billingData.value.address_line_1,
    //       //   line2: billingData.value.address_line_2,
    //       //   state: billingData.value.state,
    //       //   city: billingData.value.city,
    //       //   postal_code: billingData.value.zip,
    //       // },
    //     },
    //   });
    //   console.log("createPaymentMethod returned ", result);
    //   const token = localStorage.getItem("apollo-token");
    //   const freshTocken = token.replace(/['"]+/g, "");

    //   axios
    //     .post(
    //       "http://127.0.0.1:8080/v1/graphql",
    //       {
    //         query: `
    //       mutation MyMutation(
    //         $email: String!
    //         $payment_method: String!
    //         $package_id: Int!
    //         $addressDetails: subAddressInput = {
    //           address_city: ""
    //           address_country: ""
    //           address_line_1: ""
    //           address_postal_code: 0
    //           address_state: ""
    //         }
    //       ) {
    //         sub(
    //           email: $email
    //           payment_method: $payment_method
    //           package_id: $package_id
    //           addressDetails: $addressDetails
    //         ) {
    //           secret
    //           error
    //           status
    //         }
    //       }

    //           `,
    //         variables: {
    //           package_id: 1,
    //           email: "email@email.com",
    //           payment_method: result.paymentMethod.id,
    //           addressDetails: {
    //             address_city: billingData.value.city,
    //             address_country: billingData.value.country,
    //             address_line_1: billingData.value.address_line_1,
    //             address_postal_code: parseInt(billingData.value.zip),
    //             address_state: billingData.value.state,
    //           },
    //         },
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: freshTocken,
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       const client_secret = response.data.data.sub.secret;
    //       const status = response.data.data.sub.status;
    //       if (status === "requires_action") {
    //         stripe.confirmCardPayment(client_secret).then(function (result) {
    //           if (result.error) {
    //             console.log("There was an issue!");
    //             console.log(result.error);
    //             // Display error message in your UI.
    //             // The card was declined (i.e. insufficient funds, card has expired, etc)
    //           } else {
    //             console.log("You got the money!");
    //             payment_done.value = true;
    //             // Show a success message to your customer
    //           }
    //         });
    //       }
    //     })
    //     .catch((error) => console.log(error));

    //   // console.log(result)
    // };

    // function redirect() {
    //   stripe.redirectToCheckout({
    //     successUrl: "http://localhost:8081/success",
    //     cancelUrl: "http://localhost:8081/upgrade",
    //     lineItems: [
    //       {

    //         price: "price_1K4gN3SFyy9zHynvhHH7k6qT",
    //         quantity: 1,
    //       },
    //     ],
    //     mode: "subscription",
    //   });
    // }
    return {
      billingData,
      showModal,
      // handleSubmit,
      elements,
      modelswitch,
      payment_done,
      getValidationState,
      displayRazorPay,

      // stripeCardValid,

      //RazorPay
      current_package_id,
      current_package_name,
      success_order_id,
      showDollarPrice,
    };
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-pricing.scss";
</style>
