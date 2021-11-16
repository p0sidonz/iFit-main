<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isTaskHandlerSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-task-handler-sidebar-active', val)"
      @hidden="clearForm"
      ><template #default="{ hide }">
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 v-if="taskLocal.id" class="mb-0">{{ taskLocal.food_name }}</h5>

          <h5 v-else class="mb-0">Add food to your meal</h5>

          <div>
            <feather-icon icon="TrashIcon" class="cursor-pointer" />

            <feather-icon
              @click="hide"
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
            />
          </div>
        </div>
        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
          <!-- Form -->
          <b-form
            class="p-2"
            @submit.prevent="handleSubmit(onSubmit)"
            @reset.prevent="resetFoodSearch"
          >
            <!-- Form Actions -->
            <div
              v-if="taskLocal.id"
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                <h6 class="text-muted font-weight-bolder">Calories</h6>
                <h3 class="mb-0">
                  {{ taskLocal.calories }}
                </h3>
              </div>
              <div>
                <h6 class="text-muted font-weight-bolder">Carbs</h6>
                <h3 class="mb-0">
                  {{ taskLocal.carbohydrate }}
                </h3>
              </div>
              <div>
                <h6 class="text-muted font-weight-bolder">Protein</h6>
                <h3 class="mb-0">
                  {{ taskLocal.protein }}
                </h3>
              </div>
              <div>
                <h6 class="text-muted font-weight-bolder">Fat</h6>
                <h3 class="mb-0">
                  {{ taskLocal.fat }}
                </h3>
              </div>
              <div>
                <h6 class="text-muted font-weight-bolder">Quantity</h6>
                <h3 class="mb-0">
                  {{ taskLocal.quantity }}
                </h3>
              </div>
            </div>

            <br />

            <b-input-group v-if="!taskLocal.id">
              <b-input-group-prepend>
                <b-button variant="outline-primary">
                  <feather-icon icon="SearchIcon" />
                </b-button>
              </b-input-group-prepend>
              <b-form-input
                v-model="query"
                v-on:input="fetchtheFood"
                placeholder="May be chicken...?"
              />
              <b-input-group-append>
                <b-button variant="outline-primary">Search</b-button>
              </b-input-group-append>
            </b-input-group>

            <br />

            <b-spinner
              v-show="isLoadingx"
              variant="primary"
              label="Text Centered"
            />

            <b-list-group v-if="!taskLocal.food_id">
              <b-list-group-item
                href="#"
                @click="fetchIndividualFood(data.food_id)"
                v-for="data in fetchedResult"
                :key="data.index"
                class="flex-column align-items-start"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">
                    {{ data.food_name }}
                  </h5>

                  <small class="text-secondary">
                    Food Type: {{ data.food_type }}</small
                  >
                </div>
                <b-card-text class="mb-1">
                  {{ data.food_description }}
                </b-card-text>
              </b-list-group-item>
            </b-list-group>

            <label v-if="taskLocal.id" for="sb-inline" class="mr-2"
              >Serving Size ({{ task.serving_description }})</label
            >
            <b-form-spinbutton
              v-if="taskLocal.id"
              id="sb-inline"
              v-model="taskLocal.quantity"
            />

            <div v-if="singleFood">
              <b-form-group>
                <label for="sb-inline" class="mr-2">Serving Size </label>
                <v-select
                  v-model="selected"
                  label="serving_description"
                  :options="singleFood.servings.serving"
                />
                <!-- 
    <b-form-select
      v-model="taskLocal"
      :options="singleFood.servings.serving"
    /> -->
                <!-- <label for="sb-inline" class="mr-2"> Number Of Servings </label>
                <b-form-spinbutton
                  v-if="taskLocal.number_of_units"
                  id="sb-inline"
                  step="0.5"
                  v-model="taskLocal.number_of_units"
                /> -->
              </b-form-group>
            </div>
            <!-- 
            <b-button
              v-if="singleFood"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              @click="
                $emit('update:is-task-handler-sidebar-active', false);
                
              "
            >
              Add Food to meal 
            </b-button> -->

            <div class="d-flex mt-2">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
                @click="
                  $emit('update:is-task-handler-sidebar-active', true);
                  $emit('close-left-sidebar');
                  $emit('add-foods', selected, task.id, singleFood.food_name);
                "
              >
                {{ taskLocal.id ? "Update" : "Add " }}
              </b-button>

              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
              >
                Reset
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BAvatar,
  BButton,
  BCard,
  BBadge,
  BCardTitle,
  BCardText,
  BFormInvalidFeedback,
  BListGroup,
  BListGroupItem,
  BInputGroupPrepend,
  BInputGroup,
  BInputGroupAppend,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, url } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import { toRefs } from "@vue/composition-api";
