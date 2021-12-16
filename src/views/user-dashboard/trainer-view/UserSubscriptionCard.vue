<template>
  <b-card-code title="Subscrition History" no-body>
    <b-table
      :fields="fields"
      :items="planData.user_subscriptions"
      responsive
      class="mb-0"
    >
      <!-- A virtual column -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <!-- A custom formatted column -->
      <template #cell(package)="data">
        <span class="text-nowrap">{{ data.item.trainer_package.title }}</span>
      </template>
      <template #cell(created_at)="data">
        <span class="text-nowrap">{{
          data.item.start_date
        }}</span>
      </template>
      <!-- A custom formatted column -->
      <template #cell(Popularity)="data">
        <b-progress
          :value="data.value.value"
          max="100"
          height="7px"
          :variant="data.value.variant"
          striped
        />
      </template>

      <template #cell(order_status)="data">
        <b-badge pill :variant="data.value.variant">
          {{
            data.item.order_status === "payment.captured" ? "success" : "failed"
          }}
        </b-badge>
      </template>

      <!-- A virtual composite column -->
      <template #cell(price)="data">
        {{ data.item.trainer_package.amount }}
      </template>

      <!-- Optional default data cell scoped slot -->
      <template #cell()="data">
        {{ data.value }}
      </template>
    </b-table>
  </b-card-code>
</template>

<script>
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import { BTable, BProgress, BBadge } from "bootstrap-vue";

export default {
  components: {
    BCardCode,
    BTable,
    BProgress,
    BBadge,
  },

  props: {
    planData: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      fields: [
        // A virtual column that doesn't exist in items
        "index",
        // A column that needs custom formatting
        { key: "package", label: "package" },
        // 'Category',
        // // A regular column
        { key: "created_at", label: "Order Date" },
        // // A regular column
        { key: "order_status", label: "Order Status" },
        // // A virtual column made up from two fields
        { key: "price", label: "Price" },
      ],
    };
  },
};
</script>
