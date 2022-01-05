<template>
  <div>
        <div v-if="isLoading">
      <b-spinner small class="mr-1" variant="primary" />
    </div>
      <div v-else>
  
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
                  >Last Updated:
                  {{ programs.updated_at | moment("from", "now") }}</b-badge
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
                  <div class="bg-light-secondary position-relative p-1">
                    <h4 class="mb-1 me-1">Day {{ day_index + 1 }}</h4>

                    <div v-if="days.workout">
                      <div class="text-center">
                        <b-badge href="#" class="d-block" variant="primary">
                          {{ days.workout.title }}
                        </b-badge>
                      </div>
                    </div>
                    <div v-else-if="!days.workout && !days.rest_day">
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
                    <b-dropdown
                      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                      text="Add Items"
                      variant="flat-primary"
                    >
                      <b-dropdown-item
                        @click="addRestDay(week_index, day_index)"
                      >
                        Rest Day
                      </b-dropdown-item>
                      <!-- <b-dropdown-item> Assign Diet </b-dropdown-item> -->
                      <b-dropdown-item
                        @click="showAddWorkoutModal(week_index, day_index)"
                      >
                        Add Workout
                      </b-dropdown-item>

                      <b-dropdown-divider />
                      <b-dropdown-item
                        @click="removeItemFromDay(week_index, day_index)"
                        >Remove all</b-dropdown-item
                      >
                    </b-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>

        <template #footer>
          <b-button
            size="sm"
            v-ripple.400="'rgba(234, 84, 85, 0.15)'"
            variant="flat-danger"
            @click="removeWeek(week_index)"
          >
            <feather-icon icon="XIcon" class="mr-50" />

            Remove
          </b-button>
        </template>
      </b-card>
      <!-- add workout modal -->

      <b-modal
        id="workout_search"
        size="lg"
        title="Add workout"
        hide-footer
        v-model="addWorkoutModal"
        scrollable:true
      >
        <b-row>
          <b-col lg="12" class="mb-1">
            <b-input-group>
              <b-form-input
                v-on:input="addWorkoutToDay"
                v-model="workoutSearchValue"
                placeholder=""
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
            <div @click="addExcerciseToDayLocal(data)" class="detail ml-50">
              <b-card-text class="mb-0">
                {{ data.title }}
              </b-card-text>
              <small class="text-muted"> 12:12:12 </small>
            </div>
          </div>
        </div>
      </b-modal>

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
        <b-col>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
            block
            @click="addNewWeek"
          >
            <feather-icon icon="PlusIcon" class="mr-50" />
            Add Week
          </b-button>
        </b-col>
        <b-col>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-success"
            block
            @click="saveProgram"
          >
            <feather-icon icon="SaveIcon" class="mr-50" />
            Save
          </b-button>
        </b-col>
      </b-row>
    </template>
     </div>
  </div>
</template>

