<template>
  <div id="user-profile">

    <profile-header />
    <section id="profile-info">
      <b-row>
        <b-col lg="3" cols="12" order="2" order-lg="1">
          <profile-suggestion />
          <profile-polls />
        </b-col>

        <b-col lg="9" cols="12" order="1" order-lg="2">
          <b-card class="ml-25">
            <div class="d-flex justify-content-start align-items-center mb-1">

              <!-- avatar -->
              <b-avatar
                size="50"
                class="mr-1"
                :src="Fitness_Posts_by_pk.author.avatar"
              />
              <!--/ avatar -->
              <div class="profile-user-info">
                <h6 class="mb-0">{{ Fitness_Posts_by_pk.author.username }}</h6>
                <small class="text-muted">{{
                  Fitness_Posts_by_pk.created_at
                }}</small>
              </div>
            </div>
            <b-card-text>
              {{ Fitness_Posts_by_pk.content }}
            </b-card-text>

            <!-- post img -->
            <b-img
              v-if="Fitness_Posts_by_pk.photo"
              fluid
              rounded
              class="mb-25"
              :src="Fitness_Posts_by_pk.photo"
            />
            <!--/ post img -->
            <!-- post video -->
            <b-embed
              v-if="Fitness_Posts_by_pk.postVid"
              type="iframe"
              :src="Fitness_Posts_by_pk.postVid"
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
                <b-link
                  class="d-flex align-items-center text-muted text-nowrap"
                >
                  <feather-icon
                    icon="HeartIcon"
                    class="mr-50"
                    :class="
                      Fitness_Posts_by_pk.youLiked
                        ? 'profile-likes'
                        : 'profile-icon'
                    "
                    size="18"
                    @click="
                      Fitness_Posts_by_pk.youLiked
                        ? unlike(Fitness_Posts_by_pk.id)
                        : addnewliketoPost(Fitness_Posts_by_pk.id)
                    "
                  />
                </b-link>
                <div class="d-flex align-item-center">
                  <b-avatar-group size="26" class="ml-1">
                    <b-avatar
                      v-for="(avatarData, i) in Fitness_Posts_by_pk.likedby"
                      :key="i"
                      v-b-tooltip.hover.bottom="avatarData.authorOBJ.username"
                      class="pull-up"
                      :src="avatarData.authorOBJ.avatar"
                    />
                  </b-avatar-group>
                  <b-link
                    v-if="Fitness_Posts_by_pk.likedby_aggregate.aggregate.count"
                    class="text-muted text-nowrap mt-50 ml-50"
                    >{{
                      Fitness_Posts_by_pk.likedby_aggregate.aggregate.count
                    }}
                    Likes</b-link
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
                  v-if="
                    Fitness_Posts_by_pk.comments_aggregate.aggregate.count > 2
                  "
                >
                  <feather-icon
                    icon="MessageSquareIcon"
                    size="18"
                    class="profile-icon mr-50"
                  />

                  <span class="text-muted mr-1">
                    View
                    {{
                      kFormatter(
                        Fitness_Posts_by_pk.comments_aggregate.aggregate.count
                      )
                    }}
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
              v-for="commentx in Fitness_Posts_by_pk.comments"
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
                  <h6 class="mb-0">{{ commentx.owner.username }}</h6>
                </div>
                <small>{{ commentx.text }}</small>
              </div>
            </div>
            <!--/ comments -->

            <b-form-group>
              <b-form-textarea
                rows="3"
                placeholder="Add Comment"
                v-model="AddNewCommentData.text"
              />
            </b-form-group>
            <!--/ comment box -->

            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              size="sm"
              variant="primary"
              @click="addNewComment(Fitness_Posts_by_pk.id)"
            >
              Add a comment
            </b-button>
            <!--/ post video -->
          </b-card>
        </b-col>
      </b-row>
    </section>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  VBTooltip,
  BFormTextarea,
  BFormGroup,
  BButton,
  BAvatar,
  BCard,
  BCardText,
  BImg,
  BLink,
  BEmbed,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

import ProfileHeader from "./ProfileHeader.vue";
import ProfileSuggestedPages from "./ProfileSuggestedPages.vue";
import ProfileTwitterFeed from "./ProfileTwitterFeed.vue";
import ProfilePost from "./ProfilePost.vue";
import ProfileLatestPhotos from "./ProfileLatestPhotos.vue";
import ProfileSuggestion from "./ProfileSuggestion.vue";
import ProfilePolls from "./ProfilePolls.vue";
import { GET_POST_BY_ID } from "@/queries/";
import { kFormatter } from "@core/utils/filter";
import BCardCode from "@core/components/b-card-code";
import profileBottom from "./profileBottom.vue";

import gql from "graphql-tag";

/* eslint-disable global-require */
export default {
  components: {
    BAvatar,
    BFormTextarea,
    BButton,
    BFormGroup,
    BCard,
    BRow,
    BCardText,
    BCol,
    BLink,
    ProfileHeader,
    ProfileSuggestedPages,
    ProfileTwitterFeed,
    ProfilePost,
    ProfileLatestPhotos,
    ProfileSuggestion,
    ProfilePolls,
    profileBottom,
    BImg,
    BEmbed,
  },

  apollo: {
    Fitness_Posts_by_pk: {
      query: GET_POST_BY_ID,
      variables() {
        return {
          postId: this.$route.params.post_id,
        };
      },
    },

    // Polling interval in milliseconds
  },

  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },

  data() {
    return {
      page: 0,
      AddNewCommentData: {
        postid: null,
        text: null,
      },
      Fitness_Posts_by_pk: null,
    };
  },
methods: {
    kFormatter,


  async unlike(postId) {
    try {
           const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($postId: Int!) {
              delete_Fitness_likes(where: {postId: {_eq: $postId}}) {
               affected_rows
              }
            }
          `,
          variables: {
            postId: postId,

          },
        });
  this.$apollo.queries.Fitness_Posts_by_pk.refetch()
    } catch (error) {
      console.log(error)
    }
  },


    async addnewliketoPost(postId) {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($postId: Int!) {
              insert_Fitness_likes_one(object: {postId: $postId}) {
               id
              }
            }
          `,
          variables: {
            postId: postId
          },
        });
        // location.reload();
        // this.$emit("refresh");
                this.$apollo.queries.Fitness_Posts_by_pk.refetch()

      } catch (error) {
        console.log(error);
      }
    },


    async addNewComment(postId) {
      console.log(postId)
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($text: String!, $postId: Int!) {
              insert_Fitness_postComment_one(object: {postId: $postId, text: $text}) {
               id
              }
            }
          `,
          variables: {
            text: this.AddNewCommentData.text,
            postId: postId
          },
        });
        // location.reload();
        // this.$emit("refresh");
                this.$apollo.queries.Fitness_Posts_by_pk.refetch()

      } catch (error) {
        console.log(error);
      }
    },

  },

  mounted() {},
};
</script>

<style lang="scss" >
@import "@core/scss/vue/pages/page-profile.scss";
</style>
