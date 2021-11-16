<template>
  <b-card>
    <!-- about -->
    <h5 class="text-capitalize mb-75">
      Name
    </h5>
    <b-card-text>
      {{ aboutData.fullname }}
    </b-card-text>

    <h5 class="text-capitalize mb-75">
      description
    </h5>
    <b-card-text>
      You haven't added description yet
    </b-card-text>

    <h5 class="text-capitalize mb-75">
      joined
    </h5>
    <b-card-text>
      {{ aboutData.created_at }}
    </b-card-text>

    <h5 class="text-capitalize mb-75">
      Views
    </h5>
    <b-card-text>
      {{ aboutData.view_counts }}
    </b-card-text>
  </b-card>
</template>

<script>
import { BCard, BCardText } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
  },
  props: {
    aboutData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