import useTaskHandler from "./useTaskHandler";
import { VueAutosuggest } from "vue-autosuggest";
import { BFormSpinbutton } from "bootstrap-vue";
import BCardCode from "@core/components/b-card-code/BCardCode.vue";

import { ref, watch } from "@vue/composition-api";
import axios from "axios";

export default {
  components: {
    // BSV
    VueAutosuggest,
    BFormSpinbutton,
    BCardCode,
    BButton,
    BSidebar,
    BForm,
    BFormGroup,
    BInputGroupPrepend,
    BInputGroupAppend,
    BInputGroup,
    BFormInput,
    BAvatar,
    BFormInvalidFeedback,
    BListGroup,
    BListGroupItem,
    // 3rd party packages
    vSelect,
    flatPickr,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
    BSpinner,
    BCard,
    BBadge,
    BCardTitle,
    BCardText,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isTaskHandlerSidebarActive",
    event: "update:is-task-handler-sidebar-active",
  },
  props: {
    isTaskHandlerSidebarActive: {
      type: Boolean,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    clearTaskData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      required,
      email,
      url,
      query: "",
      fetchedResult: [],
      isLoadingx: false,
      singleFood: null,
      selected: null,
    };
  },

  computed: {
    calcu() {
      if (this.taskLocal !== undefined) {
        return (
          (this.taskLocal.calories =
            this.task.per_serving_cals * this.taskLocal.quantity),
          (this.taskLocal.carbohydrate =
            this.task.carbohydrate * this.taskLocal.quantity),
          (this.taskLocal.protein =
            this.task.protein * this.taskLocal.quantity),
          (this.taskLocal.fat = this.task.fat * this.taskLocal.quantity)
        );
      }
    },
  },
  watch: {
    calcu() {},
  },

  methods: {
    resetFoodSearch() {
      this.singleFood = null;
      this.fetchedResult = null;
      this.query = null;
    },

    fetchtheFood() {
      this.singleFood = null;
      if (this.query === "") {
        this.fetchedResult = null;
        return;
      }
      this.isLoadingx = true;
      this.$http
        .get(
          `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${this.query}&format=json`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNzdBNzkyMERFNDM1NDQ5QkUxNEEwNTI5QkZFNjQxNUEzOTZFRjgiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJZSGVua2cza05VU2I0VW9GS2JfbVFWbzVidmcifQ.eyJuYmYiOjE2MzM4MzcxMDUsImV4cCI6MTYzMzkyMzUwNSwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiIyZTY1YjdhMjNlNGY0NmZhYTA2OTFhNjZjZmU4MDhlOCIsInNjb3BlIjpbImJhc2ljIl19.VUsomul5qwCK7LP8jmMzSoPTw7zQNRikCvxET9T58jj_0lxMnfLt6T99xXUpNH_Bh4yNtl9X5pZeR0Dgg2IMNBxBiLvt0bdG1hURSL0xZQVt1fcPh1a3QiQQNx-LDYymzwGB_-Rx0XxYLbnJ1OCq8xnZBdcWMTPOiDkhBMZCLnYltwoRrDH4wtlJPGZSwz9NDBbIuC2S8i5gahSfKULbecRRwLfcRYpTfcrH_7uvdYskAmwh2MNcPvGubpK3QqY22NQlA_7UVLUO-s6nE5HNAQgmM8JCbt-hsG4MrHndQIW6_AuG4PeT0kzsVjGhjVkErhjsLdqW4K0f2UOVHbO4BGODoqK4KCpY9lG13BfXyvRsA7P_GesKV18EY9W6lTnNwAUe0I_9uFrE_yQ2AO7j70oAXuR7xFRlvKU1tytn4Vyc_a_m-iaMqapiKmdgV_dpy2vjmjrreqPWcEsA4LLladuDeF0gmjJwLyGIPIklU7u5K-0gP0cMhy--DdpsJGkC8LujDDIWBRSDxm6WVjJUo9zklVu8_OwS5e6pTTsTwE77hUgn8w9t5QIUfrCB57s1nRI7qS8CJKPLBFnaMIdDUmsqFBGrShNpobaz3TsWFQuTPZIKSfTO5UqVCmGTf9h6Fz8Z09BRXlWLiDk5j0UOhwM_jgLuUkSiB75eaA_TJUk",
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.fetchedResult = res.data.foods.food;
          console.log(this.fetchedResult);
          this.isLoadingx = false;
        });
    },

    fetchIndividualFood(food_id) {
      this.fetchedResult = null;
      this.$http
        .get(
          `https://platform.fatsecret.com/rest/server.api?method=food.get.v2&food_id=${food_id}&format=json`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNzdBNzkyMERFNDM1NDQ5QkUxNEEwNTI5QkZFNjQxNUEzOTZFRjgiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJZSGVua2cza05VU2I0VW9GS2JfbVFWbzVidmcifQ.eyJuYmYiOjE2MzM4MzcxMDUsImV4cCI6MTYzMzkyMzUwNSwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiIyZTY1YjdhMjNlNGY0NmZhYTA2OTFhNjZjZmU4MDhlOCIsInNjb3BlIjpbImJhc2ljIl19.VUsomul5qwCK7LP8jmMzSoPTw7zQNRikCvxET9T58jj_0lxMnfLt6T99xXUpNH_Bh4yNtl9X5pZeR0Dgg2IMNBxBiLvt0bdG1hURSL0xZQVt1fcPh1a3QiQQNx-LDYymzwGB_-Rx0XxYLbnJ1OCq8xnZBdcWMTPOiDkhBMZCLnYltwoRrDH4wtlJPGZSwz9NDBbIuC2S8i5gahSfKULbecRRwLfcRYpTfcrH_7uvdYskAmwh2MNcPvGubpK3QqY22NQlA_7UVLUO-s6nE5HNAQgmM8JCbt-hsG4MrHndQIW6_AuG4PeT0kzsVjGhjVkErhjsLdqW4K0f2UOVHbO4BGODoqK4KCpY9lG13BfXyvRsA7P_GesKV18EY9W6lTnNwAUe0I_9uFrE_yQ2AO7j70oAXuR7xFRlvKU1tytn4Vyc_a_m-iaMqapiKmdgV_dpy2vjmjrreqPWcEsA4LLladuDeF0gmjJwLyGIPIklU7u5K-0gP0cMhy--DdpsJGkC8LujDDIWBRSDxm6WVjJUo9zklVu8_OwS5e6pTTsTwE77hUgn8w9t5QIUfrCB57s1nRI7qS8CJKPLBFnaMIdDUmsqFBGrShNpobaz3TsWFQuTPZIKSfTO5UqVCmGTf9h6Fz8Z09BRXlWLiDk5j0UOhwM_jgLuUkSiB75eaA_TJUk",
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.singleFood = res.data.food;
          console.log("singlefood", this.singleFood);
        });
    },
    
  },

  setup(props, { emit }) {
    const {
      taskLocal,
      resetTaskLocal,
      isLoading = ref(false),

      // UI
      assigneeOptions,
      onSubmit,
      tagOptions,
      resolveAvatarVariant,
    } = useTaskHandler(toRefs(props), emit);

    const { refFormObserver, getValidationState, resetForm, clearForm } =
      formValidation(resetTaskLocal, props.clearTaskData);

    const editorOption = {
      modules: {
        toolbar: "#quill-toolbar",
      },
      placeholder: "Write your description",
    };

    return {
      // Add New
      taskLocal,
      onSubmit,
      assigneeOptions,
      tagOptions,
      isLoading,
      // Form Validation
      resetForm,
      clearForm,
      refFormObserver,
      getValidationState,

      // UI

      // Filter/Formatter
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@core/scss/vue/libs/quill.scss";
</style>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/include";

.assignee-selector {
  ::v-deep .vs__dropdown-toggle {
    padding-left: 0;
  }
}

#quil-content ::v-deep {
  > .ql-container {
    border-bottom: 0;
  }

  + #quill-toolbar {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}

pre {
  min-height: 295px;
  padding: 1.5rem;
  margin-bottom: 0;
  border-radius: 0.5rem;
}
</style>
