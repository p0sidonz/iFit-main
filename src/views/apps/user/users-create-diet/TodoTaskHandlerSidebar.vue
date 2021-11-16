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
            @reset.prevent="resetForm"
          >
            <!-- Title -->

            <!-- <vue-autosuggest


    :suggestions="filteredOptions"
    :input-props="inputProps"
    :on-selected="onSelected"
    :limit="10"
    @input="onInputChange"
  >
    <template slot-scope="{suggestion}">
      <div class="d-flex align-items-center">
        <b-avatar :src="suggestion.item.img" />
        <div class="detail ml-50">
          <b-card-text class="mb-0">
            {{ suggestion.item.name }}
          </b-card-text>
          <small class="text-muted">
            {{ suggestion.item.time }}
          </small>
        </div>
      </div>
    </template>
  </vue-autosuggest> -->

            <!-- Assignee -->

            <!-- due Date -->
            <!-- <b-form-group
        label="Calories"
        label-for="plainTextInput"
      >
        <b-form-input
          id="plainTextInput"
          plaintext
          :value="taskLocal.kals"
        />
      </b-form-group>

      <b-form-group
        label="Protein"
        label-for="plainTextInput"
      >
        <b-form-input
          id="plainTextInput"
          plaintext
          :value="taskLocal.protein"
        />
      </b-form-group>
      <b-form-group
        label="Fat"
        label-for="plainTextInput"
      >
        <b-form-input
          id="plainTextInput"
          plaintext
          :value="taskLocal.fat"
        />
      </b-form-group>
      <b-form-group
        label="Carbs"
        label-for="plainTextInput"
      >
        <b-form-input
          id="plainTextInput"
          plaintext
          :value="taskLocal.carbs"
        />
      </b-form-group> -->

            <!--Tag -->
            <!-- <b-form-group
              label="Tag"
              label-for="tag"
            >
              <v-select
                v-model="taskLocal.tags"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                multiple
                :close-on-select="false"
                :options="tagOptions"
                :reduce="option => option.value"
                input-id="tags"
              />
            </b-form-group> -->

            <!-- Description -->

            <!-- Form Actions -->
            <div
              v-if="taskLocal.id"
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                <h6 class="text-muted font-weight-bolder">Calories</h6>
                <h3 class="mb-0">
                  {{ taskLocal.kals }}
                </h3>
              </div>
              <div>
                <h6 class="text-muted font-weight-bolder">Carbs</h6>
                <h3 class="mb-0">
                  {{ taskLocal.carbs }}
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
                <h6 class="text-muted font-weight-bolder">Serving Size</h6>
                <h3 class="mb-0">
                  {{ taskLocal.serving_size }}
                </h3>
              </div>
            </div>

            <br />
            <h1 v-if="!taskLocal.id">Search food here</h1>
            <label for="sb-inline" class="mr-2">Serving Size</label>
            <b-form-spinbutton
              id="sb-inline"
              v-model="taskLocal.serving_size"
            />

            <div class="d-flex mt-2">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
                @click="$emit('update:is-task-handler-sidebar-active', true); $emit('close-left-sidebar')"
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
import { ref, watch } from "@vue/composition-api";
import dietStoreModule from "./DietStoreModule";

export default {
  components: {
    // BSV
    VueAutosuggest,
    BFormSpinbutton,
    BButton,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BAvatar,
    BFormInvalidFeedback,

    // 3rd party packages
    vSelect,
    flatPickr,

    // Form Validation
    ValidationProvider,
    ValidationObserver,

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

      datasuggest: [],
      filteredOptions: [],
      inputProps: {
        id: "autosuggest__input",
        class: "form-control",
        placeholder: "Search the food...",
      },
      limit: 10,
    };
  },

  computed: {
    calcu() {
      return (
        (this.taskLocal.kals = this.task.kals * this.taskLocal.serving_size),
        (this.taskLocal.carbs = this.task.carbs * this.taskLocal.serving_size),
        (this.taskLocal.protein = this.task.protein * this.taskLocal.serving_size),
        (this.taskLocal.fat = this.task.fat * this.taskLocal.serving_size)
      );
    },
  },
  watch: {
    calcu() {},
  },

  methods: {
    onSelected(option) {
      this.selected = option.item;
    },
    // onInputChange(text) {
    //   if (text === "" || text === undefined) {
    //     return;
    //   } else {
    //     console.log(text);
    //     this.$http
    //       .get(
    //         `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${text}&format=json`,
    //         {
    //           headers: {
    //             Authorization:
    //               "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzRTFGRDgwMTQ0Q0IwQTI4NDRFMzI4REZCNUU4NTQyRDE0QUI2RUYiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFLUg5Z0JSTXNLS0VUaktOLTE2RlF0Rkt0dTgifQ.eyJuYmYiOjE2MzI2MjgxNTIsImV4cCI6MTYzMjcxNDU1MiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiIyZTY1YjdhMjNlNGY0NmZhYTA2OTFhNjZjZmU4MDhlOCIsInNjb3BlIjpbImJhc2ljIl19.E9qpkRuwegKbsqGp3XPbMdpgITn6_4zT8nIgO-NCHA_yJZuVtsSkPoMp2QD6VOaMTAaLh95eZZm_sUi2Nt09PKsbmjM6_Ekxhgg7L6eCvEXm5xU3GuYO2PJIU_attwc-jW2C-h1BghkUf_Dgkaw8JVE_5JX-3JfBi0uoPX5Ql0MbrLGvsoulRft4JMVHOg2m-rtsBVOBNpJWyHckTMpRTF5tkjT4xrqR2xjnEya1noHJUhtz0gcckaseSPr-UjEUbp1UkCxM_ONXjO_10nP4QPlvVXuDmO1QBe8GrMy8yLotl56Iq3F4L-ioravNLmwaTETM4c-wlVyQ4xawmHEP7w",
    //             Cookie:
    //               "AWSALB=lNlL2J/i//WYjVh/XhwTsmCoyRhhWSseVFY2uztUZb43vfCZg7UgUKXBBOpVwUM5cDWubui9apR2x2oJ4qZiMj0AfHJPbHn6klS7H8dF3WM/5o5MoGF/2DsjV8en; AWSALBCORS=lNlL2J/i//WYjVh/XhwTsmCoyRhhWSseVFY2uztUZb43vfCZg7UgUKXBBOpVwUM5cDWubui9apR2x2oJ4qZiMj0AfHJPbHn6klS7H8dF3WM/5o5MoGF/2DsjV8en",
    //           },
    //         }
    //       )
    //       .then((res) => {
    //         this.datasuggest = res.foods.food;
    //       });
    //   }
    //   /* Full control over filtering. Maybe fetch from API?! Up to you!!! */
    //   const filteredDevelopers = this.datasuggest.data[0].developers
    //     .filter(
    //       (item) => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
    //     )
    //     .slice(0, this.limit);
    //   const filteredDesigner = this.datasuggest.data[0].designers
    //     .filter(
    //       (item) => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
    //     )
    //     .slice(0, this.limit);
    //   const filteredData = filteredDevelopers.concat(filteredDesigner);
    //   this.filteredOptions = [
    //     {
    //       data: filteredData,
    //     },
    //   ];
    // },
  },

  setup(props, { emit }) {
    const {
      taskLocal,
      resetTaskLocal,

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
    
    const isLoading = ref(false);
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
</style>
