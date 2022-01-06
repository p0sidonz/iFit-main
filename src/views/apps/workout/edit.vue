<template>
  <div>
    <b-alert variant="danger" :show="!excercises">
      <h4 class="alert-heading">Error fetching Workouts</h4>
      <div class="alert-body">
        Pleae hit back
        <b-link class="alert-link" :to="{ name: 'workout-list' }">
          Workout List
        </b-link>
      </div>
    </b-alert>
    <template v-if="excercises">
      <b-row class="invoice-padding pt-0">
        <b-col cols="12" xl="9" class="mb-lg-1">
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
                  {{ excercises.title }}
                </h2>

                <b-card-text class="mb-2">
                  {{ excercises.description }}
                </b-card-text>
              </b-card-body>
            </b-card>

            <b-alert v-if="!excercies_and_sets.length" variant="warning" show>
              <h4 class="alert-heading">Warning!</h4>
              <div class="alert-body">
                You haven't added any excersise yet!
                <b-link class="alert-link" @click="modalContent">
                  User List
                </b-link>
              </div>
            </b-alert>

            <b-card-actions
              v-for="(data, index) in excercies_and_sets"
              :key="data.id"
              action-collapse
              action-close
              class="text-primary"
              @close="removeExcercise(index, data)"
              :title="data.exercise.title"
              @titlefunction="showExcerciseDetail(data.exercise.id)"
            >
              <!-- <b-row>
                <b-row md="1">
                  @click="modalContent"
                  <b-col class="p-4">
                    <span>SET </span>
                  </b-col>
                </b-row>

                <b-col md="3" class="p-2">
                  <b-input-group prepend="Weight">
                    <v-select
                      v-model="macros"
                      label="SELECT"
                      :options="weight"
                    />
                  </b-input-group>
                </b-col>
              </b-row> -->

              <div>
                <div>
                  <!-- <b-col md="1" class="p-1">
                        <b-form-group label="(Lbs/Kg)" label-for="item-name">
                          <b-form-select v-model="macros" :options="weight"/>

                        </b-form-group>
                      </b-col> -->
                  <b-form
                    ref="form"
                    :style="{ height: trHeight }"
                    class="repeater-form"
                    @submit.prevent="repeateAgain"
                  >
                    <!-- Row Loop -->
                    <b-row
                      v-for="(item, index_set) in data.json_sets"
                      :id="item.id"
                      :key="item.id"
                      ref="row"
                    >
                      <b-row md="1">
                        <b-col class="p-3">
                          <span> Set {{ index_set + 1 }}</span>
                        </b-col>
                      </b-row>
                      <!-- Item Name -->
                      <b-col md="2" class="p-1">
                        <b-form-group label="(Weight)" label-for="item-name">
                          <cleave
                            id="customDelimiter"
                            v-model="item.weight"
                            class="form-control"
                            :raw="false"
                            :options="options.weight"
                            placeholder="8-12"
                          />
                        </b-form-group>
                      </b-col>

                      <!-- Cost -->
                      <b-col md="2" class="p-1">
                        <b-form-group
                          label="Repetitions (i.e. 8-12)"
                          label-for="cost"
                        >
                          <cleave
                            id="customDelimiter"
                            v-model="item.reps"
                            class="form-control"
                            :raw="false"
                            :options="options.reps"
                            placeholder="8-12"
                          />
                        </b-form-group>
                      </b-col>

                      <!-- Quantity -->
                      <b-col md="2" class="p-1">
                        <b-form-group
                          label="Tempo (1-2-3)"
                          label-for="quantity"
                        >
                          <cleave
                            id="customDelimiter"
                            v-model="item.tempo"
                            class="form-control"
                            :raw="false"
                            :options="options.tempo"
                            placeholder="1-2-3"
                          />
                        </b-form-group>
                      </b-col>
                      <b-col md="2" class="p-1">
                        <b-form-group
                          label="Rest (Seconds)"
                          label-for="quantity"
                        >
                          <cleave
                            id="customDelimiter"
                            v-model="item.rest"
                            class="form-control"
                            :raw="false"
                            :options="options.weight"
                            placeholder="8-12"
                          />
                        </b-form-group>
                      </b-col>

                      <!-- Remove Button -->
                      <b-col md="1" class="mb-50 p-1">
                        <b-button
                          v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                          variant="outline-danger"
                          class="mt-0 mt-md-2"
                          @click="removeItem(index, index_set)"
                        >
                          <feather-icon icon="XIcon" class="mr-25" />
                        </b-button>
                      </b-col>
                      <b-col cols="12">
                        <hr />
                      </b-col>
                    </b-row>
                  </b-form>
                </div>

                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  @click="repeateAgain(index)"
                >
                  <feather-icon icon="PlusIcon" class="mr-25" />
                  <span>Add Set</span>
                </b-button>
              </div>
            </b-card-actions>
          </section>
        </b-col>

        <b-col cols="12" md="4" xl="3" class="invoice-actions">
          <!-- Action Buttons -->
          <b-card>
            <!-- Button: Send Invoice -->
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mb-75"
              block
              @click="modalContent"
            >
              Add Excercise
            </b-button>
            <!-- Button: DOwnload -->
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
              class="mb-75"
              block
              @click="printInvoice"
            >
              Print
            </b-button>

            <!-- Button: Print -->
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
              block
              @click="saveExcercise"
            >
              <div v-if="isLoading">
                <b-spinner small />

                <span class="sr-only">Loading...</span>
              </div>
              <div v-if="!isLoading">
                <span> Save</span>
              </div>
            </b-button>
            <!-- Button: Add Payment -->
          </b-card>

          <!-- Payment Method -->
          <div class="mt-2">
            <b-form-group label="Wight Type" label-for="payment-method">
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                input-id="payment-method"
                class="payment-selector"
                :options="weight"
                :clearable="false"
              />
            </b-form-group>

            <!-- IF workout is active/not -->
            <div class="d-flex justify-content-between align-items-center">
              <label for="patymentTerms">Active</label>
              <b-form-checkbox
                id="patymentTerms"
                :checked="excercises.is_active"
                switch
              />
            </div>
          </div>
        </b-col>
      </b-row>

      <b-modal
        v-model="showExcerciseDetailModal"
        id="excercise-detail"
        title="Excercise detail"
        hide-footer
        size="lg"
      >
        <div v-if="singleExcerciseDetail">
          <div class="blog-detail-wrapper text-center">
            <h1>
              {{ singleExcerciseDetail.title }}
            </h1>

            <b-embed
              v-if="singleExcerciseDetail.video_url"
              type="iframe"
              :src="singleExcerciseDetail.video_url"
              allowfullscreen
              class="rounded mb-50"
            />
          </div>
          <hr />
          <b-media no-body>
            <b-media-aside vertical-align="center" class="mr-50">
              <b-avatar
                :to="{
                  name: 'profile',
                  params: { username: singleExcerciseDetail.User.username },
                }"
                size="24"
                :src="singleExcerciseDetail.User.avatar"
              />
            </b-media-aside>
            <b-media-body>
              <small class="text-muted mr-50">by</small>
              <small>
                <b-link
                  :to="{
                    name: 'profile',
                    params: { username: singleExcerciseDetail.User.username },
                  }"
                  class="text-body"
                  >{{ singleExcerciseDetail.User.fullname }}</b-link
                >
              </small>
              <span class="text-muted ml-75 mr-50">|</span>
              <small class="text-muted">{{
                singleExcerciseDetail.created_at | moment("MMMM Do YYYY")
              }}</small>
            </b-media-body>
          </b-media>

          <div class="my-1 py-25">
            <b-link>
              <b-badge
                pill
                class="mr-75"
                :variant="
                  tagsColor(singleExcerciseDetail.exercise_category.title)
                "
              >
                {{ singleExcerciseDetail.exercise_category.title }}
              </b-badge>
            </b-link>
          </div>

          <div
            class="blog-content"
            v-html="singleExcerciseDetail.description"
          />
        </div>
      </b-modal>

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
        <div v-if="fetchedExcerciseResult">
          <div
            v-for="data in fetchedExcerciseResult"
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
    </template>
  </div>
