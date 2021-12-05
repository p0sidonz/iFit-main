<template>
  <li class="nav-item nav-search">
    <!-- Icon -->
    <a
      href="javascript:void(0)"
      class="nav-link nav-link-search"
      @click="showSearchBar = true"
    >
      <feather-icon icon="SearchIcon" size="21" />
    </a>

    <!-- Input -->
    <div class="search-input" :class="{ open: showSearchBar }">
      <div class="search-input-icon">
        <feather-icon icon="SearchIcon" />
      </div>
      <!-- <input type="text" placeholder="Explore Vuexy...." class="form-control-input"> -->
      <!-- @keyup.esc="escPressed" -->
      <!-- @keyup.enter="suggestionSelected" -->
      <b-form-input
        v-if="showSearchBar"
        v-model="searchQuery"
        placeholder="Search for users..."
        autofocus
        autocomplete="off"
      />
      <div
        class="search-input-close"
        @click="
          showSearchBar = false;
          resetsearchQuery();
        "
      >
        <feather-icon icon="XIcon" />
      </div>

      <!-- Suggestions List -->
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="search-list search-list-main scroll-area overflow-hidden"
        :class="{ show: searchQuery }"
        tagname="ul"
      >
        <li
          v-for="(suggestion_list, grp_index) in filteredData"
          :key="grp_index"
          class="suggestions-groups-list"
        >
          <!-- Suggestion List of each group -->
          <ul>
            <li
              @click="clicked(suggestion_list.username)"
              class="suggestion-group-suggestion cursor-pointer"
            >
              <template>
                <div class="d-flex align-items-center">
                  <b-avatar
                    :src="suggestion_list.avatar"
                    class="mr-1"
                    size="52"
                  />
                  <div>
                    <h6>{{ suggestion_list.fullname }}</h6>
                    <small>{{ suggestion_list.username }}</small>
                  </div>
                </div>
              </template>
            </li>
          </ul>
        </li>
      </vue-perfect-scrollbar>
    </div>
  </li>
</template>

<script>
import { BFormInput, BLink, BImg, BAvatar } from "bootstrap-vue";
import { ref, watch } from "@vue/composition-api";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import useAutoSuggest from "@core/components/app-auto-suggest/useAutoSuggest";
import { title } from "@core/utils/filter";
import router from "@/router";
import store from "@/store";
import axios from "@axios";

export default {
  components: {
    BFormInput,
    BLink,
    BImg,
    BAvatar,
    VuePerfectScrollbar,
  },
  setup() {
    const showSearchBar = ref(false);
    const searchQuery = ref("");
    const filteredData = ref({});

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
    };

    watch(searchQuery, (val) => {
      searchAPI();
    });

    const resetsearchQuery = () => {
      searchQuery.value = "";
    };

    const clicked = (username) => {
      showSearchBar.value = false;
      router.push(`/user/${username}`);
      resetsearchQuery();
    };
    const searchAPI = () => {
      let where = {
        _or: {
          firstName: { _ilike: `%${searchQuery.value}%` },
        },
        _or: {
          username: { _ilike: `%${searchQuery.value}%` },
        },
      };
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      axios
        .post(
          process.env.VUE_APP_GRAPHQL_HTTP,
          {
            query: `query MyQuery($where: Fitness_User_bool_exp = {}) {
  Fitness_User(where: $where) {
    fullname
    username
    avatar
    created_at
  }
}

              
              
              `,
            variables: {
              where,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: freshTocken,
            },
          }
        )
        .then((response) => {
          filteredData.value = response.data.data.Fitness_User;
        })
        .catch((error) => {
          console.log(error);
        });
    };
    /* eslint-enable no-lonely-if, no-plusplus */

    return {
      showSearchBar,
      perfectScrollbarSettings,
      searchQuery,
      searchAPI,
      filteredData,
      resetsearchQuery,
      clicked,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/include";
@import "~@core/scss/base/components/variables-dark";

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
p {
  margin: 0;
}

/* .app-auto-suggest {
  position: relative;
}

.auto-suggest-suggestions-list {
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  border-radius: 6px;
  position: absolute;
  top: calc(100% + 1rem);
  background-color: white;
  width: 100%;
} */

.suggestion-group-title {
  font-weight: 500;
  padding: 0.75rem 1rem 0.25rem;
}

.suggestion-group-suggestion {
  padding: 0.75rem 1rem;
}

.suggestion-current-selected {
  background-color: $body-bg;

  .dark-layout & {
    background-color: $theme-dark-body-bg;
  }
}
</style>
