<template>
  <b-card>
    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-link>
          <b-img
            ref="previewEl"
            rounded
            :src="'http://localhost:2589' + generalData.avatar"
            height="80"
          />
        </b-link>
        <!--/ avatar -->
      </b-media-aside>

      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button
          v-if="!profileFile"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()"
        >
          Select
        </b-button>

        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept=".jpg, .png, .gif"
          :hidden="true"
          type="file"
          plain
          @input="inputImageRenderer"
        />

        <!--/ upload button -->

        <!-- reset -->
        <b-button
          v-if="profileFile"
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
          @click="UploadPic"
        >
          Upload
        </b-button>
        <!--/ reset -->
        <b-card-text>Allowed JPG, GIF or PNG. Max size of 800kB</b-card-text>
      </b-media-body>
    </b-media>
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group label="Username" label-for="account-username">
            <b-form-input
              id="readOnlyInput"
              v-model="generalData.username"
              readonly
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Name" label-for="account-name">
            <b-form-input
              v-model="generalData.fullName"
              name="name"
              placeholder="Name"
            />
          </b-form-group>
        </b-col>

        <b-col sm="6">
          <b-form-group label="First Name" label-for="first-name">
            <b-form-input
              v-model="generalData.firstName"
              name="First Name"
              placeholder="john"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Last Name" label-for="last-name">
            <b-form-input
              v-model="generalData.lastName"
              name="Last Name"
              placeholder="Cena"
            />
          </b-form-group>
        </b-col>

        <b-col sm="6">
          <b-form-group label="E-mail" label-for="account-e-mail">
            <b-form-input
              v-model="generalData.email"
              name="email"
              placeholder="Email"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Title" label-for="account-company">
            <b-form-input
              v-model="generalData.title"
              name="company"
              placeholder="Company name"
            />
          </b-form-group>
        </b-col>

        <!-- alert -->
        <b-col cols="12" class="mt-75">
          <b-alert show variant="warning" class="mb-50">
            <h4 class="alert-heading">
              Your email is not confirmed. Please check your inbox.
            </h4>
            <div class="alert-body">
              <b-link class="alert-link"> Verify NOW! </b-link>
            </div>
          </b-alert>
        </b-col>
        <!--/ alert -->

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
            @click.prevent="UpdateGeneralProfile"
          >
            Save changes
          </b-button>
          <!-- <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            type="reset"
            class="mt-2"
            @click.prevent="resetForm"
          >
            Reset
          </b-button> -->
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BFormFile,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BAlert,
  BCard,
  BCardText,
  BMedia,
  BMediaAside,
  BMediaBody,
  BLink,
  BImg,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import gql from "graphql-tag";

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BAlert,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionsLocal: this.generalData,
      profileFile: null,
      isUploaded: false,
      // UpdatedData: generalData,
    };
  },

  methods: {
    async UploadPic() {
      {
        try {
          // const fd = new FormData();
          // fd.append("filename", this.profileFile, this.profileFile.name);
          // console.log(fd.get('filename'));
          // console.log(fd)
          const Avatar = await this.$apollo.mutate({
            mutation: gql`
              mutation editProfile($avatar: Upload) {
                editProfile(avatar: $avatar) {
                  ok
                  error
                }
              }
            `,
            variables: {
              avatar: this.profileFile,
            },
          });
          const response = Avatar.data.editProfile;
          if (response.ok) {
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                title: `YAY! `,
                icon: "CoffeeIcon",
                variant: "success",
                text: `Avatar Updated!`,
              },
            });
          } else {
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                title: `Error `,
                icon: "AlertOctagonIcon",
                variant: "danger",
                text: `Please try again`,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    async UpdateGeneralProfile() {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation editProfile(
              $firstName: String
              $lastName: String
              $username: String
              $email: String
            ) {
              editProfile(
                firstName: $firstName
                lastName: $lastName
                username: $username
                email: $email
              ) {
                ok
                error
              }
            }
          `,
          variables: {
            firstName: this.generalData.firstName,
            lastName: this.generalData.lastName,
            username: this.generalData.username,
            email: this.generalData.username,
          },
        });
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Profile Updated!",
            icon: "EditIcon",
            variant: "success",
          },
        });
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Please try again",
            icon: "EditIcon",
            variant: "danger",
          },
        });
      }
    },
  },
  setup() {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(
      refInputEl,
      (base64) => {
        previewEl.value.src = base64;
      }
    );

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
};
</script>
