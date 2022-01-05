<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <div class="text-center">
          <h1>Refer & Earn</h1>

          <p class="text-center mb-5">
            Invite your friend to Fetch.fit , If they sign up and opt for
            upgrade package,
            <br />
            your will get 30% insentive in return! 🥳
          </p>

          <div class="row mb-4">
            <div class="col-12 col-lg-4">
              <div class="d-flex justify-content-center mb-1">
                <div
                  class="
                    modal-refer-earn-step
                    d-flex
                    width-100
                    height-100
                    rounded-circle
                    justify-content-center
                    align-items-center
                    bg-light-primary
                  "
                >
                  <Icon
                    icon="ant-design:message-outlined"
                    style="font-size: 32px"
                  />
                </div>
              </div>
              <div class="text-center">
                <h6 class="fw-bolder mb-1">Send Invitation 🤟🏻</h6>
                <p>Send your referral link to your friend</p>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="d-flex justify-content-center mb-1">
                <div
                  class="
                    modal-refer-earn-step
                    d-flex
                    width-100
                    height-100
                    rounded-circle
                    justify-content-center
                    align-items-center
                    bg-light-primary
                  "
                >
                  <Icon
                    icon="ant-design:api-outlined"
                    style="font-size: 32px"
                  />
                </div>
              </div>
              <div class="text-center">
                <h6 class="fw-bolder mb-1">Registration 👩🏻&zwj;💻</h6>
                <p>Let them register and opt for our services</p>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="d-flex justify-content-center mb-1">
                <div
                  class="
                    modal-refer-earn-step
                    d-flex
                    width-100
                    height-100
                    rounded-circle
                    justify-content-center
                    align-items-center
                    bg-light-primary
                  "
                >
                  <Icon
                    icon="ant-design:dollar-circle-outlined"
                    style="font-size: 32px"
                  />
                </div>
              </div>
              <div class="text-center">
                <h6 class="fw-bolder mb-1">Get Money 💰</h6>
                <p>Your will get earn 30% from the purchase amount.</p>
              </div>
            </div>
          </div>

          <div class="px-sm-5 mx-50">
            <h4 class="fw-bolder mt-4 mb-1">Share the referral link</h4>

            <!-- form input -->
            <!-- input -->
            <b-form-group class="mb-0 mr-1">
              <b-form-input
                :value="`https://dashboard.fetch.fit/register?rid=${username}`"
              />
            </b-form-group>
            <br />
            <!-- button -->
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="primary"
              @click="doCopy"
            >
              Copy!
            </b-button>

            <!-- <form class="row g-1" onsubmit="return false">
              <div class="col-lg-9">
                <label class="form-label" for="modalRnFLink">
                  You can also copy and send it or share it on your social
                  media. 🥳
                </label>
                <div class="input-group input-group-merge">
                  <input
                    type="text"
                    id="modalRnFLink"
                    class="form-control"
                    value="https://1.envato.market/vuexy_admin"
                  />
                  <a
                    href="javascript:void(0)"
                    class="input-group-text"
                    id="basic-addon33"
                    >Copy link</a
                  >
                </div>
              </div>
            </form> -->
          </div>
        </div>
      </b-card-body>
    </b-card>

    <b-card title="Referred History">
      <b-table :fields="fields" :items="items" responsive="sm" show-empty>
        <template #empty="scope">
          <div class="text-center">
            <p>{{ scope.emptyText }}</p>
          </div>
        </template>
        <!-- A virtual column -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <!-- A custom formatted column -->
        <template #cell(username)="data">
          {{ data.item.referredUser.username }}
        </template>

        <template #cell(registerd_date)="data">
          {{ data.item.created_at }}
        </template>

        <template #cell(opted)="data">
          {{ data.item.made_purchase ? "Yes" : "Not yet" }}
        </template>

        <template #cell(created_at)="data">
          {{ data.value | moment("MMMM Do YYYY") }}
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BCardBody,
  BFormInput,
  BFormGroup,
  BButton,
  BTable,
} from "bootstrap-vue";
import { Icon } from "@iconify/vue2";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import gql from "graphql-tag";

export default {
  components: {
    BCard,
    BCardBody,
    Icon,
    BFormInput,
    BFormGroup,
    BButton,
    ToastificationContent,
    BTable,
  },

  directives: {
    Ripple,
  },

  data() {
    return {
      items: null,
      fields: [
        // A virtual column that doesn't exist in items
        "index",
        // A column that needs custom formatting
        { key: "Username", label: "Username" },
        { key: "created_at", label: "Referred Date" },
        { key: "opted", label: "Made Purchase" },
      ],
      username: this.$store.getters.userInfo.username,
    };
  },
  methods: {
    doCopy() {
      this.$copyText(`https://dashboard.fetch.fit/register?rid=${this.username}`).then(
        () => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Referral link copied",
              icon: "BellIcon",
            },
          });
        },
        (e) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Can not copy!",
              icon: "BellIcon",
            },
          });
        }
      );
    },
  },

  async created() {
    try {
      const data = await this.$apollo.query({
        query: gql`
          query getReferals {
            Fitness_referral {
              id
              created_at
              made_purchase
              referredUser {
                id
                username
                avatar
              }
            }
          }
        `,
      });
      this.items = data.data.Fitness_referral;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss">
</style>
