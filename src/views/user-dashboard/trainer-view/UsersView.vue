<template>
  <div>
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="userData === undefined">
      <h4 class="alert-heading">Error fetching user data</h4>
      <div class="alert-body">
        No user found with this user id. Check
        <b-link class="alert-link" :to="{ name: 'apps-users-list' }">
          User List
        </b-link>
        for other users.
      </div>
    </b-alert>

    <template>
      <div v-if="userData">
        <div v-if="userData.additional_profile_detail">
          <!-- First Row -->
          <b-row>
            <b-col cols="12" xl="9" lg="8" md="7">
              <user-view-user-info-card
                :user-data="userData.TrainerByUserId[0]"
              />
            </b-col>
            <b-col cols="12" md="5" xl="3" lg="4">
              <user-view-user-plan-card
                :plan-data="userData.user_subscriptions"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="12" lg="6">
              <user-view-program-card :user-data="userData" />
            </b-col>
            <b-col cols="12" lg="6">
              <user-view-user-permissions-card :user-data="userData" />
            </b-col>
            <b-col cols="12" lg="6">
              <user-view-user-timeline-card />
            </b-col>
            <b-col cols="12" lg="6">
              <user-subscription-card :plan-data="userData" />
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <b-modal
            id="modal-xs"
            hide-header-close
            no-close-on-backdrop
            hide-footer
            v-model="modalView"
            size="lg"
            title="Let's complete your profile first (All fields are required)"
          >
            <div>
              <form-wizard
                color="#7367F0"
                :title="null"
                :subtitle="null"
                layout="vertical"
                finish-button-text="Submit"
                back-button-text="Previous"
                class="wizard-vertical mb-2"
                @on-complete="popWizardForm"
              >
                <!-- account datails tab -->
                <tab-content title="Medical Issues">
                  <b-row>
                    <b-col cols="12" class="mb-2">
                      <h5 class="mb-0">Medical Issues</h5>

                      <small class="text-muted">
                        Enter select the appropirate
                      </small>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="You have any heart condition such as High/Low BP?"
                        label-for="heart"
                      >
                        <b-form-radio
                          v-model="heart_condition"
                          name="heart"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="heart_condition"
                          name="heart"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Do you feel dizzy or have symptoms of Vertigo?"
                        label-for="Vertigo"
                      >
                        <b-form-radio
                          v-model="have_vertigo"
                          name="Vertigo"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="have_vertigo"
                          name="Vertigo"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Are you asthmatic?"
                        label-for="asthmatic"
                      >
                        <b-form-radio
                          v-model="have_asthma"
                          name="asthmatic"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="have_asthma"
                          name="asthmatic"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Are you Diabetic? "
                        label-for="Diabetic"
                      >
                        <b-form-radio
                          v-model="have_diabetes"
                          name="Diabetic"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="have_diabetes"
                          name="Diabetic"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Do you have issues on your joints?"
                        label-for="joints"
                      >
                        <b-form-radio
                          v-model="have_joint_issue"
                          name="joints"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="have_joint_issue"
                          name="joints"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Are you suffering from any injury?"
                        label-for="injury"
                      >
                        <b-form-radio
                          v-model="is_injured"
                          name="injury"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="is_injured"
                          name="injury"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Are you taking any medication?"
                        label-for="medication"
                      >
                        <b-form-radio
                          v-model="on_medication"
                          name="medication"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="on_medication"
                          name="medication"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="You willing to give up Alchol?"
                        label-for="Alchol"
                      >
                        <b-form-radio
                          v-model="giveup_alchol"
                          name="Alchol"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="giveup_alchol"
                          name="Alchol"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>

                    <b-col md="6">
                       <b-form-group
                        label="You have epilepsy?"
                        label-for="have_epilepsy"
                      >
                        <b-form-radio
                          v-model="have_epilepsy"
                          name="have_epilepsy"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="have_epilepsy"
                          name="have_epilepsy"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>
                    </b-col>



                    <b-col md="6" v-if="userData.User.gender === 'female'">
                      <b-form-group
                        label="Are you pregnent or  gave birth in last 8 weeks?"
                        label-for="pregnent"
                      >
                        <b-form-radio
                          v-model="is_pregnant"
                          name="pregnent"
                          value="false"
                        >
                          No
                        </b-form-radio>

                        <b-form-radio
                          v-model="is_pregnant"
                          name="pregnent"
                          value="true"
                          stacked
                        >
                          YES
                        </b-form-radio>
                      </b-form-group>

                     
                    </b-col>
                  </b-row>
                </tab-content>
                <!-- personal info tab -->
                <tab-content title="Allergies">
                  <b-row>
                    <b-col cols="12" class="mb-2">
                      <h5 class="mb-0">
                        Tell us if you are allergitic to any food.
                      </h5>
                      <small class="text-muted"
                        >Move forward if you have don't have allergy</small
                      >
                    </b-col>
                    <b-col md="12">
                      <b-form-group label="Food Name" label-for="allergitic">
                        <b-form-tags
                          v-model="allergies"
                          input-id="allergitic"
                          class="mb-3"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </tab-content>

                <!-- address -->
                <tab-content title="Expections">
                  <b-row>
                    <b-col cols="12" class="mb-2">
                      <h5 class="mb-0">Tell us more about your self.</h5>
                    </b-col>
                    <b-col md="12">
                      <b-form-group label="Tell us " label-for="tell_us_more">
                        <b-form-textarea
                          v-model="tell_us_more"
                          id="tell_us_more"
                          placeholder="Yes, Go On!"
                          rows="5"
                        />
                      </b-form-group>
                    </b-col>

                    <b-col md="12">
                      <b-form-group label="What is your goal?" label-for="goal">
                        <b-form-textarea
                          v-model="current_goal"
                          id="goal"
                          placeholder="I want to be superman! "
                          rows="5"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </tab-content>

                <!-- social link -->
                <tab-content title="Social Links">
                  <b-row>
                    <b-col cols="12" class="mb-2">
                      <h5 class="mb-0">Social Links</h5>
                      <small class="text-muted">Enter Your Social Links</small>
                    </b-col>
                    <b-col md="6">
                      <b-form-group label="Instagram" label-for="v-instagram">
                        <b-form-input
                          v-model="instagram_id"
                          id="v-instagram"
                          placeholder="https://instagram.com/abc"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group label="Facebook" label-for="v-facebook">
                        <b-form-input
                          v-model="facebook_id"
                          id="v-facebook"
                          placeholder="https://facebook.com/abc"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </tab-content>
              </form-wizard>
            </div>
          </b-modal>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
