<template>
  <div>
    <!-- profile info  -->
    <section id="profile-info">
      <b-row>
        <!-- about suggested page and twitter feed -->
        <b-col lg="3" cols="12" order="2" order-lg="1">
          <profile-suggestion />
          <card-download-app />
        </b-col>
        <!--/ about suggested page and twitter feed -->

        <!-- post -->
        <b-col lg="6" cols="12" order="1" order-lg="2">
          <!-- <profile-post /> -->
          <div>
            <post-component
              v-for="(item, index) in posts"
              v-bind:item="item"
              v-bind:index="index"
              v-bind:key="item.id"
              :posts="item"
            />
          </div>
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
import CardDownloadApp from "./CardDownloadApp.vue";
import gql from "graphql-tag";
import PostComponent from "./postComponent.vue";

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
  },
  data() {
    return {
      posts: [],
    };
  },

  apollo: {
    // Subscriptions
    $subscribe: {
      // When a tag is added
      posts: {
        query: gql`
          subscription notifyNewPosts($userId: Int!) {
            Fitness_Posts(
              order_by: { created_at: desc }
              limit: 10
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
          };
        },
        // Result hook
        result(data) {
          console.log(data);
          this.posts = data.data.Fitness_Posts;
        },
        // Skip the subscription
        // skip() {
        //   return this.skipSubscription;
        // },
      },
    },
    // Polling interval in milliseconds
  },
};
</script>
