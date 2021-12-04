<template>
  <div>
    <b-alert variant="danger" :show="!programs">
      <h4 class="alert-heading">Error fetching Programs</h4>
      <div class="alert-body">
        Pleae hit back
        <b-link class="alert-link" :to="{ name: 'program-list' }">
          Programs List
        </b-link>
      </div>
    </b-alert>
    <template v-if="programs">
      <b-row class="invoice-padding pt-0">
        <b-col cols="12" xl="12" class="mb-lg-1">
          <section id="diet">
            <b-card
              no-body
              class="diet"
              :style="{
                backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
              }"
            >
              <b-card-body class="text-center">
                <h2 class="text-primary">
                  {{ programs.title.toUpperCase() }}
                </h2>

                <b-card-text class="mb-2">
                  {{ programs.description }}
                </b-card-text>
              </b-card-body>

              <template #footer>
                <b-badge pill variant="light-primary"
                  >Last Updated: {{ programs.updated_at | moment("from", "now") }}</b-badge
                >
              </template>
            </b-card>

            <b-alert v-if="!weeks_days.length" variant="warning" show>
              <h4 class="alert-heading">Warning!</h4>
              <div class="alert-body">
                You haven't added any excersise yet!
                <b-link class="alert-link" @click="addNewWeek">
                  click here to add a week
                </b-link>
              </div>
            </b-alert>
          </section>
        </b-col>
      </b-row>

      <b-card
        v-for="(week, week_index) in weeks_days"
        :key="week_index"
        no-body
        class="card-developer-meetup"
      >
        <b-card-body>
          <div class="container">
                          <div class="meetup-day">
                <h6 class="mb-0">WEEK</h6>
                <h3 class="mb-0">{{ week_index + 1 }}</h3>
              </div>
            <div class="row">


              <div
                v-for="(days, day_index) in week.program_days"
                :key="day_index"
                class="col-sm"
              >
                <div class="justify-content-around">
                  <div class="bg-light-secondary position-relative  p-1">
                    <h4 class="mb-1 me-1">Day {{ day_index + 1 }}</h4>

                    <div v-if="days.workout">
                      <div class="text-center">
                        <b-badge href="#" class="d-block" variant="primary">
                          {{ days.workout.title }}
                        </b-badge>
                      </div>
                    </div>
                    <div v-else-if="!days.workout">
                      <div class="text-center">
                        <b-badge pill variant="light-secondary">
                          No workout
                        </b-badge>
                      </div>
                    </div>

                    <div v-show="days.rest_day">
                      <div class="text-center">
                        <b-badge pill variant="light-secondary">
                          Rest Day
                        </b-badge>
                      </div>
                    </div>
                    <br />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>


      </b-card>
      <!-- add workout modal -->



      <!-- end of add workout modal -->

      <b-modal
        id="idk2"
        size="lg"
        title="Add New Excercise"
        hide-footer
        v-model="modalShow"
        scrollable:true
      >
        <b-row>
          <b-col lg="12" class="mb-1">
            <!-- button on right -->
            <b-input-group>
              <b-form-input
                v-on:input="excerciseSearch"
                v-model="excerciseSearchValue"
                placeholder="...May be Leg Press?"
              />
              <b-input-group-append>
                <b-button variant="outline-primary"> GO </b-button>
              </b-input-group-append>
            </b-input-group>
            <b-spinner
              v-show="isLoadingx"
              variant="primary"
              label="Text Centered"
            />
          </b-col>
        </b-row>
        <div v-if="fetchedWorkoutResult">
          <div
            v-for="data in fetchedWorkoutResult"
            :key="data.index"
            class="d-flex align-items-center"
          >
            <div @click="AddExcercise(data)" class="detail ml-50">
              <b-card-text class="mb-0">
                {{ data.title }}
              </b-card-text>
              <small class="text-muted"> 12:12:12 </small>
            </div>
          </div>
        </div>
      </b-modal>

      <b-row align-h="center">

          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-success"
          >
            <feather-icon icon="SaveIcon" class="mr-50" />
            Add Program to calendar
          </b-button>
      </b-row>
    </template>
  </div>
</template>

<script>
import store from "@/store";
import { ref, watch, computed, onUnmounted } from "@vue/composition-api";
import userStoreModule from "../userStoreModule";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
import vSelect from "vue-select";

import {
  BSpinner,
  BFormInput,
  BForm,
  BInputGroup,
  BInputGroupPrepend,
  BDropdown,
  BDropdownItem,
  BFormCheckbox,
  BAvatar,
  BAlert,
  BLink,
  BCardHeader,
  BCard,
  BImg,
  BButton,
  BRow,
  BCol,
  BTable,
  BCardText,
  BCardBody,
  BCardTitle,
  BBadge,
  BCardFooter,
  BModal,
  BInputGroupAppend,
  BFormGroup,
  BFormTextarea,
  BFormSelect,
  BMedia,
  BDropdownDivider,
} from "bootstrap-vue";
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useRouter } from "@core/utils/utils";
import Ripple from "vue-ripple-directive";
import { heightTransition } from "@core/mixins/ui/transition";
import { VueAutosuggest } from "vue-autosuggest";
import Cleave from "vue-cleave-component";
import { mergeArrays } from "helprjs";
import { integer } from "vee-validate/dist/rules";

