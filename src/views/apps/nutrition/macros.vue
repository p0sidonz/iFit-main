<template>
  <b-card title="Macronutrients">
    <b-row>
      <br />
      <!-- alert -->
      <b-col sm="12" md="6" xl="3" class="mb-2">
        <b-input-group prepend="Total Calories">
          <b-form-input readonly v-model="macros.target_calories" />
        </b-input-group>
      </b-col>

      <b-col md="6" xl="3" class="mb-6">
        <b-input-group
          :prepend="
            macros.macro_type === 'gram' ? 'Protein (g)' : 'Protein (%)'
          "
        >
          <b-form-input v-model.number="macros.target_protein" />
        </b-input-group>
      </b-col>
      <b-col md="6" xl="3" class="mb-6">
        <b-input-group
          :prepend="macros.macro_type === 'gram' ? 'Carbs (g)' : 'Carbs (%)'"
        >
          <b-form-input v-model.number="macros.target_carbs" />
        </b-input-group>
      </b-col>

      <b-col md="6" xl="3" class="mb-6">
        <b-input-group
          :prepend="macros.macro_type === 'gram' ? 'Fat (g)' : 'Fat (%)'"
        >
          <b-form-input v-model.number="macros.target_fat" />
        </b-input-group>
      </b-col>

      <b-col md="6" xl="3" class="mb-6">
        <b-input-group prepend="Fiber (g)">
          <b-form-input v-model.number="macros.target_fibre" />
        </b-input-group>
      </b-col>

      <b-col md="6" xl="3" class="mb-6">
        <b-input-group prepend="Sodium (m g)">
          <b-form-input v-model.number="macros.target_sodium" />
        </b-input-group>
      </b-col>

      <b-col md="6" xl="3" class="mb-6">
        <b-input-group prepend="Sugar (g)">
          <b-form-input v-model.number="macros.target_sugar" />
        </b-input-group>
      </b-col>

      <b-col md="6" xl="3" class="mb-6">
        <b-input-group prepend="Type">
          <v-select
            v-model="macros.macro_type"
            label="title"
            :options="option"
          />
        </b-input-group>
      </b-col>
    </b-row>
    <br />
    <b-button
      v-if="macronutrients.target_calories !== macros.target_calories"
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      size="sm"
      variant="primary"
      class="mr-50"
      @click="saveMacros"
    >
      Save
    </b-button>
    <br />

    <b-alert
      v-model="showDismissibleAlert"
      v-height-fade.appear
      variant="danger"
      dismissible
      class="mb-0"
    >
      <div class="alert-body">
        Total % Value of Protein + Carbs + Fat must be equal to 100
      </div>
    </b-alert>
    <br />
    <b-alert v-if="!macros.is_macro_set" variant="warning" show>
      <h4 class="alert-heading">Warning!</h4>
      <div class="alert-body">You haven't set the target calories yet!</div>
    </b-alert>
    <!-- append and pepend -->
  </b-card>
</template>

<script>
import {
  BAlert,
  BInputGroup,
  BFormInput,
  BInputGroupPrepend,
  BInputGroupAppend,
  BFormGroup,
  BFormTextarea,
  BCard,
  BRow,
  BCol,
  BButton,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { heightFade } from "@core/directives/animations";

import Ripple from "vue-ripple-directive";

export default {
  directives: {
    Ripple,
    "height-fade": heightFade,
  },
  components: {
    BCard,
    BFormTextarea,
    BInputGroup,
    BFormGroup,
    BFormInput,
    BInputGroupPrepend,
    BInputGroupAppend,
    BRow,
    BCol,
    BButton,
    vSelect,
    BAlert,
  },

  props: {
    macronutrients: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      macros: { ...this.macronutrients },
      option: ["gram", "percentage"],
      isPercentagevalid: true,
      showDismissibleAlert: false,
    };
  },
  methods: {
    saveMacros() {
        console.log(this.macronutrients)
        this.$emit("update-macronutrient", {
        macros: { ...this.macros },
        id: this.$route.params.id,
      });
    },
  },
  computed: {
    xx() {
      if (this.macros.macro_type === "gram") {
        this.macros.target_calories =
          this.macros.target_protein * 4 +
          this.macros.target_carbs * 4 +
          this.macros.target_fat * 9;
        this.showDismissibleAlert = false;
      }

      if (
        (this.macros.macro_type === "percentage") &
        (+this.macros.target_protein +
          +this.macros.target_carbs +
          +this.macros.target_fat >
          100)
      ) {
        this.showDismissibleAlert = true;
      }
      if (
        (this.macros.macro_type === "percentage") &
        (+this.macros.target_protein +
          +this.macros.target_carbs +
          +this.macros.target_fat <
          100)
      ) {
        this.showDismissibleAlert = false;
      }
      if (this.macros.macro_type === undefined) {
        this.showDismissibleAlert = true;
      }

      // this.macros.target_fat * 9 +
      // this.macros.target_carbs * 4 +
    },
  },

  watch: {
    xx() {},
  },
};
</script>