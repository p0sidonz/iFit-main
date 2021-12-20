<template>
  <b-card>
    <b-row>
      <!-- User Info: Left col -->
      <b-col
        cols="21"
        xl="6"
        class="d-flex justify-content-between flex-column"
      >
        <!-- User Avatar & Action Buttons -->
        <div class="d-flex justify-content-start">
          <b-avatar
            :src="userData.User.avatar"
            :text="avatarText(userData.fullname)"
            :variant="`light-${resolveUserRoleVariant(userData.User.role)}`"
            size="104px"
            rounded
          />
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h4 class="mb-0">
                {{ userData.User.fullname }}

                <b-button
                  @click="unFollowUser(userData.User.id)"
                  v-if="userData.User.is_follow"
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="flat-danger"
                  size="sm"
                >
                  <feather-icon icon="UserMinusIcon" class="mr-50" />
                  <span class="align-middle">Unfollow</span>
                </b-button>

                <b-button
                  @click="followUser(userData.User.id)"
                  v-if="!userData.User.is_follow"
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="flat-primary"
                  size="sm"
                >
                  <feather-icon icon="UserPlusIcon" class="mr-50" />
                  <span class="align-middle">Follow</span>
                </b-button>
              </h4>
              <span class="card-text">{{ userData.User.email }}</span>
            </div>
            <br />
            <div class="d-flex flex-wrap">
              <b-button
                :to="{
                  name: 'profile',
                  params: { username: userData.User.username },
                }"
                variant="primary"
              >
                Visit Profile
              </b-button>
              <b-button
                variant="outline-success"
                class="ml-1"
                :to="{
                  name: 'apps-users-edit',
                  params: { id: userData.User.id },
                }"
              >
                Chat
              </b-button>
            </div>
          </div>
        </div>

        <!-- User Stats -->
        <div class="d-flex align-items-center mt-2">
          <div class="d-flex align-items-center mr-2">
            <b-avatar variant="light-primary" rounded>
              <feather-icon icon="FolderPlusIcon" size="18" />
            </b-avatar>
            <div class="ml-1 cursor-pointer" @click="healthInfo(userData.id)">
              <small>View Health issues</small>
            </div>
          </div>

          <!-- <div class="d-flex align-items-center">
            <b-avatar variant="light-success" rounded>
              <feather-icon icon="TrendingUpIcon" size="18" />
            </b-avatar>
            <div class="ml-1">
              <h5 class="mb-0">$99.87k</h5>
              <small>Annual Profit</small>
            </div>
          </div> -->
        </div>
      </b-col>

      <!-- Right Col: Table -->
      <b-col cols="12" xl="6">
        <table class="mt-2 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon icon="UserIcon" class="mr-75" />
              <span class="font-weight-bold">Username</span>
            </th>
            <td class="pb-50">
              {{ userData.User.username }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="CheckIcon" class="mr-75" />
              <span class="font-weight-bold">Status</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ userData.User.status }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="StarIcon" class="mr-75" />
              <span class="font-weight-bold">Role</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ userData.User.role || "Not" }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="FlagIcon" class="mr-75" />
              <span class="font-weight-bold">Country</span>
            </th>
            <td class="pb-50">
              {{ userData.User.country || "Not" }}
            </td>
          </tr>
          <tr>
            <th>
              <feather-icon icon="PhoneIcon" class="mr-75" />
              <span class="font-weight-bold">Contact</span>
            </th>
            <td>
              {{ userData.User.phonenumber || "Not" }}
            </td>
          </tr>
        </table>
      </b-col>
    </b-row>

    <b-modal
      id="medical-modal"
      size="lg"
      centered
      hide-footer
      v-model="showHealthModal"
      scrollable:false
      title="Medical Information of the User"
    >
      <div v-if="healthData.additional_profile_detail">
        <b-row>
          <b-col cols="12" class="mb-2">
            <h5 class="mb-0">Medical Issues</h5>

          </b-col>
          <b-col md="6">
            <b-form-group
              label="You have any heart condition such as High/Low BP?"
              label-for="heart"
            >
              <b-form-radio
                v-model="healthData.additional_profile_detail.heart_condition"
                name="heart"
                value="false"
                disabled
              >
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.heart_condition"
                name="heart"
                value="true"
                stacked
                disabled
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
              disabled
              v-model="healthData.additional_profile_detail.have_vertigo" name="Vertigo" value="false">
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.have_vertigo"
                name="Vertigo"
                value="true"
                stacked
                disabled
              >
                YES
              </b-form-radio>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Are you asthmatic?" label-for="asthmatic">
              <b-form-radio
                v-model="healthData.additional_profile_detail.have_asthma"
                name="asthmatic"
                value="false"
                disabled
              >
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.have_asthma"
                name="asthmatic"
                value="true"
                disabled
                stacked
              >
                YES
              </b-form-radio>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Are you Diabetic? " label-for="Diabetic">
              <b-form-radio
                v-model="healthData.additional_profile_detail.have_diabetes"
                name="Diabetic"
                disabled
                value="false"
              >
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.have_diabetes"
                name="Diabetic"
                value="true"
                disabled
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
                v-model="healthData.additional_profile_detail.have_joint_issue"
                name="joints"
                disabled
                value="false"
              >
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.have_joint_issue"
                name="joints"
                disabled
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
              disabled
              v-model="healthData.additional_profile_detail.is_injured" name="injury" value="false">
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.is_injured"
                name="injury"
                value="true"
                disabled
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
                v-model="healthData.additional_profile_detail.on_medication"
                name="medication"
                disabled
                value="false"
              >
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.on_medication"
                name="medication"
                value="true"
                stacked
                disabled
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
              disabled
               v-model="healthData.additional_profile_detail.giveup_alchol" name="Alchol" value="false">
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.giveup_alchol"
                disabled
                name="Alchol"
                value="true"
                stacked
              >
                YES
              </b-form-radio>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <!-- <b-form-group
              label="Are you pregnent or  gave birth in last 8 weeks?"
              label-for="pregnent"
            >
              <b-form-radio v-model="is_pregnant" name="pregnent" value="false">
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
            </b-form-group> -->

            <b-form-group label="You have epilepsy?" label-for="have_epilepsy">
              <b-form-radio
                v-model="healthData.additional_profile_detail.have_epilepsy"
                name="have_epilepsy"
                value="false"

                disabled
              >
                No
              </b-form-radio>

              <b-form-radio
                v-model="healthData.additional_profile_detail.have_epilepsy"
                name="have_epilepsy"
                value="true"
                disabled
                stacked
              >
                YES
              </b-form-radio>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
