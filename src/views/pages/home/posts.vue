<template>
  <div>
    <div v-if="isLoading">
      <b-spinner small class="mr-1" variant="primary" />
    </div>
    <div v-else>
      <div v-if="!posts.length">No posts to show</div>
      <div v-else v-for="data in posts" :key="data.id">
        <b-card class="ml-25">
          <div class="d-flex justify-content-start align-items-center mb-1">
            <!-- avatar -->
            <b-avatar
              :to="{
                name: 'profile',
                params: { username: data.author.username },
              }"
              size="50"
              class="mr-1"
              :src="data.author.avatar"
            />
            <!--/ avatar -->
            <div class="profile-user-info">
              <h6 class="mb-0">
                <router-link
                  :to="{
                    name: 'profile',
                    params: { username: data.author.username },
                  }"
                >
                  {{ data.author.username }}
                </router-link>
              </h6>
              <small class="text-muted"
                >{{ data.created_at | moment("from", "now") }}
              </small>
            </div>
          </div>
          <b-card-text>
            {{ data.content }}
          </b-card-text>

          <!-- post img -->
          <b-img
            v-if="data.photo"
            fluid
            rounded
            class="mb-25"
            :src="data.photo"
          />
          <!--/ post img -->
          <!-- post video -->
          <b-embed
            v-if="data.postVid"
            type="iframe"
            :src="data.postVid"
            allowfullscreen
            class="rounded mb-50"
          />

          <!-- likes comments  share-->
          <b-row class="pb-50 mt-50">
            <b-col
              sm="8"
              class="
                d-flex
                justify-content-between justify-content-sm-start
                mb-2
              "
            >
              <b-link class="d-flex align-items-center text-muted text-nowrap">
                <feather-icon
                  icon="HeartIcon"
                  class="mr-50"
                  :class="data.youLiked ? 'profile-likes' : 'profile-icon'"
                  size="18"
                  @click="
                    data.youLiked ? unlike(data.id) : addnewliketoPost(data.id)
                  "
                />
              </b-link>
              <div class="d-flex align-item-center">
                <b-avatar-group size="26" class="ml-1">
                  <b-avatar
                    v-for="(avatarData, i) in data.likedby"
                    :key="i"
                    v-b-tooltip.hover.bottom="avatarData.authorOBJ.username"
                    class="pull-up"
                    :src="avatarData.authorOBJ.avatar"
                  />
                </b-avatar-group>
                <b-link
                  v-if="data.likedby_aggregate.aggregate.count"
                  class="text-muted text-nowrap mt-50 ml-50"
                  >{{ data.likedby_aggregate.aggregate.count }} Likes</b-link
                >
              </div>
            </b-col>
            <b-col
              sm="4"
              class="
                d-flex
                justify-content-between justify-content-sm-end
                align-items-center
                mb-2
              "
            >
              <b-link
                class="text-body text-nowrap"
                v-if="data.comments_aggregate.aggregate.count > 2"
              >
                <feather-icon
                  icon="MessageSquareIcon"
                  size="18"
                  class="profile-icon mr-50"
                />

                <span class="text-muted mr-1">
                  View
                  {{ kFormatter(data.comments_aggregate.aggregate.count) }}
                  Comments</span
                >
              </b-link>

              <b-link class="text-body text-nowrap">
                <feather-icon
                  icon="Share2Icon"
                  size="18"
                  class="profile-icon mr-50"
                />
                <span class="text-muted">Share</span>
              </b-link>
            </b-col>
          </b-row>
          <!-- comments -->
          <div
            v-for="commentx in data.comments"
            :key="commentx.id"
            class="d-flex align-items-start mb-1"
          >
            <b-avatar
              :src="commentx.owner.avatar"
              size="34"
              class="mt-25 mr-75"
            />
            <div class="profile-user-info w-100">
              <div class="d-flex align-items-center justify-content-between">
                <h6 class="mb-0">
                  <router-link
                    :to="{
                      name: 'profile',
                      params: { username: commentx.owner.username },
                    }"
                  >
                    {{ commentx.owner.username }}
                  </router-link>
                </h6>
              </div>
              <small>{{ commentx.text }}</small>
            </div>
          </div>
          <!--/ comments -->

          <b-form-group>
            <b-form-textarea
              rows="1"
              placeholder="Add Comment"
              v-model="AddNewCommentData.text"
            />
          </b-form-group>
          <!--/ comment box -->

          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            size="sm"
            variant="primary"
            @click="addNewComment(data.id)"
          >
            Add a comment
          </b-button>
          <!--/ post video -->
        </b-card>
      </div>
    </div>
  </div>
</template>


<script>
import {
  BAvatar,
  BCard,
  BCardText,
  BImg,
  BLink,
  BCol,
  BAvatarGroup,
  VBTooltip,
  BFormTextarea,
  BButton,
  BFormGroup,
  BEmbed,
  BSpinner,
  BRow,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { kFormatter } from "@core/utils/filter";
import gql from "graphql-tag";

export default {
  components: {
    BAvatar,
    BCard,
    BCardText,
    BButton,
    BFormTextarea,
    BImg,
    BFormGroup,
    BLink,
    BCol,
    BAvatarGroup,
    BEmbed,
    BSpinner,
    BRow,
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
              comments(limit: 2) {
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

  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },

  methods: {
    kFormatter,

    async addNewComment(postId) {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($text: String!, $postId: Int!) {
              insert_Fitness_postComment_one(
                object: { postId: $postId, text: $text }
              ) {
                id
              }
            }
          `,
          variables: {
            text: this.AddNewCommentData.text,
            postId: postId,
          },
        });
        // location.reload();
        // this.$emit("refresh");
        this.AddNewCommentData.text = null;
        // this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        console.log(error);
      }
    },
  },

  data() {
    return {
      posts: [],
      isLoading: false,
      AddNewCommentData: {
        postid: null,
        text: null,
      },
    };
  },
};
</script>
