<template>
  <b-card no-body>
    <b-card-body>

      <b-card-title>Currently Assigned Programs</b-card-title>
   <div v-if="userData">

      <app-collapse hover>
        <app-collapse-item
          v-for="program in userData.program_assigned_clients"
          :key="program.id"
          :title="program.program_details.title"
        >

          <b-button
          :to="{name: 'user-program-view' , params: {id: program.program_details.id}}"
            class="float-right"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="primary"
            size="sm"
          >
            <span class="align-middle">View</span>
          </b-button>
        </app-collapse-item>
      </app-collapse>
          </div>

                <div v-else>
        <div class="text-center"> 
        <small class="text-muted ">No program assigned yet </small> </div>
      </div>

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
