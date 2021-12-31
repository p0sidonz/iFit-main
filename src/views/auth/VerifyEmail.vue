<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <vuexy-logo />
      <h2 class="brand-text text-primary ml-1">
        Fetch.fit
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div v-if="isLoading">

              <b-spinner small class="mr-1" variant="primary" /> Please wait while we verify your request...

      </div>
      <div v-if="!isLoading && ok" class="w-100 text-center">
        <h2 class="mb-1">
         Email verified ✅
        </h2>
        <p class="mb-2">
        Soon you will be redirected to login page...
        </p>

        <b-button
          variant="primary"
          class="mb-2 btn-sm-block"
          :to="{path:'/login'}"
        >
          Back to login
        </b-button>

        <!-- image -->
        <!-- <b-img
          fluid
          :src="imgUrl"
          alt="Error page"
        /> -->
      </div>
            <div v-if="!isLoading && !ok" class="w-100 text-center">
        <h2 class="mb-1">
         Token Expired ❌
        </h2>
        <p class="mb-2">
        Please kindly login again to request a new one
        </p>

        <b-button
          variant="primary"
          class="mb-2 btn-sm-block"
          :to="{path:'/login'}"
        >
          Back to login
        </b-button>

        <!-- image -->
        <!-- <b-img
          fluid
          :src="imgUrl"
          alt="Error page"
        /> -->
      </div>

    </div>
  </div>
<!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BLink, BButton, BImg, BSpinner } from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import axios from "@axios"
export default {
  components: {
    VuexyLogo,
    BLink,
    BButton,
    BSpinner,
    BImg,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/error.svg'),
      isLoading: true,
      token: this.$route.params.token,
      ok: false
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/error-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },

  methods:{
    
    verifyNow() {
      axios.get(`http://localhost:3000/verify_email/${this.token}`).then((response)=> {
        if(response.ok) {
           this.isLoading = false
            this.ok = true
        }
        if(!response.ok){
          this.isLoading = false
         this.ok = false
        }
      }).catch((error)=> {
        console.log("something went wrong!, Please try again", error)
      })
    },
  
  },
    created(){
      this.verifyNow()
      // setTimeout( () => this.$router.push({ path: '/login'}), 3000);

    }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
