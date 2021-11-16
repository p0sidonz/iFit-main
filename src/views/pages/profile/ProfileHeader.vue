<template>
  <b-card
    class="profile-header mb-2"
    img-src="https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/demo-1/img/timeline.aa03c008.jpg"
    img-top
    alt="cover photo"
    body-class="p-0"
  >
    <!-- profile picture -->
    <div class="position-relative">
      <div class="profile-img-container d-flex align-items-center">
        <div class="profile-img">
          <b-img
            :src="userInfo.avatar"
            rounded
            fluid
            alt="profile photo"
          />
        </div>
        <!-- profile title -->
        <div class="profile-title ml-3">
          <h2 class="text-white">
            {{ userInfo.username }}
          </h2>
          <p class="text-white">
          </p>
        </div>
        <!--/ profile title -->
      </div>
    </div>
    <!--/ profile picture -->

    <!-- profile navbar -->
    <div class="profile-header-nav">
      <b-navbar toggleable="md" type="light">
        <!-- toggle button -->
        <b-navbar-toggle class="ml-auto" target="nav-text-collapse">
          <feather-icon icon="AlignJustifyIcon" size="21" />
        </b-navbar-toggle>
        <!--/ toggle button -->

        <!-- collapse -->
        <b-collapse id="nav-text-collapse" is-nav>
          <b-tabs pills class="profile-tabs mt-1 mt-md-0" nav-class="mb-0">
            <template #tabs-start>
              <b-nav-item role="presentation" active class="font-weight-bold">
                <span class="d-none d-md-block">Feed</span>
                <feather-icon icon="RssIcon" class="d-block d-md-none" />
              </b-nav-item>
              <b-nav-item role="presentation" class="font-weight-bold">
                <span class="d-none d-md-block">About</span>
                <feather-icon icon="InfoIcon" class="d-block d-md-none" />
              </b-nav-item>
              <b-nav-item role="presentation" class="font-weight-bold">
                <span class="d-none d-md-block">Transormation</span>
                <feather-icon icon="UsersIcon" class="d-block d-md-none" />
              </b-nav-item>
            </template>

            <!-- edit buttons -->
            <!-- <template #tabs-end>
              <b-button
              v-if="headerData.is_trainer"
                class="ml-auto"
                v-b-tooltip.hover
                title="Apply for Training"
                variant="gradient-primary"
              >
                Manage Client
                </b-button>
              <b-button
              v-if="!headerData.is_trainer"
                class="ml-auto"
                v-b-tooltip.hover
                title="Apply for Training"
                variant="gradient-primary"
                :to="{ name: 'trainer-pricing' }"
              >
                Become a trainer
                </b-button>


            </template> -->
            <!-- edit buttons -->

            <!-- edit buttons -->
            <!-- <template #tabs-end>
              <b-button
                v-if="
                  isUserLoggedIn & (userInfo.username === headerData.username)
                "
                variant="primary"
                class="ml-auto"
              >
                <feather-icon icon="EditIcon" class="d-block d-md-none" />
                <span class="font-weight-bold d-none d-md-block">Edit</span>
              </b-button>

              <b-button
                v-if="
                  isUserLoggedIn &
                  (userInfo.username != headerData.username) &
                  headerData.isTrainer
                "
                variant="primary"
                class="ml-auto"
              >
                <feather-icon icon="EditIcon" class="d-block d-md-none" />
                <span
                  class="font-weight-bold d-none d-md-block"
                  @click="applyForTraning"
                  >Apply for training</span
                >
              </b-button>
            </template> -->
            <!-- edit buttons -->
          </b-tabs>
        </b-collapse>
        <!--/ collapse -->
      </b-navbar>
    </div>
    <!--/ profile navbar -->
  </b-card>
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
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";

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
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      temp: null,
      applyData: {
        traineeId: null,
        trainerId: null,
      },
    };
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

  created() {
    console.log(userInfo)
  },

};
</script>
