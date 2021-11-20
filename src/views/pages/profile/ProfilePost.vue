<template>
  <div>
    <b-row>
      <b-col md="12">
        <b-card-group columns>
          <!-- card image top -->
          <b-card
            v-for="data in Fitness_Posts"
            :key="data.id"
            :img-src="data.photo"
            :src="data.id"
            img-top
            @click="modalContent(data)"
            class="position-static cursor-pointer"
          >
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
                    :class="data.youLiked ? 'profile-likes' : 'profile-icon'"
                    size="18"
                    @click="
                      data.youLiked
                        ? unlike(data.id)
                        : addnewliketoPost(data.id)
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
                    class="text-muted text-nowrap mt-20 ml-50"
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
                <b-link class="text-body text-nowrap">
                  <feather-icon
                    icon="MessageSquareIcon"
                    size="18"
                    class="profile-icon mr-50"
                  />
                  <span class="text-muted">View Comments</span>
                </b-link>
              </b-col>
            </b-row>
          </b-card>
        </b-card-group>
        <b-col @click="fetchMore()" cols="12" order="4">
          <profile-bottom />
        </b-col>
      </b-col>
    </b-row>

    <b-modal
      id="idk2"
      size="xl"
      centered
      hide-footer
      v-model="modalShow"
      scrollable:false
      title="Post"
    >
      <div v-if="currentPost" class="container">
        <div class="row">
          <div class="col-sm-8">
            <b-img
              rounded
              center
              class="d-inline-block mr-1 mb-1"
              :src="currentPost.photo"
              fluid
            />
          </div>
          <div class="col-sm">
            <div class="d-flex justify-content-start align-items-center mb-1">
              <b-avatar
                size="50"
                class="mr-1"
                :src="currentPost.author.avatar"
              />

              <div class="profile-user-info">
                <h6 class="mb-0">{{ currentPost.author.username }}</h6>
                <small class="text-muted">{{ currentPost.created_at }}</small>
              </div>
            </div>
            <b-card-text>
              {{ currentPost.content }}
            </b-card-text>

            <b-link class="d-flex align-items-center text-muted text-nowrap">
              <feather-icon
                icon="HeartIcon"
                class="mr-50"
                :class="currentPost.youLiked ? 'profile-likes' : 'profile-icon'"
                size="18"
                @click="
                  currentPost.youLiked
                    ? unlike(currentPost.id)
                    : addnewliketoPost(currentPost.id)
                "
              />
            </b-link>
            <div class="d-flex align-item-center">
              <b-avatar-group size="26" class="ml-1">
                <b-avatar
                  v-for="(avatarData, i) in currentPost.likedby"
                  :key="i"
                  v-b-tooltip.hover.bottom="avatarData.authorOBJ.username"
                  class="pull-up"
                  :src="avatarData.authorOBJ.avatar"
                />
              </b-avatar-group>
              <b-link
                v-if="currentPost.likedby_aggregate.aggregate.count"
                class="text-muted text-nowrap mt-50 ml-50"
                >{{
                  currentPost.likedby_aggregate.aggregate.count
                }}
                Likes</b-link
              >
            </div>

            <br />
            <div v-if="currentPost.comments.length" class="commentx">
              <div
                v-for="commentx in currentPost.comments"
                :key="commentx.id"
                class="d-flex align-items-start mb-1"
              >
                <b-avatar
                  :src="commentx.owner.avatar"
                  size="34"
                  class="mt-25 mr-75"
                />
                <div class="profile-user-info w-100">
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <h6 class="mb-0">{{ commentx.owner.username }}</h6>
                  </div>
                  <small>{{ commentx.text }}</small>
                </div>
              </div>
            </div>

            <div v-else>
              <small class="text-muted"> No comments</small>
            </div>
            <br />
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
              @click="addNewComment(currentPost.id)"
            >
              Add a comment
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      id="newpost"
      size="default"
      centered
      hide-footer
      v-model="showNewPostModal"
      scrollable:false
      title="Add new post"
    >

    <create-post> </create-post>
    </b-modal>
    <div class="btn-new-post">
      <!-- We have wrapper because ripple effect give position relative to this absolute positioned btn -->
      <!-- Hence due to that our btn get lost -->
      <b-button @click="newPostModal" v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary">
        <feather-icon icon="PlusCircleIcon" size="18" />
        Create new post
      </b-button>
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
  BModal,
  VBModal,
  BRow,
  BCol,
  BAvatarGroup,
  VBTooltip,
  BFormTextarea,
  BButton,
  BFormGroup,
  BEmbed,
  BCardHeader,
  BCardTitle,
  BCardBody,
  BDropdown,
  BDropdownItem,
  BCardGroup,
  BImgLazy,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { kFormatter } from "@core/utils/filter";
import BCardCode from "@core/components/b-card-code";
import gql from "graphql-tag";
import { DELETE_POST_BY_ID, GET_POST, GET_POST_BY_ID } from "@/queries/";
import profileBottom from "./profileBottom.vue";
import CreatePost from './createPost.vue';