import { ref, onUnmounted } from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import {
  BRow,
  BCol,
  BAlert,
  BLink,
  BCardTitle,
  BCardBody,
  BDropdown,
  BDropdownItem,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BForm,
  BFormTextarea,
  BFormCheckbox,
  BFormRadio,
  BFormTags,
} from "bootstrap-vue";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { codeIcon } from "./code";

import userStoreModule from "../userStoreModule";
import UserViewUserInfoCard from "./UserViewUserInfoCard.vue";
import UserViewUserPlanCard from "./UserViewUserPlanCard.vue";
import UserViewUserTimelineCard from "./UserViewUserTimelineCard.vue";
import UserViewUserPermissionsCard from "./UserViewUserPermissionsCard.vue";
import UserViewProgramCard from "./UserViewProgramCard.vue";
import UserSubscriptionCard from "./UserSubscriptionCard.vue";
import { FormWizard, TabContent } from "vue-form-wizard";
import vSelect from "vue-select";
import { CREATE_ADDITIONAL_DETAILS, IS_COMPLETED } from "@/queries/";

import gql from "graphql-tag";
export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    BCardTitle,
    BCardBody,
    BDropdown,
    BDropdownItem,

    // Local Components
    UserViewUserInfoCard,
    UserViewUserPlanCard,
    UserViewUserTimelineCard,
    UserViewUserPermissionsCard,
    UserViewProgramCard,
    UserSubscriptionCard,

    //form wizard
    FormWizard,
    TabContent,
    vSelect,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BForm,
    BFormTextarea,
    BFormCheckbox,
    BFormRadio,
    BFormTags,
  },

  data() {
    return {
      modalView: this.is_profile_completed.value != 0,
      heart_condition: null,
      have_vertigo: null,
      have_asthma: null,
      have_diabetes: null,
      have_joint_issue: null,
      is_injured: null,
      on_medication: null,
      giveup_alchol: null,
      is_pregnant: null,
      allergies: null,
      tell_us_more: null,
      instagram_id: null,
      facebook_id: null,
      current_goal: null,
      have_epilepsy: null,
    };
  },

  methods: {
    async popWizardForm() {


      if (
        this.heart_condition === null ||
        this.have_vertigo === null ||
        this.have_asthma === null ||
        this.have_diabetes === null ||
        this.have_joint_issue === null ||
        this.is_injured === null ||
        this.on_medication === null ||
        this.giveup_alchol === null ||
        this.tell_us_more === null ||
        this.current_goal === null
      ) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Keep clam and fill the required fields.",
            icon: "cross",
            variant: "danger",
          },
        });
      } else {
        try {


          const data = await this.$apollo.mutate({
            mutation: CREATE_ADDITIONAL_DETAILS,
            variables: {
              heart_condition: this.heart_condition,
              have_vertigo: this.have_vertigo,
              have_asthma: this.have_asthma,
              have_diabetes: this.have_diabetes,
              have_joint_issue: this.have_joint_issue,
              is_injured: this.is_injured,
              on_medication: this.on_medication,
              giveup_alchol: this.giveup_alchol,
              is_pregnant: this.is_pregnant,
              allergies: this.allergies,
              tell_us_more: this.tell_us_more,
              instagram_id: this.instagram_id,
              facebook_id: this.facebook_id,
              current_goal: this.current_goal,
              relationship_id: this.userData.id,
              have_epilepsy: this.have_epilepsy,
              profile_completed: true,
            },
          });
          if (data.data.insert_Fitness_additional_profile_detail_one.id) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Sweet!",
                icon: "cross",
                variant: "success",
              },
            });
                        location.reload();

          }
          // if (data.data.insert_Fitness_additional_profile_detail_one.id) {
          //   const completed = await this.$apollo.mutate({
          //     mutation: IS_COMPLETED,
          //     variables: {
          //       profile_completed: true,
          //     },
          //   });

          //   if (
          //     completed.data.data.insert_Fitness_additional_profile_detail_one
          //       .profile_completed
          //   ) {
          //     this.$toast({
          //       component: ToastificationContent,
          //       props: {
          //         title: "Sweet!",
          //         icon: "cross",
          //         variant: "success",
          //       },
          //     });
          //   }
          // }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  setup() {
    const userData = ref(null);
    const is_profile_completed = ref(false);
    const USER_APP_STORE_MODULE_NAME = "app-user";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-user/fetchUser", { id: router.currentRoute.params.id })
      .then((response) => {
        console.log("VIEW", response.data),
          (userData.value = response.data.data.Fitness_UserRelation_by_pk);
        is_profile_completed = userData.value.additional_profile_details.length;
        console.log(is_profile_completed);
      })
      .catch((error) => {
        if (error.response) {
          userData.value = undefined;
        }
      });

    return {
      userData,
      is_profile_completed,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-wizard.scss";
@import "@core/scss/vue/libs/vue-select.scss";
</style>