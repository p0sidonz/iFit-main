<template>
  <div id="user-profile">
    <profile-header />
    <!-- profile info  -->
    <section id="profile-info">
      <!--/ about suggested page and twitter feed -->

      <!-- post -->
      <!-- {{ profileData }} -->
      <profile-post /> 

      <!-- post -->

      <!-- latest photos suggestion and polls -->

      <!--/ latest photos suggestion and polls -->
    </section>
    <!--/ profile info  -->
  </div>
</template>

<script>
import { BRow, BCol } from "bootstrap-vue";
import ProfileHeader from "./ProfileHeader.vue";
import ProfileAbout from "./ProfileAbout.vue";
import ProfileSuggestedPages from "./ProfileSuggestedPages.vue";
import ProfileTwitterFeed from "./ProfileTwitterFeed.vue";
import ProfilePost from "./ProfilePost.vue";
import ProfileLatestPhotos from "./ProfileLatestPhotos.vue";
import ProfileSuggestion from "./ProfileSuggestion.vue";
import ProfilePolls from "./ProfilePolls.vue";

import gql from "graphql-tag";

/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    ProfileHeader,
    ProfileAbout,
    ProfileSuggestedPages,
    ProfileTwitterFeed,
    ProfilePost,
    ProfileLatestPhotos,
    ProfileSuggestion,
    ProfilePolls,
  },
  data() {
    return {
      profileData: null,
      username: null,
      refreshkey: 0,
      postID: null,
    };
  },

  methods: {
    refreshx() {
      this.refreshkey += 1;
    },
    async refetchProfile(ReUsername) {
      try {
        const newProfile = await this.$apollo.query({
          query: gql`
            query Fitness_User($username: String!) {
              Fitness_User(where: { username: { _eq: $username } }) {
                username
                firstName
                fullname
                id
                created_at
              }
            }
          `,
          variables: {
            username: ReUsername,
          },
        });
        this.profileData = data.data.Fitness_User[0];
      } catch (error) {
        console.log(error);
      }
    },
  },

  async created() {
    let tempUsername = this.$route.params.username;
    try {
      const data = await this.$apollo.query({
        query: gql`
          query Fitness_User($username: String!) {
            Fitness_User(where: { username: { _eq: $username } }) {
              username
              firstName
              id
              avatar
              fullname
              created_at
            }
          }
        `,
        variables: {
          username: tempUsername,
        },
      });

      this.profileData = data.data.Fitness_User[0];
    } catch (error) {}

    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        const ReUsername = this.$route.params.username;
        // react to route changes...
        this.refetchProfile(ReUsername);
      }
    );
  },
};

/* eslint-disable global-require */
</script>

<style lang="scss" >
@import "@core/scss/vue/pages/page-profile.scss";
</style>