<script>
import store from "@/store";
import { ref, watch, computed, onUnmounted } from "@vue/composition-api";
import programStoreModule from "./programStoreModule";
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
  methods: {
    saveProgram() {
      let res = this.weeks_days.map((xxx, index) => {
        let deep = xxx.program_days.map((item2, index2) => {
          delete item2.completed;
          delete item2.workout;
          return item2;
        });
        let constrain = {
          constraint: "program_days_pkey",
          update_columns: ["workout_id", "rest_day"],
        };
        delete xxx.program_days;
        xxx.program_days = {};
        xxx.program_days.on_conflict = { ...constrain };
        xxx.program_days.data = [];
        xxx.program_days.data = deep;
        return xxx;
      });
      store
        .dispatch("app-program/saveProgram", {
          data: res,
        })
        .then((response) => {
          if (response.data.data.insert_Fitness_program_weeks.affected_rows) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Excercise Saved",
                icon: "BellIcon",
                variant: "success",
              },
            });
          }
        });
    },
    addRestDay(week_index, day_index) {
      this.weeks_days[week_index].program_days[day_index].workout = null;
      this.weeks_days[week_index].program_days[day_index].rest_day = true;
    },
    addNewWeek(week_index) {
      let p_id = this.$route.params.id;
      let test = {
        program_id: this.$route.params.id,
        program_days: [
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
          {
            rest_day: false,
            completed: false,
            workout: null,
          },
        ],
      };
      this.weeks_days.push(test);
    },
    removeWeek(week_index) {
      this.isLoadingx = true;

      if (this.weeks_days[week_index].id) {
        this.$swal({
          title: "Are you sure?",
          text: "You won't be able to revert this!x",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            store
              .dispatch(
                "app-program/deleteWeek",
                this.weeks_days[week_index].id
              )
              .then((response) => {
                console.log("DIET DELETE RESPONSE", response);
                // totalInvoices.value = total
                this.isLoadingx = false;

                this.$swal({
                  icon: "success",
                  title: "Deleted!",
                  text: "Deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
              });

            this.fetchExcercise();
          }
        });
      } else if (!this.weeks_days[week_index].id) {
        console.log("Locally removed from array");
        this.weeks_days.splice(week_index, 1);
      }
    },
    removeItemFromDay(week_index, day_index) {
      this.weeks_days[week_index].program_days[day_index].rest_day = false;
      this.weeks_days[week_index].program_days[day_index].workout = null;
      this.weeks_days[week_index].program_days[day_index].workout_id = null;
    },
    addExcerciseToDayLocal(data) {
      let exID = data.id;
      let singleWorkout = data;
      delete singleWorkout.id;
      singleWorkout.workout_id = exID;
      this.weeks_days[this.wk].program_days[this.dy].rest_day = false;
      this.weeks_days[this.wk].program_days[this.dy].workout = singleWorkout;
      this.weeks_days[this.wk].program_days[this.dy].workout_id = exID;
      this.$bvModal.hide("workout_search");
      //flush everything.
      (this.wk = ""), (this.day = ""), (this.fetchedWorkoutResult = null);
      this.workoutSearchValue = "";
    },
    addWorkoutToDay() {
      console.log(this.wk, this.dy);
      if (this.workoutSearchValue === "" || this.workoutSearchValue === " ") {
        return (this.fetchedWorkoutResult = null);
      } else {
        this.isLoadingx = true;
        store
          .dispatch("app-program/searchWorkout", {
            value: this.workoutSearchValue,
          })
          .then((response) => {
            this.isLoadingx = false;
            this.fetchedWorkoutResult = response.data.data.Fitness_workout;
          });
      }
    },
    AddExcercise(ex_data) {
      let exercise = {};
      let json_sets = [];
      exercise.id = ex_data.id;
      exercise.title = ex_data.title;
      this.excercies_and_sets.push({ exercise: exercise, json_sets });
      this.fetchedExcerciseResult = null;
      this.$toast({
        component: ToastificationContent,
        props: {
          title: "Success",
          icon: "BellIcon",
          variant: "success",
        },
      });
      //  store
      //   .dispatch("app-workout/addExcercise",{excerciseId: id, workoutID: this.$route.params.id }).then((response) => {
      //     this.fetchExcercise()
      //     this.$toast({
      //       component: ToastificationContent,
      //       props: {
      //         title: "Success",
      //         icon: "BellIcon",
      //         variant: "success",
      //       },
      //     });
      //   })
      this.$bvModal.hide("idk2");
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
          .dispatch("app-program/searchExcercise", {
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
    showAddWorkoutModal(week_index, day_index) {
      this.addWorkoutModal = true;
      (this.wk = week_index), (this.dy = day_index);
    },
    repeateAgain(index) {
      console.log(index);
      this.excercies_and_sets[index].json_sets.push({});
      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight);
      });
    },
    removeItem(index, index_set) {
      console.log(index, index_set);
      this.excercies_and_sets[index].json_sets.splice(index_set, 1);
      this.trTrimHeight(this.$refs.row[0].offsetHeight);
    },
    initTrHeight() {
      this.trSetHeight(null);
      this.$nextTick(() => {
        this.trSetHeight(this.$refs.form.scrollHeight);
      });
    },
  },
  data() {
    return {
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
    };
  },
  setup() {
    const toast = useToast();
        const isLoading = ref(false)

    const TODO_APP_STORE_MODULE_NAME = "app-program";
    const programs = ref({});
    const weeks_days = ref([]);
    // Register module
    if (!store.hasModule(TODO_APP_STORE_MODULE_NAME))
      store.registerModule(TODO_APP_STORE_MODULE_NAME, programStoreModule);
    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TODO_APP_STORE_MODULE_NAME))
        store.unregisterModule(TODO_APP_STORE_MODULE_NAME);
    });
    const { route, router } = useRouter();
    const statusOptions = ["Vegetarian", "NonVegetarian", "Vegan"];
    const fetchExcercise = () => {
      isLoading.value = true
      console.log("hahah");
      store
        .dispatch("app-program/getWorkout", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
           isLoading.value = false
          console.log("GET Programs", response.data.data.Fitness_program_by_pk);
          programs.value = response.data.data.Fitness_program_by_pk;
          weeks_days.value =
            response.data.data.Fitness_program_by_pk.workout_weeks;
            
        })
        .catch((error) => {
                   isLoading.value = false

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
      isLoading
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
// .col {
//   max-width: 180px;
// }
</style>
 