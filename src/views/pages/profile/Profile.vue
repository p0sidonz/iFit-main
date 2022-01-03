<template>
  <div>
    <div v-if="isLoading">
      <b-spinner small class="mr-1" variant="primary" />
    </div>
    <div v-else id="user-profile">
      <profile-header :header-data="profileData" @refresh-data="ok" />
      <section id="profile-info">
        <b-row>
          <!-- about suggested page and twitter feed -->
          <!--/ about suggested page and twitter feed -->
          <!-- post -->
          <b-col lg="9" cols="12" order="1" order-lg="2">
            <!-- <profile-post /> -->
            <div v-if="Fitness_Posts.length">
              <post-component
                v-for="(item, index) in Fitness_Posts"
                v-bind:item="item"
                v-bind:index="index"
                v-bind:key="item.id"
                :posts="item"
              />
              <feed-bottom @feedcount="loadMore" />
            </div>

            <div v-else>
              <div class="text-center">
                <b-alert variant="primary" show>
                  <div class="alert-body">
                    <span>No posts to show!</span>
                  </div>
                </b-alert> 
              </div>
            </div>
          </b-col>

          <!-- <b-col lg="6" order="2" >
          <card-advance-timeline />
        </b-col> -->
          <b-col lg="3" cols="12" order="3">
            <profile-suggestion class="d-none d-sm-block" />
          </b-col>

          <!--/ load more  -->
        </b-row>
      </section>
    </div>
  </div>
</template>

<script>
import { BRow, BCol, BSpinner, BAlert } from "bootstrap-vue";
import ProfileHeader from "./ProfileHeader.vue";
import PostComponent from "./postComponent.vue";
import { GET_POST } from "@/queries/";
import FeedBottom from "./feedBottom.vue";
import ProfileAbout from "./ProfileAbout.vue";
import gql from "graphql-tag";
import ProfileSuggestion from "./ProfileSuggestion.vue";

/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    ProfileHeader,
    BSpinner,
    PostComponent,
    FeedBottom,
    ProfileAbout,
    ProfileSuggestion,
    BAlert,
  },

  data() {
    return {
      Fitness_Posts: [],
      profileData: null,
      username: null,
      refreshkey: 0,
      postID: null,
      offset: 0,
      isLoading: false,
      getUsernameFromParam: this.$route.params.username,
      currentUser: JSON.parse(localStorage.getItem("userInfo")),
    };
  },

  methods: {
    async loadFeed() {
      try {
        const result = await this.$apollo.query({
          query: GET_POST,
          variables: {
            username: this.getUsernameFromParam,
            offset: this.offset,
          },
        });
        console.log(result);
        if (this.offset === 0) {
          this.Fitness_Posts = result.data.Fitness_Posts;
        }
        if (this.offset != 0) {
          this.Fitness_Posts.push(...result.data.Fitness_Posts);
        }
      } catch (error) {
        console.log(error);
      }
    },

    loadMore() {
      console.log("ok");
      this.offset = this.offset + 2;
      this.loadFeed();
    },

    ok() {
      let username = this.$route.params.username;
      let x = username.username;
      this.refetchProfile(x);
    },
    refreshx() {
      this.refreshkey += 1;
    },

    async refetchProfile(ReUsername) {
      this.isLoading = true;
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
        console.log(newProfile.data.Fitness_User.length);
        if (!newProfile.data.Fitness_User.length) {
          this.$router.push("/error-404");
        }
        if (newProfile.data.Fitness_User.length) {
          this.isLoading = false;

          this.profileData = newProfile.data.Fitness_User[0];
        }
      } catch (error) {
        this.isLoading = false;

        console.log(error);
      }
    },
  },

  async created() {
    this.isLoading = true;

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
              trainer_packages(where: { status: { _eq: "Active" } }, limit: 1) {
                id
              }
            }
          }
        `,
        variables: {
          username: tempUsername,
        },
      });

      console.log(data.data.Fitness_User.length);

      if (!data.data.Fitness_User.length) {
        this.isLoading = false;
        this.$router.push("/error-404");
      }
      if (data.data.Fitness_User.length) {
        this.isLoading = false;

        this.profileData = data.data.Fitness_User[0];
      }

      console.log("created", this.profileData);
    } catch (error) {
      this.isLoading = false;

      console.log(error);
    }
    this.loadFeed();
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        const ReUsername = this.$route.params.username;
        // react to route changes...
        // this.refetchProfile(ReUsername);
        //hard refresh always done the job! :D
        location.reload();
      }
    );
  },
};

/* eslint-disable global-require */
</script>

<style lang="scss" >
// @import "@core/scss/vue/pages/page-profile.scss";
.custom {
  position: sticky;
}
</style>
