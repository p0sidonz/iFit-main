<template>
  <div id="user-profile">
    <profile-header :header-data="profileData" @refresh-data="ok" />
    <section id="profile-info">
      <profile-post />
    </section>
  </div>
</template>

<script>
import { BRow, BCol } from "bootstrap-vue";
import ProfileHeader from "./ProfileHeader.vue";
import ProfilePost from "./ProfilePost.vue";

import gql from "graphql-tag";

/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    ProfileHeader,
    ProfilePost,
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
    ok(username) {
     let x = username.username
      this.refetchProfile(x)
    },
    refreshx() {
      this.refreshkey += 1;
    },
    async refetchProfile(ReUsername) {
      console.log("testing if this is even triggering", ReUsername);
      try {
        const newProfile = await this.$apollo.query({
          query: gql`
            query Fitness_User($username: String!) {
              Fitness_User(where: { username: { _eq: $username } }) {
                username
                firstName
                fullname
                avatar
                is_follow
                is_applied
                about
                role
                id
                created_at
                Follow_aggregate {
                  aggregate {
                    count
                  }
                }
                Following_aggregate {
                  aggregate {
                    count
                  }
                }
                Posts_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            }
          `,
          variables: {
            username: ReUsername,
          },
        });
        console.log(newProfile)
        this.profileData = newProfile.data.Fitness_User[0];
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
              is_follow
              created_at
              about
              is_applied
              role
              Follow_aggregate {
                aggregate {
                  count
                }
              }
              Following_aggregate {
                aggregate {
                  count
                }
              }
              Posts_aggregate {
                aggregate {
                  count
                }
              }
            }
          }
        `,
        variables: {
          username: tempUsername,
        },
      });
      this.profileData = data.data.Fitness_User[0];
      console.log("created", this.profileData);
    } catch (error) {
      console.log(error);
    }

    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        const ReUsername = this.$route.params.username;
        // react to route changes...
        // this.refetchProfile(ReUsername);
        location.reload();
      }
    );
  },
};

/* eslint-disable global-require */
</script>

<style lang="scss" >
@import "@core/scss/vue/pages/page-profile.scss";
</style>
