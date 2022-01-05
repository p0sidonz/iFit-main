 
<template>
  <div>
    <b-card title="Training Payment History ">
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

        <template #cell(order_status)="data">
          <b-badge
            pill
            :variant="data.value === 'captured' ? 'success' : 'danger'"
          >
            {{ data.value === "captured" ? "success" : "failed" }}
          </b-badge>
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
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BCard,
  BFormTextarea,
  BTable,
  BProgress,
  BBadge,
} from "bootstrap-vue";
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import Cleave from "vue-cleave-component";
import gql from "graphql-tag";

// eslint-disable-next-line import/no-extraneous-dependencies
import "cleave.js/dist/addons/cleave-phone.us";

export default {
  components: {
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BFormTextarea,
    vSelect,
    flatPickr,
    Cleave,
    BTable,
    BProgress,
    BBadge,
  },
  directives: {
    Ripple,
  },
  props: {
    informationData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      localOptions: JSON.parse(JSON.stringify(this.informationData)),
      items: null,
      fields: [
        // A virtual column that doesn't exist in items
        "index",
        // A column that needs custom formatting
        { key: "order_id", label: "Order Id" },
        { key: "start_date", label: "Start date" },
        { key: "end_date", label: "Start date" },
        { key: "amount", label: "Amount" },
        { key: "order_status", label: "Status" },
        { key: "currency", label: "Currency" },
        { key: "created_at", label: "date" },
      ],
    };
  },
  methods: {
    resetForm() {
      this.localOptions = JSON.parse(JSON.stringify(this.informationData));
    },
  },

  async created() {
    try {
      const data = await this.$apollo.query({
        query: gql`
          query pkg_history($id: Int) {
            Fitness_user_subscription(
              where: { user_paid_id: { _eq: $id } }
              order_by: { created_at: desc }
            ) {
              id
              order_id
              created_at
              amount
              currency
              start_date
              end_date
              order_status
            }
          }
        `,
        variables: {
          id: JSON.parse(localStorage.getItem("userInfo")).id,
        },
      });
      this.items = data.data.Fitness_user_subscription;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
