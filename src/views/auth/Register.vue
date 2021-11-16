<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />

        <h2 class="brand-text text-primary ml-1">Vuexy</h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Register V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title class="mb-1"> Adventure starts here 🚀 </b-card-title>
          <b-card-text class="mb-2">
            Make your app management easy and fun!
          </b-card-text>

          <!-- form -->
          <validation-observer ref="registerForm" #default="{ invalid }">
            <b-form class="auth-register-form mt-2" @submit.prevent="signup">
              <!-- Firstname -->
              <b-form-group label="First Name" label-for="register-firstname">
                <validation-provider
                  #default="{ errors }"
                  name="firstname"
                  vid="firstname"
                  rules="required"
                >
                  <b-form-input
                    id="register-firstname"
                    v-model="register.firstName"
                    name="register-firstname"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Ankit"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- Lastname -->
              <b-form-group label="Last Name" label-for="register-firstname">
                <validation-provider
                  #default="{ errors }"
                  name="lastname"
                  vid="lastname"
                  rules="required"
                >
                  <b-form-input
                    id="register-lastname"
                    v-model="register.lastName"
                    name="register-lastname"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Singh"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- username -->
              <b-form-group label="Username" label-for="register-username">
                <validation-provider
                  #default="{ errors }"
                  name="Username"
                  vid="username"
                  rules="required"
                >
                  <b-form-input
                    id="register-username"
                    v-model="register.username"
                    name="register-username"
                    :state="errors.length > 0 ? false : null"
                    placeholder="johndoe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group label="Email" label-for="register-email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="register-email"
                    v-model="register.email"
                    name="register-email"
                    :state="errors.length > 0 ? false : null"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password -->
              <b-form-group label-for="register-password" label="Password">
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="register-password"
                      v-model="register.password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false : null"
                      name="register-password"
                      placeholder="*********"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="register.status"
                  name="checkbox-1"
                >
                  I agree to
                  <b-link>privacy policy & terms</b-link>
                </b-form-checkbox>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Sign up
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>Already have an account?</span>
            <b-link :to="{ name: 'login' }">
              <span>&nbsp;Sign in instead</span>
            </b-link>
          </p>

          <!-- divider -->
          <div class="divider my-2">
            <div class="divider-text">or</div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button variant="facebook" href="javascript:void(0)">
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button variant="twitter" href="javascript:void(0)">
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button variant="google" href="javascript:void(0)">
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button variant="github" href="javascript:void(0)">
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div>
        </b-col>
      </b-col>
      <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import {
  BRow,
  BCol,
  BLink,
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BImg,
  BCardTitle,
  BCardText,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import gql from "graphql-tag";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    VuexyLogo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      register: {
        status: "",
        firstName: "",
        lastName: "",
        password: "",
        username: "",
        email: "",
      },

      sideImg: require("@/assets/images/pages/register-v2.svg"),
      // validation
      required,
      email,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/register-v2-dark.svg");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    async signup() {
      console.log(this.register);
      // Call to the graphql mutation
      const data = await this.$apollo
        .mutate({
          mutation: gql`
            mutation createAccount(
              $firstName: String!
              $lastName: String
              $username: String!
              $email: String!
              $password: String!
            ) {
              createAccount(
                firstName: $firstName
                lastName: $lastName
                username: $username
                email: $email
                password: $password
              ) {
                ok
                error
              }
            }
          `,
          variables: {
            firstName: this.register.firstName,
            lastName: this.register.lastName,
            username: this.register.username,
            email: this.register.email,
            password: this.register.password,
          },
        })
        .then((data) => {
          console.log(data);
          // const decoded = jwt.verify(data.data.login.token, 'hack-me-if-u-can-2589');

          this.$router.replace({ path: "/login" });
        })
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              title: `Success `,
              icon: "CoffeeIcon",
              variant: "success",
              text: `You have successfully Registerd, You may login now.`,
            },
          });
        })

        .catch((error) => {
          //Error
          console.log(error);
          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              title: `Error `,
              icon: "AlertOctagonIcon",
              variant: "danger",
              text: `${error}`,
            },
          });
        });
    },
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>