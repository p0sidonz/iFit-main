<template>
  <b-tabs
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
        <feather-icon
          icon="UserIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">General</span>
      </template>

      <account-setting-general
        v-if="options"
        :general-data="options"
      />
    </b-tab>
    <!--/ general tab -->

    <!-- change password tab -->
    <b-tab>

      <!-- title -->
      <template #title>
        <feather-icon
          icon="LockIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">Change Password</span>
      </template>

      <account-setting-password />
    </b-tab>
    <!--/ change password tab -->

    <!-- info -->
    <b-tab>

      <!-- title -->
      <template #title>
        <feather-icon
          icon="InfoIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">BodyMeasurements</span>
      </template>

      <account-setting-information
        v-if="options"
        :information-data="options"
      />
    </b-tab>

  </b-tabs>
</template>

<script>
import { BTabs, BTab } from 'bootstrap-vue'
import AccountSettingGeneral from './AccountSettingGeneral.vue'
import AccountSettingPassword from './AccountSettingPassword.vue'
import AccountSettingInformation from './AccountSettingInformation.vue'
import gql from 'graphql-tag'

export default {
  components: {
    BTabs,
    BTab,
    AccountSettingGeneral,
    AccountSettingPassword,
    AccountSettingInformation,

  },
  data() {
    return {
      options: {},
    }
  },
  computed: {
    getToken() {
      return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
    },
  },

 async beforeCreate() 
 {
    try {
            const data = await this.$apollo.query({
          query: gql`
          
          query me{
            me{
              username
              email
              dob
              firstName
              lastName
              bio
              fullName
              avatar
            }
          }
          
          
          `,

      })
    this.options = data.data.me
   console.log(this.options)

    } catch (error) {
           console.log(error)

    }
  }
}
</script>
