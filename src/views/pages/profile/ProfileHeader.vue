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
                  @click="modelswitch(packages.title, packages.id)"
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

    <b-modal
      v-model="xshowModal"
      size="lg"
      hide-footer
      no-close-on-backdrop
      lazy
      @hide="doSometing"
    >
      <div v-if="!payment_done">
        <div class="modal-body px-sm-5 mx-30">
          <h1 class="text-center mb-1" id="addNewCardTitle">Billing Detail</h1>
          <!-- <p class="text-center">Add card for future billing</p> -->
        </div>
        <validation-observer v-slot="{ invalid }" ref="refFormObserver">
          <b-form class="p-2" @submit.prevent="onSubmit;">
            <b-row>
              <b-col md="3" xl="3">
                <validation-provider
                  #default="validationContext"
                  name="First Name"
                  rules="required"
                >
                  <b-form-group label="First Name" label-for="v-first-name">
                    <b-form-input
                      id="v-first-name"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                      placeholder="Jon"
                      v-model="billingData.firstName"
                    />

                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>

              <b-col md="3" xl="3">
                <validation-provider
                  #default="validationContext"
                  name="Last Name"
                  rules="required"
                >
                  <b-form-group label="Last Name" label-for="v-last-name">
                    <b-form-input
                      id="v-last-name"
                      placeholder="Doe"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                      v-model="billingData.lastName"
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>

              <b-col md="6" xl="6">
                <validation-provider
                  #default="validationContext"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-group label="Email address" label-for="email">
                    <b-form-input
                      id="email"
                      placeholder="john.doe@gmail.com"
                      v-model="billingData.email"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>

              <b-col cols="12">
                <validation-provider
                  #default="validationContext"
                  name="Address line"
                  rules="required"
                >
                  <b-form-group label="Address line" label-for="v-address-1">
                    <b-form-input
                      id="v-address-1"
                      placeholder="123 New York Street"
                      v-model="billingData.address_line_1"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col cols="6">
                <b-form-group label="Address line 2" label-for="v-address-2">
                  <b-form-input
                    id="v-address-2"
                    v-model="billingData.address_line_2"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6" xl="6">
                <validation-provider
                  #default="validationContext"
                  name="Mobile"
                  rules="required"
                >
                  <b-form-group label="Mobile" label-for="Mobile">
                    <b-form-input
                      id="Mobile"
                      placeholder="7000799192"
                      v-model="billingData.contact"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>

              <b-col md="6" xl="6">
                <validation-provider
                  #default="validationContext"
                  name="City"
                  rules="required"
                >
                  <b-form-group label="City" label-for="v-city">
                    <b-form-input
                      id="v-city"
                      placeholder="NY"
                      v-model="billingData.city"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>

              <b-col md="6" xl="6">
                <validation-provider
                  #default="validationContext"
                  name="Zip Code"
                  rules="required"
                >
                  <b-form-group label="Zip Code" label-for="v-zip">
                    <b-form-input
                      id="v-zip"
                      placeholder="90102"
                      v-model="billingData.zip"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col md="6" xl="6">
                <validation-provider
                  #default="validationContext"
                  name="State"
                  rules="required"
                >
                  <b-form-group label="State" label-for="v-state">
                    <b-form-input
                      id="v-state"
                      placeholder="New York"
                      v-model="billingData.state"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col md="6" xl="6">
                <validation-provider
                  #default="validationContext"
                  name="Country"
                  rules="required"
                >
                  <b-form-group label="Country" label-for="v-country">
                    <b-form-input
                      id="v-country"
                      placeholder="USA"
                      v-model="billingData.country"
                      autofocus
                      :state="getValidationState(validationContext)"
                      trim
                    />
                    <b-form-invalid-feedback>
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>
            </b-row>
          </b-form>
          <div class="d-flex justify-content-center">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="relief-primary"
              :disabled="invalid || disableButton"
              @click="displayRazorPay()"
            >
              Pay
            </b-button>
          </div>
        </validation-observer>
      </div>
      <div v-else>
        <div class="modal-body px-sm-5 mx-30">
          <h1 class="text-center mb-1 text-success" id="addNewCardTitle">
            Success! 🎉
          </h1>
          <p class="text-center">
            Your order number is
            <b-badge pill variant="success">
              {{ success_order_id }}
            </b-badge>
            Keep it for future reference.
          </p>
          <p class="text-center">
            Payment reciept has been sent to your registered email. Click
            <b-badge href="/dashboard" pill variant="light-primary">
              here
            </b-badge>
            to visit the traning dashboard.
          </p>
        </div>
      </div>
    </b-modal>
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
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BForm,
  BRow,
  BCol,
} from "bootstrap-vue";
import { toRefs } from "@vue/composition-api";
import { ref, watch } from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useMutation } from "@vue/apollo-composable";
import axios from "@axios";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import formValidation from "@core/comp-functions/forms/form-validation";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import {
  GET_FOLLOWERS,
  GET_FOLLOWINGS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  GET_PACKAGES,
} from "@/queries/";
import { BSpinner } from "bootstrap-vue";
import { required, email } from "@validations";
import { min, max, numeric } from "vee-validate/dist/rules";

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
    BRow,
    BCol,
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
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BForm,
    ValidationObserver,
    ValidationProvider,
  },
  directives: {
    Ripple,
  },

  mounted() {
    console.log("mounted haha");
    // As an instance method inside a component
    this.$loadScript("https://checkout.razorpay.com/v1/checkout.js")
      .then(() => {
        console.log("RezorPay has been initiated");
      })
      .catch(() => {
        console.log("Failed to fetch script");
      });
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
  setup() {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userData);

    const current_package_id = ref();
    const current_package_name = ref();
    const current_package_description = ref();
    const payment_done = ref(false);
    const xshowModal = ref(false);
    const disableButton = ref(false);
    const success_order_id = ref()
    const billingData = ref({
      email: "sdfhj@gjhds.com",
      firstName: "ankit",
      lastName: "singh",
      address_line_1: "123 fdjfjhdj",
      address_line_2: "null",
      city: "bhopal",
      state: "MP",
      zip: "462021",
      country: "India",
      contact: "8989004426",
    });
    const doSometing = () => {
      console.log("oops i am closed");
      disableButton.value = false;
    };
    const modelswitch = (pkg_name, pkg_id) => {
      current_package_name.value = pkg_name;
      current_package_id.value = pkg_id;
      xshowModal.value = true;
    };

    const { refFormObserver, getValidationState, resetForm, clearForm } =
      formValidation();
    const displayRazorPay = async () => {
      disableButton.value = true;
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      axios
        .post(
          "http://127.0.0.1:8080/v1/graphql",
          {
            query: `
          mutation MyMutation(
            $package_id: Int!

          ) {
            rzrCreateOrderPackage(
              package_id: $package_id

            ) {
              amount
              order_id
              currency
              status
              error
            }
          }
              
              `,
            variables: {
              package_id: current_package_id.value,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: freshTocken,
            },
          }
        )
        .then((response) => {
          console.log(response);

          var options = {
            key: "rzp_test_HpykQ62iu1zvDf",
            amount: response.data.data.rzrCreateOrderPackage.amount,
            currency: response.data.data.rzrCreateOrderPackage.currency,
            name: `Plan type: ${current_package_name.value}`,
            description: "none",
            order_id: response.data.data.rzrCreateOrderPackage.order_id,
            prefill: {
              name:
                billingData.value.firstName + " " + billingData.value.lastName,
              email: billingData.value.email,
              contact: billingData.value.contact,
            },
            handler: function (response) {
              payment_done.value = true;
              success_order_id.value = response.razorpay_order_id;
              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature);
            },

            notify: {
              sms: true,
              email: true,
            },
            notes: {
              packageName: current_package_name.value,
              packageId: current_package_id.value,
              userId: userData.id,
              ...billingData.value,
              ptype: "dXNlcl9hbmRfdHJhaW5lcg==",
            },
            theme: {
              color: "#7367f0",
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      //const
      current_package_id,
      current_package_name,
      current_package_description,
      payment_done,
      xshowModal,
      billingData,
      payment_done,

      //modal
      modelswitch,

      //form validation
      refFormObserver,
      getValidationState,
      displayRazorPay,
      formValidation,
      disableButton,

      doSometing,
      success_order_id
    };
  },
};
</script>