const pageSize = 2;

export default {
  components: {
    BAvatar,
    BCardGroup,
    BCardCode,
    BCard,
    BCardText,
    BButton,
    BFormTextarea,
    BImg,
    BFormGroup,
    BRow,
    BLink,
    BCol,
    BAvatarGroup,
    BEmbed,
    profileBottom,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BDropdown,
    BDropdownItem,
    BModal,
    VBModal,
    BImgLazy,
    CreatePost,
  },

  directives: {
    "b-modal": VBModal,
    Ripple,
  },

  apollo: {
    // Subscriptions
    $subscribe: {
      // When a tag is added
      tags: {
        query: gql`
          subscription name($postId: Int!) {
            Fitness_Posts_by_pk(id: $postId) {
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
              comments {
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
            postId: this.singlePostId,
          };
        },
        // Result hook
        result(data) {
          console.log(data);
          this.currentPost = data.data.Fitness_Posts_by_pk;
        },
        // Skip the subscription
        skip() {
          return this.skipSubscription;
        },
      },
    },

    Fitness_Posts: {
      query: GET_POST,
      variables() {
        return {
          username: this.getUsernameFromParam,
          limit: 5,
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
      showNewPostModal: false,
      currentPost: null,
      singlePostId: null,
      modalShow: false,
      posts: null,
      page: 0,
      getUsernameFromParam: this.$route.params.username,
      AddNewCommentData: {
        postid: null,
        text: null,
      },
      Fitness_Posts: null,
      addnewPostx: "",
    };
  },

  props: {
    postData: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    newPostModal() {
      this.showNewPostModal= true
    },

    modalContent(data) {
      let postId = data.id;
      this.singlePostId = data.id;
      this.$apollo.subscriptions.tags.skip = false;
      this.modalShow = true;
    },

    kFormatter,

    async deletePostModal(postid) {
      this.boxOne = "";
      this.$bvModal
        .msgBoxConfirm("Are you sure?", {
          cancelVariant: "outline-secondary",
        })
        .then((value) => {
          this.boxOne = value;
          this.$apollo.mutate({
            mutation: DELETE_POST_BY_ID,
            variables: {
              postId: postid,
            },
          });
          this.$apollo.queries.Fitness_Posts.refetch();
        });
    },

    async deletePostModal(postid) {
      this.boxOne = "";
      this.$bvModal
        .msgBoxConfirm("Are you sure?", {
          cancelVariant: "outline-secondary",
        })
        .then((value) => {
          this.boxOne = value;

          if (value === true) {
            this.$apollo.mutate({
              mutation: DELETE_POST_BY_ID,
              variables: {
                postId: postid,
              },
            });
            this.$apollo.queries.Fitness_Posts.refetch();
          } else {
            console.log("fail to delete");
          }
        });
    },

    fetchMore() {
      this.page++;
      this.$apollo.queries.Fitness_Posts.fetchMore({
        variables: {
          offset: this.page * pageSize,
          limit: pageSize,
        },
        updateQuery: (existing, incoming) => ({
          Fitness_Posts: [
            ...existing.Fitness_Posts,
            ...incoming.fetchMoreResult.Fitness_Posts,
          ],
        }),
      });
    },

    async unlike(postId) {
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
        this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        console.log(error);
      }
    },

    async addnewliketoPost(postId) {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($postId: Int!) {
              insert_Fitness_likes_one(object: { postId: $postId }) {
                id
              }
            }
          `,
          variables: {
            postId: postId,
          },
        });
        // location.reload();
        // this.$emit("refresh");
        this.$apollo.queries.Fitness_Posts.refetch();
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
        this.$apollo.queries.Fitness_Posts.refetch();
      } catch (error) {
        console.log(error);
      }
    },

    async addnewPost(addnewPostx) {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($content: String!) {
              insert_Fitness_Posts_one(object: { content: $content }) {
                id
              }
            }
          `,
          variables: {
            content: addnewPostx,
          },
        });
        this.$apollo.queries.Fitness_Posts.refetch();
        this.addnewPostx = "";
      } catch (error) {
        console.log(error);
      }
    },
  },
  // mounted () {
  //   const el = document.getElementById('sensor');
  //   const elementWatcher = scrollMonitor.create(el);
  //   elementWatcher.enterViewport(() => {
  //     if (this.Fitness_Posts)  {
  //       this.fetchMore();
  //     }
  //   });
  // },

  created() {
    this.$watch(() => {
      console.log(this.Fitness_Posts);
    });
  },
};
</script>

<style scoped>
.btn-new-post {
  position: fixed;
  bottom: 5%;
  right: 30px;
  z-index: 99;
}

body.modal-open > :not(.modal) {
  filter: blur(1px);
}
.commentx {
  height: 300px; /* Just for the demo          */
  overflow-y: auto; /* Trigger vertical scroll    */
  overflow-x: hidden; /* Hide the horizontal scroll */
}
</style>

