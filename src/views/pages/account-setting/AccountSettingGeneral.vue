<template>
  <b-card v-if="optionsLocal">
    <!-- media -->
    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-link>
          <div class="profile-image-wrapper">
            <div class="profile-image p-0">
              <b-avatar
                ref="previewEl"
                size="114"
                variant="light"
                :src="optionsLocal.avatar"
              />
            </div>
          </div>
        </b-link>
        <!--/ avatar -->
      </b-media-aside>
      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()"
        >
          <b-spinner v-if="isImageLoading" small class="mr-1" variant="light" />

          Upload
        </b-button>
        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept=".jpg, .png, .gif"
          :hidden="true"
          plain
          @input="idk"
        />
        <!--/ upload button -->

        <!-- reset -->
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75"
        >
          Reset
        </b-button>
        <!--/ reset -->
        <b-card-text>Allowed JPG, GIF or PNG. Max size of 8Mb</b-card-text>
      </b-media-body>
    </b-media>
    <!-- media -->

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
              name="name"
              :placeholder="optionsLocal.firstName + ' ' + optionsLocal.lastName"
              readonly
            />
          </b-form-group>
        </b-col>

        <b-col sm="6">
          <b-form-group label="First Name" label-for="first-name">
            <b-form-input
              v-model="optionsLocal.firstName"
              name="First Name"
              placeholder="john"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Last Name" label-for="last-name">
            <b-form-input
              v-model="optionsLocal.lastName"
              name="Last Name"
              placeholder="Cena"
            />
          </b-form-group>
        </b-col>

        <b-col sm="6">
          <b-form-group label="E-mail" label-for="account-e-mail">
            <b-form-input
              v-model="optionsLocal.email"
              name="email"
              placeholder="Email"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Gender" label-for="account-company">
            <v-select
              id="countryList"
              v-model="optionsLocal.gender"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :options="genderOption"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-form-group label="Bio" label-for="bio-area">
            <b-form-textarea
              id="bio-area"
              v-model="optionsLocal.about"
              rows="4"
              placeholder="Your bio data here..."
            />
          </b-form-group>
        </b-col>
        <!--/ bio -->

        <!-- birth date -->
        <b-col md="6">
          <b-form-group label-for="example-datepicker" label="Birth date">
            <flat-pickr
              v-model="optionsLocal.dob"
              class="form-control"
              name="date"
              placeholder="Birth date"
            />
          </b-form-group>
        </b-col>
        <!--/ birth date -->

        <!-- Country -->
        <b-col md="6">
          <b-form-group label-for="countryList" label="Country">
            <v-select
              id="countryList"
              v-model="optionsLocal.country"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :options="countryOption"
            />
          </b-form-group>
        </b-col>
        <!--/ Country -->

        <!-- website -->
        <b-col md="6">
          <b-form-group label-for="website" label="Website">
            <b-form-input
              id="website"
              v-model="optionsLocal.website"
              placeholder="Website address"
            />
          </b-form-group>
        </b-col>
        <!--/ website -->

        <!-- phone -->
        <b-col md="6">
          <b-form-group label-for="phone" label="Phone">
            <cleave
              id="phone"
              v-model="optionsLocal.phonenumber"
              class="form-control"
              :raw="false"
              :options="clevePhone"
              placeholder="Phone number"
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
            <b-spinner v-if="isLoading" small class="mr-1" variant="light" />

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
  <div v-else>
    <b-spinner small class="mr-1" variant="light" />
  </div>
</template>

