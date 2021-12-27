<template>
  <div>
    <!-- <div v-if="isLoading">
      <b-spinner small class="mr-1" variant="primary" />
    </div> -->
    <div>
      <!-- <div v-if="!posts.length">No posts to show</div> -->
      <div>
        <b-card class="ml-25">
          <div class="d-flex justify-content-start align-items-center mb-1">
            <!-- avatar -->
            <b-avatar
              :to="{
                name: 'profile',
                params: { username: item.author.username },
              }"
              size="50"
              class="mr-1"
              :src="item.author.avatar"
            />
            <!--/ avatar -->
            <div class="profile-user-info">
              <h6 class="mb-0">
                <router-link
                  :to="{
                    name: 'profile',
                    params: { username: item.author.username },
                  }"
                >
                  {{ item.author.username }}
                </router-link>
              </h6>
              <small class="text-muted"
                >{{ item.created_at | moment("from", "now") }}
              </small>
            </div>
          </div>
          <b-card-text>
            {{ item.content }}
          </b-card-text>

          <!-- post img -->
          <b-img
            v-if="item.photo"
            fluid
            rounded
            class="mb-25"
            :src="item.photo"
            @click="dblclick(item.id, item.youLiked)"
          />
          <!--/ post img -->
          <!-- post video -->
          <b-embed
            v-if="item.postVid"
            type="iframe"
            :src="item.postVid"
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
                <div @click="unlike(item.id)">
                  <Icon
                    v-if="item.youLiked"
                    icon="ant-design:heart-filled"
                    style="font-size: 32px"
                    color="red"
                  />
                </div>
                <div @click="addnewliketoPost(item.id)">
                  <Icon
                    v-if="!item.youLiked"
                    icon="akar-icons:heart"
                    style="font-size: 32px"
                  />
                </div>
              </b-link>
              <div class="d-flex align-item-center">
                <!-- <b-avatar-group size="26" class="ml-1">
                  <b-avatar
                    v-for="(avatarData, i) in item.likedby"
                    :key="i"
                    v-b-tooltip.hover.bottom="avatarData.authorOBJ.username"
                    class="pull-up"
                    :src="avatarData.authorOBJ.avatar"
                  />
                </b-avatar-group> -->
                <b-link class="text-muted text-nowrap mt-50 ml-50"
                  >{{ item.likedby_aggregate.aggregate.count }} Likes</b-link
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
                v-if="item.comments_aggregate.aggregate.count > 3"
              >
                <feather-icon
                  icon="MessageSquareIcon"
                  size="18"
                  class="profile-icon mr-50"
                />

                <span class="text-muted mr-1">
                  View
                  {{ kFormatter(item.comments_aggregate.aggregate.count) }}
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
            v-for="commentx in item.comments"
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
          <div
            v-if="item.comments_aggregate.aggregate.count > 3"
            class="text-center mb-2"
          >
            <b-button v-if="isLoading" variant="primary" disabled class="mr-1">
              <b-spinner small type="grow" />
            </b-button>
            <b-button
              v-else
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="primary"
              size="sm"
              @click="loadMoreComment(item.id)"
            >
              Load More
            </b-button>
          </div>
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
            @click="addNewComment(item.id)"
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
import { Icon } from "@iconify/vue2";
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
    Icon,
  },

  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },

  methods: {
    kFormatter,

    dblclick(postid, youLiked) {
      this.counter += 1;
      if (!youLiked && this.counter === 2) {
        this.addnewliketoPost(postid);
        this.counter = 0;
      } else if (youLiked && this.counter === 2) {
        this.unlike(postid);
        this.counter = 0;
      }
    },

    async unlike(postId) {
      // let UserToRemove = this.item.likedby.filter(
      //   (item) => item.authorOBJ.id === this.currentUserID.id
      // );
      // console.log(UserToRemove);

      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($postId: Int!) {
              delete_Fitness_likes(where: { postId: { _eq: $postId } }) {
                affected_rows
              }
            }
          `,
          variables: {
            postId: postId,
          },
        });
        this.item.youLiked = false;
        this.item.likedby_aggregate.aggregate.count--;

        // this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        console.log(error);
      }
    },

    async addnewliketoPost(postId) {
      if (this.item.youLiked) {
        return;
      }
      this.$Progress.start();
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($postId: Int!) {
              insert_Fitness_likes_one(object: { postId: $postId }) {
                authorOBJ {
                  id
                  fullname
                  username
                  avatar
                }
              }
            }
          `,
          variables: {
            postId: postId,
          },
        });
        this.item.youLiked = true;
        this.item.likedby_aggregate.aggregate.count++;
        // if (this.item.likedby.length < 5) {
        //   this.item.likedby.push(data.data.insert_Fitness_likes_one);
        // }
        // console.log(data.data.insert_Fitness_likes_one);
        // authorOBJ = {...data.data.insert_Fitness_likes_one}
        // location.reload();
        // this.$emit("refresh");
        // this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        console.log(error);
      }
    },
    async addNewComment(postId) {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($text: String!, $postId: Int!) {
              insert_Fitness_postComment_one(
                object: { postId: $postId, text: $text }
              ) {
                id
                text
                owner {
                  username
                  avatar
                  id
                }
              }
            }
          `,
          variables: {
            text: this.AddNewCommentData.text,
            postId: postId,
          },
        });
        this.item.comments.push(data.data.insert_Fitness_postComment_one);

        // location.reload();
        // this.$emit("refresh");
        this.AddNewCommentData.text = null;
        // this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        console.log(error);
      }
    },

    async loadMoreComment(post_id) {
      this.isLoading = true;
      console.log(post_id);
      this.post_offset = this.post_offset + 3;

      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            query LoadComments($offset: Int!, $post_id: Int!) {
              Fitness_Posts_by_pk(id: $post_id) {
                id
                comments(
                  limit: 3
                  offset: $offset
                  order_by: { created_at: desc }
                ) {
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
          variables: {
            offset: this.post_offset,
            post_id: post_id,
          },
        });
        this.isLoading = false;
        this.item.comments.push(...data.data.Fitness_Posts_by_pk.comments);
        // console.log(
        //   this.posts[index].comments.push(
        //     ...item.item.Fitness_Posts_by_pk.comments
        //   )
        // );
        // location.reload();
        // this.$emit("refresh");
        // this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        this.isLoading = false;

        console.log(error);
      }
    },
  },

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      isLoading: false,
      AddNewCommentData: {
        postid: null,
        text: null,
      },
      post_offset: 0,
      post_Id: null,
      counter: 0,
      currentUserID: JSON.parse(localStorage.getItem("userInfo")),
    };
  },
};
</script>