</template>

<script>
import store from "@/store";
import { ref, watch, computed, onUnmounted } from "@vue/composition-api";
import workoutStoreModule from "./workoutStoreModule";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
import vSelect from "vue-select";

import {
  BMediaAside,
  BMediaBody,
  BEmbed,
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
} from "bootstrap-vue";
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useRouter } from "@core/utils/utils";
import Ripple from "vue-ripple-directive";
import { heightTransition } from "@core/mixins/ui/transition";
import { VueAutosuggest } from "vue-autosuggest";
import Cleave from "vue-cleave-component";
import { GET_EXCERCISE_DETAIL } from "@/queries/";
import gql from "graphql-tag";

export default {
  directives: {
    Ripple,
  },

  mixins: [heightTransition],

  mounted() {
    this.initTrHeight();
  },
  created() {
    window.addEventListener("resize", this.initTrHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.initTrHeight);
  },
  components: {
    VueAutosuggest,
    BLink,
    BMedia,
    BMediaAside,
    BMediaBody,
    BEmbed,
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
  },

  methods: {
    tagsColor(tag) {
      if (tag === "Cardio") return "light-info";
      if (tag === "Strength") return "light-danger";
      return "light-primary";
    },

    async showExcerciseDetail(excercise_id) {
      try {
        const data = await this.$apollo.mutate({
          mutation: GET_EXCERCISE_DETAIL,
          variables: {
            id: excercise_id,
          },
        });
        this.singleExcerciseDetail = data.data.Fitness_exercise_by_pk;
      } catch (error) {
        console.error();
      }
      this.showExcerciseDetailModal = true;
    },
    saveExcercise() {
      this.isLoading = true;
      if (!this.excercies_and_sets.length) {
        this.isLoading = false;
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Sorry!",
            variant: "danger",
            text: `You must need to add atleast one excercise.`,
          },
        });
        return;
      }
      store
        .dispatch("app-workout/saveExcercise", {
          data: this.excercies_and_sets,
        })
        .then((response) => {
          if (
            response.data.data.insert_Fitness_workout_exercise.affected_rows
          ) {
            this.isLoading = false;

            this.fetchExcercise();
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Excercise Saved",
                icon: "BellIcon",
                variant: "success",
              },
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Sorry!",
              variant: "danger",
              text: `${error}`,
            },
          });
        });
    },

    removeExcercise(index, data) {
      this.isLoading = true;
      console.log(index, data);
      store
        .dispatch("app-workout/deleteExcercise", data.id)
        .then((response) => {
          if (response.data.data.delete_Fitness_workout_exercise_by_pk.id) {
            this.isLoading = false;

            this.fetchExcercise();
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Excercise deleted",
                icon: "BellIcon",
                variant: "success",
              },
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Sorry!",
              variant: "danger",
              text: `${error}`,
            },
          });
        });

      // this.excercies_and_sets.splice(index, 1);
    },

    AddExcercise(ex_data) {
      let exercise = {};
      let json_sets = [];
      exercise.id = ex_data.id;
      exercise.title = ex_data.title;
      let workoutid = this.$route.params.id;

      this.excercies_and_sets.push({
        exercise_id: exercise.id,
        workout_id: workoutid,
        exercise,
        json_sets,
      });
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
          .dispatch("app-workout/searchExcercise", {
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

    modalContent() {
      this.modalShow = true;
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
      singleExcerciseDetail: "",
      showExcerciseDetailModal: false,
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
      isLoadingx: false, //i didn't knew it exisits
      isLoading: false, //saveexcercise

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
    };
  },

  setup() {
    const toast = useToast();

    const TODO_APP_STORE_MODULE_NAME = "app-workout";

    const excercises = ref({});
    const excercies_and_sets = ref([]);

    // Register module
    if (!store.hasModule(TODO_APP_STORE_MODULE_NAME))
      store.registerModule(TODO_APP_STORE_MODULE_NAME, workoutStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TODO_APP_STORE_MODULE_NAME))
        store.unregisterModule(TODO_APP_STORE_MODULE_NAME);
    });

    const { route, router } = useRouter();

    const statusOptions = ["Vegetarian", "NonVegetarian", "Vegan"];

    const fetchExcercise = () => {
      store
        .dispatch("app-workout/getExcercices", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          console.log(
            "GET excercices",
            response.data.data.Fitness_workout_by_pk.workout_exercises
          );
          excercises.value = response.data.data.Fitness_workout_by_pk;
          excercies_and_sets.value =
            response.data.data.Fitness_workout_by_pk.workout_exercises;
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
      excercises,
      fetchExcercise,
      statusOptions,
      excercies_and_sets,
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
@import "@core/scss/vue/pages/page-blog.scss";
</style>
 