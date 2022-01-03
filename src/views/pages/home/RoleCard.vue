<template>
  <div>
    <b-card>
      <div class="pricing-trial-content d-flex justify-content-between">
        <div class="text-center text-md-left mt-3">
          <h3 class="text-primary">Upgrade your account for as low as 499</h3>
          <h5>
            We are offering lauching offer for the first 1000 customers only.
            <b-badge pill variant="light-primary" class="badge-glow"
              >FLAT 50% OFF
            </b-badge>
          </h5>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mt-lg-3"
            :to="{ name: trainer-pricing }"
          >
            Upgrade now
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
    </b-card>
  </div>
</template>

<script>
import { BCard, BAvatar, BButton, BBadge } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
export default {
  components: {
    BCard,
    BAvatar,
    BButton,
    BBadge,
  },
  directives: {
    Ripple,
  },
};
</script>
