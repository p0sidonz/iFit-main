<template>
  <b-row>

    <b-col md="12">
      <b-card-group deck>

        <!-- card image top -->
        <b-card
            v-for="data in Fitness_Posts"
            :key="data.id"
            :img-src="data.photo"
            :src="data.id"
          img-top
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
                <b-link
                  class="text-body text-nowrap"
                  :to="{ name: 'postid', params: { post_id: data.id } }"
                  v-if="data.comments_aggregate.aggregate.count > 2"
                >
                  <feather-icon
                    icon="MessageSquareIcon"
                    size="18"
                    class="profile-icon mr-50"
                  />

                  <span class="text-muted mr-1"> View Comments</span>
                </b-link>

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
</template>


<script>
import {
  BAvatar,
  BCard,
  BCardText,
  BImg,
  BLink,
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
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { kFormatter } from "@core/utils/filter";
import BCardCode from "@core/components/b-card-code";
import gql from "graphql-tag";
import { DELETE_POST_BY_ID, GET_POST } from "@/queries/";
import profileBottom from "./profileBottom.vue";

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
  },

  apollo: {
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
