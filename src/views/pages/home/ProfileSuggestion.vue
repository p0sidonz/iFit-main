<template>
  <b-card>
    <h5>Suggestions</h5>

    <!-- user suggestion  -->
    <div
      v-for="(data, index) in Fitness_User"
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
      >
        Unfollow
        <feather-icon icon="UserPlusIcon" />
      </b-button>
    </div>
    <!--/ user suggestion  -->
  </b-card>
</template>

<script>
import { BCard, BAvatar, BButton } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import { GET_NEW_USERS } from "../../../queries/index";
export default {
  components: {
    BCard,
    BAvatar,
    BButton,
  },
  directives: {
    Ripple,
  },

  apollo: {
    Fitness_User: {
      query: GET_NEW_USERS,
    },
  },

  data() {
    return {
      suggestions: [],
    };
  },
  // props: {
  //   suggestions: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
};
</script>
