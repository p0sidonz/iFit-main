<template>
  <div>
    <div v-if="planData.length">
      <b-card no-body class="border-primary">
        <b-card-header
          class="d-flex justify-content-between align-items-center pt-75 pb-25"
        >
          <h5 class="mb-0">
            {{ planData[0].trainer_package.title }}
          </h5>
          <b-badge variant="light-primary">
            {{ planData[0].trainer_package.subscription_days }} Days
          </b-badge>
          <small class="text-muted w-100">Current plan</small>
        </b-card-header>

        <b-card-body>
          <ul class="list-unstyled my-1">
            <li>
              <span class="align-middle">Includes Diet Chat</span>
            </li>
            <li>
              <span class="align-middle">Includes Workout Plan</span>
            </li>
          </ul>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="danger"
            block
          >
            Expires {{ planData[0].end_date | moment("from", "now") }}
          </b-button>
        </b-card-body>
      </b-card>
    </div>
    <div v-else>
      <b-card>
        <b-card-header
          class="d-flex justify-content-between align-items-center pt-75 pb-25"
        >
          <h5 class="mb-0">OFFLINE CLIENT</h5>
        </b-card-header>

        <b-card-body>
          <ul class="list-unstyled my-1">
            <li>
              <span class="align-middle">Includes Diet Chat</span>
            </li>
            <li>
              <span class="align-middle">Includes Workout Plan</span>
            </li>
          </ul>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            block
          >
            Expires: {{ timeCalc(offline.end_date) ? 'Expired' :  offline.end_date  }}
          </b-button>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import { BCard, BCardHeader, BCardBody, BBadge, BButton } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BBadge,
    BButton,
  },

  methods: {
    timeCalc(date) {
      var m = this.$moment(date);
      var now = this.$moment();
      let o = m.isBefore(now);
      return o;
    },
  },

  props: {
    planData: {
      type: Array,
      default: () => {},
    },
    offline: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style>
</style>
