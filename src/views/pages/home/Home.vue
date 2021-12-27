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
          <div v-else>Loading...</div>
          <feed-bottom @feedcount="loadMore" />
        </b-col>

        <!-- <b-col lg="6" order="2" >
          <card-advance-timeline />
        </b-col> -->

        <b-col lg="3" cols="12" order="3">
          <role-card />

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
import { BCard, BCardText, BLink, BRow, BCol } from "bootstrap-vue";
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
  },
  data() {
    return {
      posts: [],
      offset: 0,
      Fitness_Posts: [],
    };
  },

  apollo: {
    // Subscriptions
    $subscribe: {
      // When a tag is added
      posts: {
        query: gql`
          subscription notifyNewPosts($userId: Int!, $offset: Int) {
            Fitness_Posts(
              order_by: { created_at: desc }
              limit: 2
              offset: $offset
              where: {
                _or: [
                  { author: { Follow: { following_id: { _eq: $userId } } } }
                  { userId: { _neq: $userId } }
                ]
              }
            ) {
              id
              content
              photo
              created_at
              youLiked
              author {
                username
                id
                avatar
              }
              likedby_aggregate {
                aggregate {
                  count
                }
              }
              likedby {
                authorOBJ {
                  id
                  username
                  avatar
                }
              }
              comments_aggregate {
                aggregate {
                  count
                }
              }
              comments(limit: 3, order_by: { created_at: desc }) {
                id
                text
                owner {
                  username
                  avatar
                  id
                }
              }
            }
          }
        `,
        // Reactive variables
        variables() {
          return {
            userId: 18,
            offset: this.offset,
          };
        },
        // Result hook
        result({ data }) {
          if (this.offset === 0) {
            this.posts = data.Fitness_Posts;
          }
          if (this.offset != 0) {
            this.posts.push(...data.Fitness_Posts);
          }
        },
        // Skip the subscription
        skip() {
          return this.skipSubscription;
        },
      },
    },

    // Fitness_Posts: {
    //   query: GET_FEED,
    //   variables() {
    //     return {
    //       userId: 18,
    //       offset: this.offset,
    //     };
    //   },
    // },

    // Polling interval in milliseconds
  },

  methods: {
    async loadFeed() {
      try {
        const result = await this.$apollo.query({
          query: GET_FEED,
          variables: {
            userId: 18,
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
