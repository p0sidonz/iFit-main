<template>
  <div>
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="dietData === undefined">
      <h4 class="alert-heading">Error fetching Diet</h4>
      <div class="alert-body">
        Pleae hit back
        <b-link class="alert-link" :to="{ name: 'apps-users-list' }">
          User List
        </b-link>
        for other users.
      </div>
    </b-alert>

    <template v-if="dietData">
      <!-- First Row -->
      <b-row>
        <b-col cols="12" xl="9" lg="8" md="7">
          <view-diet :diet-data="dietData" :diet-meta="dietData" />
        </b-col>
        <b-col cols="12" md="5" xl="3" lg="4">
          {{ dietData }}
        </b-col>
      </b-row>
      <!-- 
      <b-row>
        <b-col cols="12" lg="6">
          <user-view-user-timeline-card />
        </b-col>
        <b-col cols="12" lg="6">
          <user-view-user-permissions-card :user-data="dietData" />
        </b-col>
      </b-row> -->
    </template>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
import { ref, onUnmounted } from "@vue/composition-api";
import {
  BRow,
  BCol,
  BAlert,
  BLink,
  BCardTitle,
  BCardBody,
  BDropdown,
  BDropdownItem,
} from "bootstrap-vue";
import dietStoreModule from "./DietStoreModule";
import viewDiet from "./viewDiet.vue";

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    viewDiet,

    // Local Components
    // UserViewUserPlanCard,
    // UserViewUserTimelineCard,
    // UserViewUserPermissionsCard,
  },
  setup() {
    const dietData = ref(null);

    const USER_APP_STORE_MODULE_NAME = "diet-user";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, dietStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    function refetchData() {
      store
        .dispatch("diet-user/fetchDiet", { id: router.currentRoute.params.id })
        .then((response) => {
          console.log("DIET", response),
            (dietData.value = response.data.data.Fitness_Diet_by_pk);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 404) {
            dietData.value = undefined;
          }
        });
    }
    refetchData();

    return {
      dietData,
      refetchData,
    };
  },
};
</script>

<style>
</style>