import {
  BCard,
  BButton,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BForm,
  BFormTextarea,
  BFormCheckbox,
  BFormRadio,
  BFormTags,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import useUsersList from "../users-list/useUsersList";
import gql from "graphql-tag";
import Ripple from "vue-ripple-directive";

import { FOLLOW_USER, UNFOLLOW_USER, GET_MEDICAL_INFO } from "@/queries/";

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BForm,
    BFormTextarea,
    BFormCheckbox,
    BFormRadio,
    BFormTags,
  },

  directives: {
    Ripple,
  },

  data() {
    return {
      showHealthModal: false,
      healthData: {},
    };
  },

  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ViewHealhIssues(id) {
      console.log("ViewHealthIssues");
    },
    async healthInfo(id) {
      this.showHealthModal = true;

      const data = await this.$apollo.query({
        query: GET_MEDICAL_INFO,
        variables: {
          id: id,
        },
      });

      if (data.data.Fitness_UserRelation_by_pk) {
        this.healthData = data.data.Fitness_UserRelation_by_pk;
      } else {
        console.log("Sorry!");
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
          this.userData.User.is_follow = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async unFollowUser(id) {
      try {
        const data = await this.$apollo.mutate({
          mutation: UNFOLLOW_USER,
          variables: {
            following_id: id,
          },
        });

        if (data.data.delete_Fitness_Follow.affected_rows) {
          this.userData.User.is_follow = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  setup() {
    const { resolveUserRoleVariant } = useUsersList();
    return {
      avatarText,
      resolveUserRoleVariant,
    };
  },
};
</script>

<style>
</style>