<script>
import {
  BFormFile,
  BFormTextarea,
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
  BSpinner,
  BAvatar,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import gql from "graphql-tag";
import vSelect from "vue-select";
import Cleave from "vue-cleave-component";
import flatPickr from "vue-flatpickr-component";
import Compressor from "compressorjs";
import axios from "@axios";
import Vue from "vue";

export default {
  components: {
    BButton,
    BFormTextarea,
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
    vSelect,
    flatPickr,
    Cleave,
    Compressor,
    BSpinner,
    BAvatar,
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
      countryOption: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas (the)",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands (the)",
        "Central African Republic (the)",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands (the)",
        "Colombia",
        "Comoros (the)",
        "Congo (the Democratic Republic of the)",
        "Congo (the)",
        "Cook Islands (the)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic (the)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands (the) [Malvinas]",
        "Faroe Islands (the)",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories (the)",
        "Gabon",
        "Gambia (the)",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (the)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic (the)",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands (the)",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands (the)",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger (the)",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands (the)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines (the)",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation (the)",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan (the)",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands (the)",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates (the)",
        "United Kingdom of Great Britain and Northern Ireland (the)",
        "United States Minor Outlying Islands (the)",
        "United States of America (the)",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands",
      ],
      clevePhone: {
        phone: true,
        phoneRegionCode: "US",
      },
      genderOption: ["Male", "Female", "Other"],
      optionsLocal: {...this.generalData},
      profileFile: null,
      isUploaded: false,
      base64compressed: null,
      isImageLoading: false,
      isLoading: false,
      // UpdatedData: generalData,
    };
  },

  methods: {
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
          const result = reader.result;
          return resolve(result);
        };

        reader.onerror = function (error) {
          return reject(error);
        };

        reader.readAsDataURL(file);
      });
    },

    compressImage(image) {
      return new Promise((resolve, reject) => {
        const reader = new Compressor(image, {
          quality: 0.3,
          maxWidth: 300,
          maxHeight: 200,
          success(result) {
            return resolve(result);
          },
          error(error) {
            return reject(error);
          },
        });
      });
    },
    async idk() {
      if (!this.profileFile) {
        return;
      }
      this.isImageLoading = true;
      const compressed_img = await this.compressImage(this.profileFile);
      if (compressed_img) {
        const rawFile = await this.getBase64(compressed_img);

        try {
          const data = await this.$apollo.mutate({
            mutation: gql`
              mutation profileImageUpload(
                $base64file: String!
                $fileName: String!
              ) {
                profileImageUpload(
                  base64file: $base64file
                  fileName: $fileName
                ) {
                  ok
                  message
                  avatar
                }
              }
            `,
            variables: {
              base64file: rawFile,
              fileName: compressed_img.name,
            },
          });
          console.log(data);
          this.isImageLoading = false;

          if (data.data.profileImageUpload.ok) {
            this.optionsLocal.avatar = data.data.profileImageUpload.avatar;
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Avatar Updated!",
                icon: "EditIcon",
                variant: "success",
              },
            });
            this.$emit("refresh-data");
          }
        } catch (error) {
          this.isImageLoading = false;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Please try again",
              icon: "EditIcon",
              variant: "danger",
            },
          });
          this.$emit("refresh-data");
        }
      }
    },

    async UpdateGeneralProfile() {
      console.log("optionslocal",this.generalData);
      this.isLoading = true;
      let finalSet = null;
      finalSet = {...this.optionsLocal};
      delete finalSet.avatar;
      delete finalSet.fullname;
      delete finalSet.__typename;
      delete finalSet.id;
      delete finalSet.username;
       delete finalSet.fullname;
      console.log(this.generalData)
      let objectx = {
        id: this.generalData.id,
        _set: {
          ...finalSet,
        },
      };

      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation MyMutation($id: Int, $_set: Fitness_User_set_input = {}) {
              update_Fitness_User(where: { id: { _eq: $id } }, _set: $_set) {
                affected_rows
              }
            }
          `,
          variables: {
            ...objectx,
          },
        });
        if (data.data.update_Fitness_User.affected_rows) {
          this.isLoading = false;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Profile Updated!",
              icon: "EditIcon",
              variant: "success",
            },
          });
        }
      } catch (error) {
        this.isLoading = false;

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
    const okGoogle = () => {
      console.log("OkGoogle");
    };

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
      okGoogle,
    };
  },
};
</script>
