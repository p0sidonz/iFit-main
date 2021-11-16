<template>
  <b-card no-body>
    <b-card-body>
      <b-card-header class="float-right">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-primary"
        >
          <feather-icon icon="PlusCircleIcon" class="mr-50" />
          <span class="align-middle">Create New Diet</span>
        </b-button>
      </b-card-header>
      <b-card-title>Diet plans</b-card-title>

      <app-collapse hover>
        <app-collapse-item
          v-for="diets in userData.Diets"
          :key="diets.id"
          :title="diets.diet_name"
        >
          {{ diets.diet_description }}

          <b-button
          :to="{name: 'nutrition-view' , params: {id: diets.id}}"
            class="float-right"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="primary"
            size="sm"
          >
            <span class="align-middle">View</span>
          </b-button>
        </app-collapse-item>
      </app-collapse>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard,
  BTable,
  BCardBody,
  BCardTitle,
  BCardSubTitle,
  BFormCheckbox,
  BButton,
  BCardHeader
} from "bootstrap-vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import Ripple from "vue-ripple-directive";

export default {
  components: {
    BCard,
    BTable,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BFormCheckbox,
    AppCollapse,
    AppCollapseItem,
    BButton,
    BCardHeader
  },
  directives: {
    Ripple,
  },

  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>

<style>
</style>
