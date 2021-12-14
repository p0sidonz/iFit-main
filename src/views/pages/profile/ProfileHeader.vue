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
        {{ headerData.fullname }}
        <b-badge
          v-if="headerData.role === 'trainer'"
          class="profile-badge"
          variant="light-primary"
        >
          {{ headerData.role.toUpperCase() }}
        </b-badge>
      </h3>
      {{ headerData.about || "No bio" }} <br /><br />

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
        @click="unFollowUser(headerData.id)"
        v-if="headerData.is_follow && userInfo.username != currentUsername"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="flat-danger"
        size="sm"
      >
        <feather-icon icon="UserMinusIcon" class="mr-50" />
        <span class="align-middle">Unfollow</span>
      </b-button>
      <b-button
        @click="followUser(headerData.id, headerData.username)"
        v-if="!headerData.is_follow && userInfo.username != currentUsername"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="flat-primary"
        size="sm"
      >
        <feather-icon icon="UserPlusIcon" class="mr-50" />
        <span class="align-middle">Follow</span>
      </b-button>

      <b-button
        v-if="headerData.is_applied && userInfo.username != currentUsername"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="flat-success"
        size="sm"
      >
        <feather-icon icon="ArrowUpCircleIcon" class="mr-50" />
        <span class="align-middle">Already applied</span>
      </b-button>

      <b-button
        v-if="
          !headerData.is_applied &&
          userInfo.username != currentUsername &&
          headerData.role === 'trainer'
        "
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="flat-success"
        size="sm"
        @click="getPackages(headerData.id)"
      >
        <feather-icon icon="ArrowUpCircleIcon" class="mr-50" />
        <span class="align-middle">Apply for training</span>
      </b-button>

      <hr class="mb-2" />

      <div class="d-flex justify-content-between align-items-center">
        <div class="cursor-pointer" @click="showFollowers(headerData.id)">
          <h6 class="text-muted font-weight-bolder">Followers</h6>
          <h3 class="mb-0">
            {{ headerData.Following_aggregate.aggregate.count }}
          </h3>
        </div>
        <div class="cursor-pointer" @click="showFollowing(headerData.id)">
          <h6 class="text-muted font-weight-bolder">Following</h6>
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
        id="following"
        size="sm"
        centered
        hide-footer
        v-model="showFollowingModal"
        scrollable:false
        title="Following"
      >
        <div v-if="isLoading">
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
                    {{ data.myfollowersObj.username }}
                  </h6>
                  <small class="text-muted">
                    {{ data.myfollowersObj.fullname }}</small
                  >
                </b-link>
              </div>
              <b-button
                v-if="
                  data.myfollowersObj.is_follow &
                  (userInfo.username === currentUsername)
                "
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="flat-danger"
                class="btn-icon ml-auto"
                size="default"
                @click="
                  unFollowUser(
                    data.myfollowersObj.id,
                    index,
                    data.myfollowersObj.id
                  )
                "
              >
                Unfollow
              </b-button>
              <b-button
                v-if="
                  userInfo.username != currentUsername &&
                  userInfo.username != data.myfollowersObj.username
                "
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="flat-primary"
                class="btn-icon ml-auto"
                size="default"
                @click="followUser(data.myfollowersObj.id)"
              >
                <feather-icon icon="UserPlusIcon" class="mr-50" />

                Follow
              </b-button>
            </div>
          </div>
        </div>
        <div v-else><b-spinner label="Loading..." /></div>
      </b-modal>

      <b-modal
        id="followers"
        size="sm"
        centered
        hide-footer
        v-model="showFollowerModal"
        scrollable:false
        title="Followers"
      >
        <div v-if="isLoading">
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
                    {{ data.myfollowingObj.username }}
                  </h6>
                  <small class="text-muted">
                    {{ data.myfollowingObj.fullname }}</small
                  >
                </b-link>
              </div>
              <b-button
                v-if="userInfo.username === currentUsername"
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="flat-primary"
                class="btn-icon ml-auto"
                size="default"
                @click="test()"
              >
                Remove
              </b-button>

              <b-button
                v-if="
                  userInfo.username != currentUsername &&
                  userInfo.username != data.myfollowingObj.username
                "
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="flat-primary"
                class="btn-icon ml-auto"
                size="default"
                @click="test()"
              >
                Follow
              </b-button>
            </div>
          </div>

          <div v-else>
            <span>Such emptiness </span>
          </div>
        </div>
        <div v-else><b-spinner label="Loading..." /></div>
      </b-modal>

      <b-modal
        id="packages"
        size="lg"
        centered
        hide-footer
        v-model="showPackagesModal"
        scrollable:true
        title="Packages"
      >
        <div v-if="packagesList.length">
          <div v-if="packagesList.length">
            <b-card
              v-for="packages in packagesList"
              :key="packages.id"
              class="card-apply-job"
            >
              <b-card-header class="pb-1">
                <b-media no-body>
                  <b-media-aside class="mr-1">
                    <b-avatar size="42" :src="packages.User.avatar" />
                  </b-media-aside>
                  <b-media-body>
                    <h5 class="mb-0">{{ packages.User.fullname }}</h5>
                    <small class="text-muted">
                      <span>{{
                        packages.created_at | moment("MMMM Do YYYY")
                      }}</span>
                    </small>
                  </b-media-body>
                </b-media>
              </b-card-header>
              <b-card-body>
                <h5 class="apply-job-title">
                  {{ packages.title }}
                </h5>
                <b-card-text class="mb-2">
                  <div class="blog-content" v-html="packages.description" />
                </b-card-text>

                <!-- payment  -->
                <div class="apply-job-package bg-light-primary rounded">
                  <div>
                    <sup class="text-body">
                      <small v-if="packages.currency === '$ US Dollar'"
                        >$</small
                      >
                      <small v-if="packages.currency === '₹ INR'">₹</small>
                    </sup>
                    <h2 class="d-inline mr-25">{{ packages.amount }}</h2>
                    <sub class="text-body"
                      ><small
                        >/ {{ packages.subscription_days }} days</small
                      ></sub
                    >
                  </div>
                </div>
                <!--/ payment  -->
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  block
                  variant="primary"
                  @click="applyForPackage"
                >
                  Apply For This Package
                </b-button>
              </b-card-body>
            </b-card>
          </div>
        </div>
        <div v-else>No packages...</div>
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
  BCardText,
  BMediaBody,
  BMediaAside,
  BMedia,
  BCardHeader,
  BCardBody,
  BSpinner
} from "bootstrap-vue";
import { toRefs } from "@vue/composition-api";
import { ref, watch } from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import {
  GET_FOLLOWERS,
  GET_FOLLOWINGS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  GET_PACKAGES,
} from "@/queries/";

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
    BCardText,
    BMediaBody,
    BMediaAside,
    BMedia,
    BCardHeader,
    BCardBody,
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
      packagesList: [],
      showPackagesModal: false,
      isLoading: false,
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
    async applyForPackage() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: "Oops!",
          icon: "BellIcon",
          variant: "danger",
          text: "Unfortunately, this feature is currently unavailable  ",
        },
      });
    },

    async getPackages(id) {
      console.log("checking...");
      this.showPackagesModal = true;
      try {
        const data = await this.$apollo.query({
          query: GET_PACKAGES,
          variables: {
            user_id: id,
          },
        });
        this.packagesList = data.data.Fitness_trainer_package;
        console.log(this.packagesList);
      } catch (error) {
        console.log(error);
      }
    },

    async showFollowing(id) {
      this.isLoading = true;
  
      this.showFollowingModal = true;
      try {
        const data = await this.$apollo.query({
          query: GET_FOLLOWERS,
          variables: {
            userId: id,
          },
        });
        this.followers = data.data.Fitness_Follow;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;

        console.log(error);
      }
    },

    async showFollowers(id) {
      this.isLoading = true;
      this.showFollowerModal = true;
      try {
        const data = await this.$apollo.query({
          query: GET_FOLLOWINGS,
          variables: {
            userId: id,
          },
        });
        this.followings = data.data.Fitness_Follow;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },

    async followUser(id, username) {
      try {
        const data = await this.$apollo.mutate({
          mutation: FOLLOW_USER,
          variables: {
            followingId: id,
          },
        });

        if (data.data.insert_Fitness_Follow_one.follower_id) {
          this.headerData.is_follow = true;
          this.headerData.Following_aggregate.aggregate.count =
            this.headerData.Following_aggregate.aggregate.count = +1;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async unFollowUser(id, index) {
      try {
        const data = await this.$apollo.mutate({
          mutation: UNFOLLOW_USER,
          variables: {
            following_id: id,
          },
        });

        if (data.data.delete_Fitness_Follow.affected_rows) {
          console.log("Unfollowed");
          this.headerData.is_follow = false;

          if (index) {
            this.followers[index].myfollowersObj.is_follow = false;
          }
        }
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
