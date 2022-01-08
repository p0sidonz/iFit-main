<template>
  <div>
    <!-- search input -->
    <section id="knowledge-base-search">
      <b-card
        no-body
        class="knowledge-base-bg text-center"
        :style="{
          backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
        }"
      >
        <b-card-body class="card-body">
          <h2 class="text-primary">Welcome back {{ userInfo.username }}!</h2>
          <b-card-text class="mb-2">
            <span class="font-weight-bolder"
              >Diet, Workout, Live Sessions and much more...</span
            >
          </b-card-text>

          <!-- form -->
          <b-form class="kb-search-input">
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                id="searchbar"
                v-model="knowledgeBaseSearchQuery"
                placeholder="Search...."
              />
            </b-input-group>
          </b-form>
          <!-- form -->
        </b-card-body>
      </b-card>
    </section>
    <!--/ search input -->

    <section id="knowledge-base-content">
      <!-- content -->
      <b-row class="kb-search-content-info match-height">
        <b-col
          v-for="item in filteredKB"
          :key="item.id"
          md="4"
          sm="6"
          class="kb-search-content"
        >
          <b-card
            class="text-center cursor-pointer"
            @click="$router.push({ name: item.category })"
          >
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              color="#7367f0"
              width="170"
              height="200"
            />

            <h4>{{ item.title }}</h4>
          </b-card>
        </b-col>
        <b-col v-show="!filteredKB.length" cols="12" class="text-center">
          <h4 class="mt-4">Search result not found!!</h4>
        </b-col>
      </b-row>
    </section>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BForm,
  BInputGroup,
  BFormInput,
  BCardText,
  BInputGroupPrepend,
} from "bootstrap-vue";
import { Icon } from "@iconify/vue2";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardText,
    BForm,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
    Icon,
  },
  data() {
    return {
      knowledgeBaseSearchQuery: "",
      kb: [
        {
          id: 1,
          category: "apps-users-list",
          icon: "uim:user-arrows",
          img: require("@/assets/images/illustration/sales.svg"),
          title: "Client Dashboard",
          desc: "There is perhaps no better demonstration of the folly of image of our tiny world.",
        },
        {
          id: 2,
          category: "nutrition-list",
          icon: "whh:foodtray",
          img: require("@/assets/images/illustration/marketing.svg"),
          title: "Diet Dashboard",
          desc: "Look again at that dot. That’s here. That’s home. That’s us. On it everyone you love.",
        },
        {
          id: 3,
          category: "workout-list",
          icon: "maki:fitness-centre",
          img: require("@/assets/images/illustration/api.svg"),
          title: "Workout Dashboard",
          desc: "every hero and coward, every creator and destroyer of civilization.",
        },
        {
          id: 4,
          category: "program-list",

          icon: "whh:programok",
          img: require("@/assets/images/illustration/personalization.svg"),
          title: "Programs",
          desc: "It has been said that astronomy is a humbling and character experience.",
        },
        {
          id: 5,
          category: "apps-chat",
          icon: "whh:chat",
          img: require("@/assets/images/illustration/email.svg"),
          title: "Chat",
          desc: "There is perhaps no better demonstration of the folly of human conceits.",
        },
        {
          id: 6,
          category: "trainer-packages",
          icon: "whh:dotlist",
          img: require("@/assets/images/illustration/demand.svg"),
          title: "Packages",
          desc: "Competent means we will never take anything for granted.",
        },
        {
          id: 7,
          category: "add-exercises",
          icon: "healthicons:exercise-weights",

          img: require("@/assets/images/illustration/api.svg"),
          title: "Exercises",
          desc: "Competent means we will never take anything for granted.",
        },
        {
          id: 8,
          category: "apps-calendar",
          icon: "whh:calendarthree",

          img: require("@/assets/images/illustration/api.svg"),
          title: "Calendar",
          desc: "Competent means we will never take anything for granted.",
        },
      ],
    };
  },
  computed: {
    filteredKB() {
      const knowledgeBaseSearchQueryLower =
        this.knowledgeBaseSearchQuery.toLowerCase();
      return this.kb.filter(
        (item) =>
          item.title.toLowerCase().includes(knowledgeBaseSearchQueryLower) ||
          item.desc.toLowerCase().includes(knowledgeBaseSearchQueryLower)
      );
    },

    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  created() {
    // this.$http.get('/kb/data/knowledge_base').then(res => { this.kb = res.data })
  },
};
</script>
 
<style lang="scss">
@import "@core/scss/vue/pages/page-knowledge-base.scss";
</style>
