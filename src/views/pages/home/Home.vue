<template>
  <div>
    <!-- profile info  -->
    <section id="profile-info">
      <b-row>
        <!-- about suggested page and twitter feed -->
        <b-col lg="3" cols="12" order="2" order-lg="1">
          <profile-suggestion />

           </b-col>
        <!--/ about suggested page and twitter feed -->

        <!-- post -->
        <b-col lg="6" cols="12" order="1" order-lg="2">
          <profile-post />
        </b-col>

        <!-- <b-col lg="6" order="2" >
          <card-advance-timeline />
        </b-col> -->

        <b-col lg="3" cols="12" order="3">
                            <card-advance-meetup />

        </b-col>

        <!--/ load more  -->
      </b-row>
    </section>
    <!--/ profile info  -->
  </div>
</template>

<script>
import { BCard, BCardText, BLink, BRow, BCol } from "bootstrap-vue";
import ProfilePost from "./posts.vue";
import CardAdvanceTimeline from "./CardAdvanceTimeline.vue";
import ProfileSuggestion from "./ProfileSuggestion.vue";
import CardAdvanceMeetup from "./CardAdvanceMeetup.vue";

export default {
  components: {
    BCard,
    BCardText,
    BLink,
    ProfilePost,
    BRow,
    BCol,
    CardAdvanceTimeline,
    ProfileSuggestion,
    CardAdvanceMeetup,
  },
};
</script>

<style lang="scss" >
@import "@core/scss/vue/pages/page-profile.scss";
</style>
