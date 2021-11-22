<template>
  <div>
    <b-card
      v-if="headerData"
      img-alt="Profile Cover Photo"
      img-top
      class="card-profile"
    >
      <div class="profile-image-wrapper">
        <div class="profile-image p-0">
          <b-avatar size="114" variant="light" :src="headerData.avatar" />
        </div>
      </div>
      <h3>
        {{ headerData.fullname }} |
        <b-badge class="profile-badge" variant="light-primary">
          Trainer
        </b-badge>
      </h3>
      {{ headerData.about }} <br /><br />
      <b-button
        v-if="userInfo.username === currentUsername"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
        size="sm"
      >
        <feather-icon icon="EditIcon" class="mr-50" />
        <span class="align-middle">Edit Profile</span>
      </b-button>
      <b-button
        v-else
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
        size="sm"
      >
        <feather-icon icon="UserPlusIcon" class="mr-50" />
        <span class="align-middle">Follow</span>
      </b-button>

      <hr class="mb-2" />

      <div class="d-flex justify-content-between align-items-center">
        <div class="cursor-pointer" @click="showFollowers(headerData.id)">
          <h6 class="text-muted font-weight-bolder">Following</h6>
          <h3 class="mb-0">
            {{ headerData.Following_aggregate.aggregate.count }}
          </h3>
        </div>
        <div class="cursor-pointer" @click="showFollowing(headerData.id)">
          <h6 class="text-muted font-weight-bolder">Followers</h6>
          <h3 class="mb-0">
            {{ headerData.Follow_aggregate.aggregate.count }}
          </h3>
        </div>
        <div>
          <h6 class="text-muted font-weight-bolder">Posts</h6>
          <h3 class="mb-0">{{ headerData.Posts_aggregate.aggregate.count }}</h3>
        </div>
      </div>

      <b-modal
        id="followers"
        size="sm"
        centered
        hide-footer
        v-model="showFollowingModal"
        scrollable:false
        title="Followers"
      >
        <div v-if="followers">
          <div
            v-for="(data, index) in followers"
            :key="data.id"
            class="d-flex justify-content-start align-items-center"
            :class="index == 0 ? 'mt-2' : 'mt-1'"
          >
            <b-avatar
              :src="data.myfollowersObj.avatar"
              class="mr-50"
              size="40"
            />
            <div class="user-page-info">
              <b-link
                :to="{
                  name: 'profile',
                  params: { username: data.myfollowersObj.username },
                }"
              >
                <h6 class="mb-0">
                  {{ data.myfollowersObj.fullname }}
                </h6>
                <small class="text-muted"></small>
              </b-link>
            </div>
            <b-button
            v-if="!data.myfollowersObj.is_follow & userInfo.username === currentUsername"
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="primary"
              class="btn-icon ml-auto"
              size="sm"
              @click="test()"
            >
              Remove
            </b-button>
          </div>
        </div>


      </b-modal>

      <b-modal
        id="following"
        size="sm"
        centered
        hide-footer
        v-model="showFollowerModal"
        scrollable:false
        title="Following"
      >
        <div v-if="followings">
          <div
            v-for="(data, index) in followings"
            :key="data.id"
            class="d-flex justify-content-start align-items-center"
            :class="index == 0 ? 'mt-2' : 'mt-1'"
          >
            <b-avatar
              :src="data.myfollowingObj.avatar"
              class="mr-50"
              size="40"
            />
            <div class="user-page-info">
                            <b-link
                :to="{
                  name: 'profile',
                  params: { username: data.myfollowingObj.username },
                }"
              >

              <h6 class="mb-0">
                {{ data.myfollowingObj.fullname }}
              </h6>
              <small class="text-muted"></small>
                            </b-link>
            </div>
            <b-button
            v-if="data.myfollowingObj.is_follow"
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="primary"
              class="btn-icon ml-auto"
              size="sm"
              @click="test()"
            >
              UnFollow
            </b-button>
          </div>
        </div>

        <div v-else>
          <span>Such emptiness </span>
        </div>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BImg,
  BNavbar,
  BNavbarToggle,
  BCollapse,
  BTabs,
  BNavItem,
  BButton,
  BAvatar,
  BBadge,
  BLink,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import { GET_FOLLOWERS, GET_FOLLOWINGS } from "@/queries/";
import { BSpinner } from "bootstrap-vue";

export default {
  components: {
    BCard,
    BTabs,
    BButton,
    BNavItem,
    BNavbar,
    BNavbarToggle,
    BCollapse,
    BImg,
    BAvatar,
    BBadge,
    BLink,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      temp: null,
      currentUsername: this.$route.params.username,
      applyData: {
        traineeId: null,
        trainerId: null,
      },
      showFollowingModal: false,
      showFollowerModal: false,
      followers: null,
      followings: null,
    };
  },

  props: {
    headerData: {
      type: Object,
      default: () => {},
    },
  },
  //   created() {
  //   const { temp } = this.$route.params
  //   console.log(temp)

  // },

  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },

  methods: {
    async showFollowing(id) {
      this.showFollowingModal = true;
      try {
        const data = await this.$apollo.query({
          query: GET_FOLLOWERS,
          variables: {
            userId: id,
          },
        });
        this.followers = data.data.Fitness_Follow;
      } catch (error) {
        console.log(error);
      }
    },

    async showFollowers(id) {
      this.showFollowerModal = true;
      try {
        const data = await this.$apollo.query({
          query: GET_FOLLOWINGS,
          variables: {
            userId: id,
          },
        });
        this.followings = data.data.Fitness_Follow;
      } catch (error) {
        console.log(error);
      }
    },

    // async applyForTraning() {
    //   console.log(this.userInfo)
    //   if (this.headerData.isTrainer & this.userInfo.role === "USER") {
    //     this.applyData.trainerId = this.headerData.id;
    //     this.applyData.traineeId = this.userInfo.id;
    //   }
    //   try {
    //     const res = await this.$apollo.mutate({
    //       mutation: gql`
    //         mutation createUserRelation($trainerId: Int!, $traineeId: Int!) {
    //           createUserRelation(trainerId: $trainerId, traineeId: $traineeId) {
    //             ok
    //             error
    //           }
    //         }
    //       `,
    //       variables: {
    //         trainerId: this.applyData.trainerId,
    //         traineeId: this.applyData.traineeId,
    //       },
    //     });
    //     console.log("ok Boss!");
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
};
</script>
