<template>
  <div>
    <b-card title="Current plan">
      <hr />
      <b-card-body>
        <b-row cols="1" v-if="curr_plan === null">
          <div class="text-center">
            <b-col>
              <h5>Your Current Plan is <strong>Free</strong></h5>
              <span>
                You can
                <router-link :to="{ name: 'trainer-pricing' }"
                  >upgrade
                </router-link>
                your self as a trainer to unlock all the powerfull tools which
                will help you to serve your online clients.
              </span></b-col
            >
          </div>
        </b-row>
        <b-row cols="2" v-if="curr_plan !== null">
          <b-col>
            <div class="mb-2 pb-50">
              <h5>
                Your Current Plan is
                <strong>{{ curr_plan.package_detail.title }}</strong>
              </h5>
              <p>
                {{ curr_plan.package_detail.subtitle }}
              </p>
            </div>
            <div class="mb-2 pb-50">
              <h5>
                Active until {{ curr_plan.end_date | moment("D MMMM YYYY") }}
              </h5>
              <span>
                We will send you a notification upon Subscription expiration
              </span>
            </div>

            <div class="mb-2 pb-50">
              <h5>
                {{
                  curr_plan.package_detail.monthlyPrice
                    ? curr_plan.package_detail.monthlyPrice
                    : curr_plan.package_detail.yearlyPrice
                }}/- Per Month
                <span
                  v-if="curr_plan.package_detail.title === 'Basic'"
                  class="badge badge-light-primary ms-50"
                  >Less Popular</span
                >
                <span
                  v-if="curr_plan.package_detail.title === 'Basic'"
                  class="badge badge-light-primary ms-50"
                  >Popular</span
                >
              </h5>
              <span v-if="curr_plan.package_detail.title === 'Basic'">
                Basic plan for small client base
              </span>
              <span v-else> Standard plan for higher client base</span>
            </div>
          </b-col>
          <b-col>
            <div class="pt-1">
              <div class="d-flex justify-content-between">
                <h5 class="fw-bolder">Days</h5>
                <h5 class="fw-bolder">
                  {{ calculate_days(curr_plan.start_date, curr_plan.end_date) }}
                  of {{ curr_plan.package_detail.subscription_days }} Days
                </h5>
              </div>
              <b-progress
                :value="
                  (calculate_days(curr_plan.start_date, curr_plan.end_date) /
                    30) *
                  100
                "
                max="100"
              />
              <p class="mt-50">
                {{ calc_remaming(curr_plan.start_date, curr_plan.end_date) }}
                days remaining until your plan requires update
              </p>
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <b-card title="Upgrade Payment History">
      <b-table :fields="fields" :items="items" responsive="sm" show-empty>
        <template #empty="scope">
          <div class="text-center">
            <p>{{ scope.emptyText }}</p>
          </div>
        </template>
        <!-- A virtual column -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <!-- A custom formatted column -->
        <template #cell(Package)="data">
          {{ data.value.title }}
        </template>

        <template #cell(status)="data">
          <b-badge
            pill
            :variant="data.value === 'captured' ? 'success' : 'danger'"
          >
            {{ data.value === "captured" ? "success" : "failed" }}
          </b-badge>
        </template>

        <template #cell(amount)="data">
          {{ data.value === "INR" ? "$" : "₹" + data.value / 100 + "/-" }}
        </template>

        <template #cell(created_at)="data">
          {{ data.value | moment("MMMM Do YYYY") }}
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BFormInput,
  BFormGroup,
  BButton,
  BTable,
  BProgress,
  BBadge,
} from "bootstrap-vue";
import { Icon } from "@iconify/vue2";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import gql from "graphql-tag";
import { GET_SUBSCRIPTION_BY_ID, GET_UPGRADE_HISTORY } from "@/queries/";
export default {
  components: {
    BCard,
    BCardBody,
    Icon,
    BFormInput,
    BFormGroup,
    BButton,
    ToastificationContent,
    BTable,
    BRow,
    BCol,
    BProgress,
    BBadge,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      curr_plan: null,
      items: null,
      fields: [
        // A virtual column that doesn't exist in items
        "index",
        // A column that needs custom formatting
        { key: "Package", label: "Package Name" },
        { key: "order_id", label: "Order Id" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "date" },
        { key: "amount", label: "Amount" },
      ],
    };
  },
  methods: {
    calculate_days(start) {
      var a = this.$moment();
      var b = this.$moment(start);
      return a.diff(b, "days") + 1; // 1
    },
    calc_remaming(start, end) {
      var a = this.$moment();
      var b = this.$moment(end);
      return b.diff(a, "days");

      //   return a.diff(b, "days") // 1
    },
  },
  async created() {
    try {
      const data = await this.$apollo.query({
        query: GET_SUBSCRIPTION_BY_ID,
        variables: {
          id: JSON.parse(localStorage.getItem("userInfo")).id,
        },
      });
      this.curr_plan = data.data.Fitness_upgrade_current_package[0];
      console.log(this.curr_plan);
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await this.$apollo.query({
        query: GET_UPGRADE_HISTORY,
        variables: {
          userId: JSON.parse(localStorage.getItem("userInfo")).id,
        },
      });
      this.items = data.data.Fitness_upgrade_order_history;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss">
</style>
