<template>
  <b-card>
    <h5>Suggestions</h5>
    <b-overlay
      :show="showOverlay"
      spinner-variant="primary"
      spinner-type="grow"
      spinner-small
      opacity="0.0"
      rounded="sm"
    >
      <!-- user suggestion  -->
      <div
        v-for="(data, index) in suggestions"
        :key="data.id"
        class="d-flex justify-content-start align-items-center"
        :class="index == 0 ? 'mt-2' : 'mt-1'"
      >
        <b-avatar :src="data.avatar" class="mr-50" size="40" />
        <div class="user-page-info">
          <h6 class="mb-0">
            <router-link
              :to="{
                name: 'profile',
                params: { username: data.username },
              }"
            >
              {{ data.fullname }}
            </router-link>
          </h6>
        </div>
        <b-button
          v-if="!data.is_follow"
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="flat-primary"
          class="btn-icon ml-auto"
          size="sm"
          @click="followUser(data.id, index)"
        >
          Follow
          <feather-icon icon="UserPlusIcon" />
        </b-button>

        <b-button
          v-else
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="flat-danger"
          class="btn-icon ml-auto"
          size="sm"
          @click="unFollowUser(data.id, index)"
        >
          Unfollow
          <feather-icon icon="UserPlusIcon" />
        </b-button>
      </div>
    </b-overlay>
    <!--/ user suggestion  -->
  </b-card>
</template>

<script>
import { BCard, BAvatar, BButton, BOverlay } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import { FOLLOW_USER, UNFOLLOW_USER, GET_NEW_USERS } from "@/queries/";

export default {
  components: {
    BCard,
    BAvatar,
    BButton,
    BOverlay,
  },
  directives: {
    Ripple,
  },

  apollo: {
    Fitness_User: {
      query: GET_NEW_USERS,
      result(data) {
        this.suggestions = data.data.Fitness_User;
      },
      variables: {
        not: JSON.parse(localStorage.getItem("userInfo")).id,
      },
    },
    // Result hook
  },

  data() {
    return {
      suggestions: [],
      showOverlay: false,
    };
  },

  methods: {
    async followUser(id, index) {
      console.log(id, index);
      this.showOverlay = true;
      try {
        const data = await this.$apollo.mutate({
          mutation: FOLLOW_USER,
          variables: {
            followingId: id,
          },
        });
        this.showOverlay = false;
        if (data.data.insert_Fitness_Follow_one.follower_id) {
          this.suggestions[index].is_follow = true;
        }
      } catch (error) {
        this.showOverlay = false;
        console.log(error);
      }
    },

    async unFollowUser(id, index) {
      this.showOverlay = true;
      try {
        const data = await this.$apollo.mutate({
          mutation: UNFOLLOW_USER,
          variables: {
            following_id: id,
          },
        });
        this.showOverlay = false;
        if (data.data.delete_Fitness_Follow.affected_rows) {
          this.suggestions[index].is_follow = false;
        }
      } catch (error) {
        this.showOverlay = false;
        console.log(error);
      }
    },
  },

  // props: {
  //   suggestions: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
};
</script>
