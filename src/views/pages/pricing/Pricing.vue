<template>
  <section id="pricing-plan">
    <!-- title text and switch button -->
    <div class="text-center">
      <h1 class="mt-5">Pricing Plans</h1>
      <p class="mb-2 pb-75">
        All plans include 40+ advanced tools and features to boost your product.
        Choose the best plan to fit your needs.
      </p>
      <div class="d-flex align-items-center justify-content-center mb-5 pb-50">
        <h6 class="mr-1 mb-0">Monthly</h6>
        <b-form-checkbox
          id="priceSwitch"
          v-model="status"
          name="price-switch"
          value="annually"
          unchecked-value="monthly"
          switch
          @input="tooglePlan"
        />
        <h6 class="ml-50 mb-0">Annually</h6>
      </div>
    </div>
    <!--/ title text and switch button -->

    <!-- pricing plan cards -->

    <b-row class="pricing-card">
      <b-col offset-sm-2 sm="10" md="12" offset-lg="2" lg="10" class="mx-auto">
        <b-row>
          <b-col md="4">
            <b-card align="center">
              <!-- img -->
              <b-img
                :src="`https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/demo-1/img/Pot1.f497783b.svg`"
                class="mb-2 mt-5"
                alt="basic svg img"
              />
              <!--/ img -->
              <h3>Basic</h3>
              <b-card-text> A simple start for everyone </b-card-text>

              <!-- annual plan -->
              <div class="annual-plan">
                <div class="plan-price mt-2">
                  <sup class="font-medium-1 font-weight-bold text-primary"
                    >$</sup
                  >
                  <span
                    class="pricing-basic-value font-weight-bolder text-primary"
                    >50</span
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
                  v-show="!monthlyPlanShow"
                  class="annual-pricing text-muted"
                  >USD 50 / year</small
                >
              </div>
              <!--/ annual plan -->

              <!-- plan benefit -->
              <b-list-group class="list-group-circle text-left">
                <b-list-group-item> 100 responses a month </b-list-group-item>
                <b-list-group-item> 100 responses a month </b-list-group-item>
                <b-list-group-item> 100 responses a month </b-list-group-item>
                <b-list-group-item> 100 responses a month </b-list-group-item>
                <b-list-group-item> 100 responses a month </b-list-group-item>
              </b-list-group>
              <!--/ plan benefit -->

              <!-- buttons -->
              <b-button
                v-ripple.400="'rgba(40, 199, 111, 0.15)'"
                block
                class="mt-2"
                variant="outline-success"
              >
                Your current plan
              </b-button>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <!--/ pricing plan cards -->

    <!-- pricing free trial -->
    <div class="pricing-free-trial">
      <b-row>
        <b-col lg="10" offset-lg="3" class="mx-auto">
          <div class="pricing-trial-content d-flex justify-content-between">
            <div class="text-center text-md-left mt-3">
              <h3 class="text-primary">
                Still not convinced? Start with a 14-day FREE trial!
              </h3>
              <h5>
                You will get full access to with all the features for 14 days.
              </h5>
              <b-button
                @click="upgradeToTrainer"
                v-if="!is_trainer"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mt-2 mt-lg-3"
              >
                Unlock Free Trainer Account
              </b-button>
              <b-button
                v-if="is_trainer"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="info"
                class="mt-2 mt-lg-3"
                disabled
              >
                You are already a trainer
              </b-button>
            </div>

            <!-- images -->
            <b-img
              fluid
              :src="
                require('@/assets/images/illustration/pricing-Illustration.svg')
              "
              class="pricing-trial-img"
              alt="svg img"
            />
            <!--/ images -->
          </div>
        </b-col>
      </b-row>
    </div>
    <!--/ pricing free trial -->
  </section>
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
} from "bootstrap-vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { UPGRADE_USER } from "@/queries/";

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
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      status: "monthly",
      monthlyPlanShow: true,
      pricing: {},
      is_trainer: null,
    };
  },

  async created() {
    {
      try {
        const data = await this.$apollo.query({
          query: gql`
            query me {
              Fitness_User {
                role
              }
            }
          `,
        });
        if(data.data.Fitness_User[0].role === "trainer") {
          this.is_trainer = data.data.Fitness_User[0].role;
        }
        else {
          this.is_trainer = null
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  },

  methods: {
    tooglePlan() {
      if (this.status === "monthly") {
        this.monthlyPlanShow = true;
      } else {
        this.monthlyPlanShow = false;
      }
    },

    async upgradeToTrainer() {
      try {
        const data = await this.$apollo.mutate({
          mutation: UPGRADE_USER,
          variables: {
            value: "trainer",
          },
        });
        const response = data.data.upgrade;

        if (response.ok) {
          this.$router.push({ name: "home" });

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Upgraded to Trainer!",
              icon: "EditIcon",
              variant: "success",
            },
          });
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: `${response.error}`,
              icon: "EditIcon",
              variant: "danger",
            },
          });
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Please try again",
            icon: "EditIcon",
            variant: "danger",
          },
        });
      }
    },
  },
};

/* eslint-disable global-require */
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-pricing.scss";
</style>
