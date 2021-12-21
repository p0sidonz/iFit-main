<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />

        <h2 class="brand-text text-primary ml-1">Fetch.fit</h2>
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
            Make Fitness your next habbit!
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
                <div v-if="isloading">
                  <b-spinner small />

                  <span class="sr-only">Loading...</span>
                </div>
                <div v-if="!isloading">
                  <span> Sign up</span>
                </div>
              </b-button>
            </b-form>
          </validation-observer>

          <!-- <p class="text-center mt-2">
            <span>Already have an account?</span>
            <b-link :to="{ name: 'login' }">
              <span>&nbsp;Sign in instead</span>
            </b-link>
          </p> -->

          <b-card-text class="text-center mt-1">
            <span>Already have an account? </span></b-card-text
          >
          <!-- 
          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link :to="{ name: 'page-auth-register-v2' }">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text> -->
          <b-button
            type="submit"
            variant="outline-primary"
            block
            :to="{ name: 'login' }"
          >
            Sign in
          </b-button>
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
  BSpinner,
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
    BSpinner,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      isloading: false,
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
      this.isloading = true;
      // Call to the graphql mutation
      const data = await this.$apollo
        .mutate({
          mutation: gql`
            mutation signup(
              $firstName: String!
              $lastName: String
              $username: String!
              $email: String!
              $password: String!
            ) {
              signup(
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
            firstName: this.register.firstName.toLowerCase().trim(),
            lastName: this.register.lastName.toLowerCase().trim(),
            username: this.register.username.toLowerCase().trim(),
            email: this.register.email.toLowerCase().trim(),
            password: this.register.password,
          },
        })
        .then((data) => {
          this.isloading = false;
          this.$router.replace({ path: "/login" });
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

        .catch((errors) => {
          this.isloading = false;
          console.log(errors);
          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              title: `Error `,
              icon: "AlertOctagonIcon",
              variant: "danger",
              text: `Email or Username already in use. Please kindly use the different one or try to reset the password.`,
            },
          });

          //  console.log( error[0].extensions.internal.response.body.error)
        });

      // .then(() => {
      //   this.$toast({
      //     component: ToastificationContent,
      //     position: "top-right",
      //     props: {
      //       title: `Success `,
      //       icon: "CoffeeIcon",
      //       variant: "success",
      //       text: `You have successfully Registerd, You may login now.`,
      //     },
      //   });
      // })

      // .catch((error) => {
      //   //Error
      //   console.log(error);
      //   this.$toast({
      //     component: ToastificationContent,
      //     position: "top-right",
      //     props: {
      //       title: `Error `,
      //       icon: "AlertOctagonIcon",
      //       variant: "danger",
      //       text: `${error}`,
      //     },
      //   });
      // });
    },
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>