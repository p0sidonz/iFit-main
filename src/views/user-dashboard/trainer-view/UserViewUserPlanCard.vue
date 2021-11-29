<template>
  <b-card
    no-body
    class="border-primary"
  >
    <b-card-header class="d-flex justify-content-between align-items-center pt-75 pb-25">
      <h5 class="mb-0">
        {{planData[0].trainer_package.title}}
      </h5>
      <b-badge variant="light-primary">
        {{planData[0].trainer_package.subscription_days}} Days
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
                <li>
          <span class="align-middle">Includes 2 Video Sessions</span>

        </li>
      </ul>
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="danger"
        block
      >
        Exp. Date: {{planData[0].end_date}}
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BBadge, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

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


  props: {
    planData: {
      type: Array,
      default: () => {},
    },
  },

}
</script>

<style>

</style>
