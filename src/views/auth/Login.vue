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
          <b-img fluid :src="imgUrl" alt="Login V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title title-tag="h2" class="font-weight-bold mb-1">
            Welcome to Fetch.fit! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text>
          <b-overlay
            :show="showOverlay"
            spinner-variant="primary"
            spinner-type="grow"
            spinner-small
            opacity="0.0"
            rounded="sm"
          >
            <!-- form -->
            <validation-observer ref="loginValidation">
              <b-form class="auth-login-form mt-2" @submit.prevent>
                <!-- email -->
                <b-form-group label="Email" label-for="login-email">
                  <validation-provider
                    #default="{ errors }"
                    name="Username"
                    rules="required"
                  >
                    <b-form-input
                      id="login-email"
                      v-model="userEmail"
                      :state="errors.length > 0 ? false : null"
                      name="login-email"
                      placeholder="john@example.com"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>

                <!-- forgot password -->
                <b-form-group>
                  <div class="d-flex justify-content-between">
                    <label for="login-password">Password</label>
                    <b-link :to="{ name: 'forgot-password' }">
                      <small>Forgot Password?</small>
                    </b-link>
                  </div>
                  <validation-provider
                    #default="{ errors }"
                    name="Password"
                    rules="required"
                  >
                    <b-input-group
                      class="input-group-merge"
                      :class="errors.length > 0 ? 'is-invalid' : null"
                    >
                      <b-form-input
                        id="login-password"
                        v-model="password"
                        :state="errors.length > 0 ? false : null"
                        class="form-control-merge"
                        :type="passwordFieldType"
                        name="login-password"
                        placeholder="············"
                      />
                      <b-input-group-append is-text>
                        <feather-icon
                          class="cursor-pointer"
                          :icon="passwordToggleIcon"
                          @click="togglePasswordVisibility"
                        />
                      </b-input-group-append>
                    </b-input-group>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>

                <!-- checkbox -->
                <b-form-group>
                  <b-form-checkbox
                    id="remember-me"
                    v-model="status"
                    name="checkbox-1"
                  >
                    Remember Me
                  </b-form-checkbox>
                </b-form-group>
                <!-- submit buttons -->
                <b-button
                  type="submit"
                  variant="primary"
                  block
                  @click="login"
                  :disabled="invalid || isloading"
                  :class="isloading ? 'hidden' : ''"
                >
                  <div v-if="!isloading">
                    <span> Sign In</span>
                  </div>
                </b-button>
                <b-button v-if="isloading" variant="primary" disabled block>
                  <div>
                    <b-spinner small />

                    <span class="sr-only">Loading...</span>
                  </div>
                </b-button>
              </b-form>
            </validation-observer>

            <b-card-text class="text-center mt-1">
              <span>Or </span></b-card-text
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
              :to="{ name: 'register' }"
            >
              Create an account
            </b-button>
          </b-overlay>

          <!-- social buttons -->
        </b-col>
      </b-col>
      <!-- /Login-->
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
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BSpinner,
  BOverlay,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import gql from "graphql-tag";
import { data } from "vue-echarts";
import jwt from "jsonwebtoken";
import { getHomeRouteForLoggedInUser } from "@/auth/utils";

// import LOGIN_MUTATION from '../graphql/auth.gql'

export default {
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
    BOverlay,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: "",
      password: "",
      userEmail: "",
      sideImg: require("@/assets/images/pages/login-v2.svg"),
      // validation rulesimport store from '@/store/index'
      required,
      email,
      isloading: false,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then((success) => {
        if (success) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Form Submitted",
              icon: "EditIcon",
              variant: "success",
            },
          });
        }
      });
    },

    async login() {
      this.showOverlay = true;
      this.isloading = true;
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation Login($email: String!, $password: String!) {
              Login(email: $email, password: $password) {
                accessToken
                id
                username
                fullname
                avatar
                role
              }
            }
          `,
          variables: {
            email: this.userEmail.toLowerCase().trim(),
            password: this.password,
          },
        });
        const response = data.data.Login;
        console.log(response.role);
        if (response.accessToken) {
          localStorage.setItem(
            "apollo-token",
            JSON.stringify(response.accessToken)
          );

          // Update when logged in

          //Fetch more info related to user

          const token = localStorage.getItem("apollo-token");
          const freshTocken = token.replace(/['"]+/g, "");

          axios
            .post(
              process.env.VUE_APP_GRAPHQL_HTTP,
              {
                query: `

            query getPackage($id: Int!) {
  Fitness_User_by_pk(id: $id) {
    current_package(limit: 1, order_by: {created_at: asc}) {
      id
      end_date
      package_detail {
        title
        subscription_days
      }
    }
  }
}
`,

                variables: {
                  id: data.data.Login.id,
                },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: freshTocken,
                },
              }
            )
            .then((res) => {
              localStorage.setItem(
                "pkg-detail",
                JSON.stringify(
                  res.data.data.Fitness_User_by_pk.current_package[0]
                    .package_detail
                )
              );
            })
            .catch((error) => {
              console.log("pkg error", error);
            });

          this.$store.dispatch("loginState", response);

          localStorage.setItem("userInfo", JSON.stringify(response));
          // if (response.role === "trainer") {
          //   this.$router.replace({ path: "/dashboard" });
          // }
          // if (response.role === "user") {
          //               this.$router.replace({ path: `/user/${response.username}` });

          // }
          this.showOverlay = false;

          this.$router.replace(getHomeRouteForLoggedInUser(response.role));

          this.isloading = false;
          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              title: `Welcome `,
              icon: "CoffeeIcon",
              variant: "success",
              text: `You have successfully logged`,
            },
          });
        } else {
          this.isloading = false;
          this.showOverlay = false;

          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              title: `Error `,
              icon: "AlertOctagonIcon",
              variant: "danger",
              text: `Invalid Username or Password`,
            },
          });
        }
      } catch (error) {
        this.isloading = false;
        this.showOverlay = false;

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
      }
    },
  },
};
</script>
  
<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
