<template>
  <div>
    <!-- profile info  -->
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
          </div>
          <div v-else>
            <div class="text-center">
              <b-alert variant="primary" show>
                <div class="alert-body">
                  <span>No posts to show! Follow someone and make gainz!</span>
                </div>
              </b-alert>
            </div>
          </div>
          <feed-bottom @feedcount="loadMore" />
        </b-col>

        <!-- <b-col lg="6" order="2" >
          <card-advance-timeline />
        </b-col> -->

        <b-col lg="3" cols="12" order="3">
          <role-card v-if="currentUser.role === 'user'" />

          <card-download-app />
          <profile-suggestion class="d-none d-sm-block" />
        </b-col>

        <!--/ load more  -->
      </b-row>
    </section>
    <!--/ profile info  -->
  </div>
</template>

<script>
import { BCard, BCardText, BLink, BRow, BCol, BAlert } from "bootstrap-vue";
import ProfilePost from "./posts.vue";
import CardAdvanceTimeline from "./CardAdvanceTimeline.vue";
import ProfileSuggestion from "./ProfileSuggestion.vue";
import CardAdvanceMeetup from "./CardAdvanceMeetup.vue";
import CardDownloadApp from "./CardDownloadApp.vue";
import gql from "graphql-tag";
import PostComponent from "./postComponent.vue";
import FeedBottom from "./feedBottom.vue";
import { GET_FEED, GET_POST_BY_ID } from "@/queries/";
import RoleCard from "./RoleCard.vue";
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
    CardDownloadApp,
    PostComponent,
    FeedBottom,
    RoleCard,
    BAlert,
  },
  data() {
    return {
      posts: [],
      offset: 0,
      Fitness_Posts: [],
      currentUser: JSON.parse(localStorage.getItem("userInfo")),
    };
  },

  methods: {
    async loadFeed() {
      try {
        const result = await this.$apollo.query({
          query: GET_FEED,
          variables: {
            userId: this.currentUser.id,
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
  },
  created() {
    this.loadFeed();
  },
};
</script>