export default {
  directives: {
    Ripple,
  },

  mixins: [heightTransition],

  components: {
    VueAutosuggest,
    BMedia,
    BImg,
    BFormSelect,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BForm,
    BAvatar,
    BAlert,
    BLink,
    BCardHeader,
    BCard,
    BButton,
    BRow,
    BCol,
    BTable,
    BCardText,
    BCardBody,
    BCardTitle,
    BBadge,
    BCardFooter,
    BModal,
    BCardActions,
    vSelect,
    BInputGroupAppend,
    BFormGroup,
    BFormTextarea,
    BSpinner,
    Cleave,
    BDropdownDivider,
  },

  props: {
    rid: {
      type: integer,
      default: () => 0,
    },
  },
  methods: {
    oops() {
      if (this.rid === 0) {
        return;
      }
      console.log();
      let getTheProgram = this.test[0].workout_weeks;
      let xwoops = getTheProgram.map((item, index) => {
        let chip = [];
        chip = item.pg_days_obj;
        chip.all_day = false;
        chip.relation_id = this.rid;
        chip.type = "program"
        delete chip.id
        delete chip.rest_day;
        delete chip.workout_id;
        chip.workout_id = 10
        return chip;
      });
      let days = [];
      const dateStart = this.$moment(this.programs.updated_at);
      const dateEnd = this.$moment(dateStart).add(xwoops.length - 1, "days");
      while (dateEnd.diff(dateStart, "days") >= 0) {
        days.push({
          start: dateStart.format("YYYY-MM-D"),
          end: dateStart.format("YYYY-MM-D"),
        });

        dateStart.add(1, "days");
      }
      const result = mergeArrays(xwoops, days);
      console.log(result);
    },

    excerciseSearch() {
      console.log(this.excerciseSearchValue);
      if (
        this.excerciseSearchValue === "" ||
        this.excerciseSearchValue === " "
      ) {
        return (this.fetchedExcerciseResult = null);
      } else {
        this.isLoadingx = true;
        store
          .dispatch("app-user/searchExcercise", {
            value: this.excerciseSearchValue,
          })
          .then((response) => {
            console.log(response);
            this.isLoadingx = false;
            this.fetchedExcerciseResult = response.data.data.Fitness_exercise;
            // this.$toast({
            //   component: ToastificationContent,
            //   props: {
            //     title: "Success",
            //     icon: "BellIcon",
            //     variant: "success",
            //   },
            // });
          });
      }
    },
  },

  data() {
    return {
      xwoops: [],
      xwoops_days: [],
      macros: [],
      weight: ["KG", "LBS"],
      isPercentagevalid: true,
      showDismissibleAlert: false,
      modalShow: false,
      items: [],
      nextTodoId: 2,
      excerciseSearchValue: "",
      fetchedExcerciseResult: null,
      singleExcercise: null,
      isLoadingx: false,
      options: {
        reps: {
          delimiters: ["-", "-"],
          blocks: [1, 2],
          uppercase: true,
        },
        weight: {
          delimiters: [""],
          blocks: [3],
          uppercase: true,
        },
        tempo: {
          delimiters: ["-", "-", "-"],
          blocks: [1, 1, 1],
          uppercase: true,
        },
      },

      //Week and day indexes post searching diet and workout
      wk: "",
      dy: "",

      //Add workout Modal
      addWorkoutModal: false,
      workoutSearchValue: "",
      fetchedWorkoutResult: null,
      singleWorkout: null,

      test: [
        {
          workout_weeks: [
            {
              pg_days_obj: {
                id: 67,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 68,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 69,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 70,
                workout_id: 10,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 71,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 72,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 73,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 74,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 75,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 76,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 77,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 78,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 79,
                workout_id: null,
                rest_day: false,
              },
            },
            {
              pg_days_obj: {
                id: 80,
                workout_id: null,
                rest_day: false,
              },
            },
          ],
        },
      ],
    };
  },

  setup() {
    const toast = useToast();

    const TODO_APP_STORE_MODULE_NAME = "app-user";

    const programs = ref({});
    const weeks_days = ref([]);

    // Register module
    if (!store.hasModule(TODO_APP_STORE_MODULE_NAME))
      store.registerModule(TODO_APP_STORE_MODULE_NAME, userStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TODO_APP_STORE_MODULE_NAME))
        store.unregisterModule(TODO_APP_STORE_MODULE_NAME);
    });

    const { route, router } = useRouter();

    const statusOptions = ["Vegetarian", "NonVegetarian", "Vegan"];

    const fetchExcercise = () => {
      store
        .dispatch("app-user/getWorkout", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          console.log("GET Programs", response.data.data.Fitness_program_by_pk);
          programs.value = response.data.data.Fitness_program_by_pk;
          weeks_days.value =
            response.data.data.Fitness_program_by_pk.workout_weeks;
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: error,
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    };
    fetchExcercise();
    const printInvoice = () => {
      window.print();
    };

    return {
      programs,
      fetchExcercise,
      statusOptions,
      weeks_days,
      printInvoice,
    };
  },
};
</script>
<style lang="scss" scoped>
.repeater-form {
  overflow: hidden;
  transition: 0.35s height;
}
.bg-light-secondary {
  width: auto;
  height: auto;
  text-align: center;
}
.col {
  max-width: 180px;
}
</style>
 
