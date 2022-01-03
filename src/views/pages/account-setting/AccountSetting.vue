<template>
  <b-tabs
    v-if="options"
    vertical
    content-class="col-12 col-md-9 mt-1 mt-md-0"
    pills
    nav-wrapper-class="col-md-3 col-12"
    nav-class="nav-left"
  >
    <!-- general tab -->
    <b-tab active>
      <!-- title -->
      <template #title>
        <feather-icon icon="UserIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">General</span>
      </template>
      <div v-if="options">
        <account-setting-general
          v-if="options"
          :general-data="options"
          @refresh-data="refetchData"
        />
      </div>
    </b-tab>
    <!--/ general tab -->

    <!-- change password tab -->
    <b-tab>
      <!-- title -->
      <template #title>
        <feather-icon icon="LockIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">Change Password</span>
      </template>
      <account-setting-password />
    </b-tab>
    <!--/ change password tab -->

    <!-- info -->
    <b-tab>
      <!-- title -->
      <template #title>
        <feather-icon icon="InfoIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">Payments</span>
      </template>
      <div v-if="options">
        <account-payment-history v-if="options" :information-data="options" />
      </div>
    </b-tab>
    <b-tab>
      <!-- title -->
      <template #title>
        <feather-icon icon="InfoIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">Plan</span>
      </template>
      <div v-if="options">
        <account-plan v-if="options" :information-data="options" />
      </div>
    </b-tab>

    <b-tab>
      <!-- title -->
      <template #title>
        <feather-icon icon="InfoIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">Referral (Beta)</span>
      </template>
      <div v-if="options">
        <account-referral />
      </div>
    </b-tab>
  </b-tabs>
  <div v-else>
    <b-spinner small class="mr-1" variant="primary" />
  </div>
</template>

<script>
import { BTabs, BTab, BSpinner } from "bootstrap-vue";
import AccountSettingGeneral from "./AccountSettingGeneral.vue";
import AccountSettingPassword from "./AccountSettingPassword.vue";
import AccountSettingInformation from "./AccountSettingInformation.vue";
import AccountPaymentHistory from "./AccountPaymentHistory.vue";
import AccountPlan from "./AccountPlan.vue";
import gql from "graphql-tag";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import accountStoreModule from "./accountSettingStore.js";
import AccountReferral from "./AccountReferral";

export default {
  components: {
    BTabs,
    BTab,
    AccountSettingGeneral,
    AccountSettingPassword,
    AccountSettingInformation,
    AccountPaymentHistory,
    BSpinner,
    AccountPlan,
    AccountReferral,
  },

  data() {
    return {
      clevePhone: {
        phone: true,
        phoneRegionCode: "US",
      },
      options: null,
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
    };
  },
  methods: {
    refetchData() {
      console.log("yes i am triggered");
      this.fetchtheData();
    },

    async fetchtheData() {
      console.log("done");
      try {
        const data = await this.$apollo.query({
          query: gql`
            query MyQuery($id: Int!) {
              Fitness_User_by_pk(id: $id) {
                id
                firstName
                lastName
                dob
                about
                email
                fullname
                username
                avatar
                gender
                website
                country
                phonenumber
              }
            }
          `,
          variables: {
            id: this.userInfo.id,
          },
        });

        this.options = data.data.Fitness_User_by_pk;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    this.fetchtheData();
  },

  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  // setup() {
  //       const USER_APP_STORE_MODULE_NAME = "app-account-settings";

  //   // Register module
  //   if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
  //     store.registerModule(USER_APP_STORE_MODULE_NAME, accountStoreModule);

  //   // UnRegister on leave
  //   onUnmounted(() => {
  //     if (store.hasModule(USER_APP_STORE_MODULE_NAME))
  //       store.unregisterModule(USER_APP_STORE_MODULE_NAME);
  //   });

  //   const options = ref({});
  //   return {
  //     options,
  //   }
  // },
};
</script>
