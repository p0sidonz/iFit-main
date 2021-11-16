<template>
  <div>
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="tasks === undefined">
      <h4 class="alert-heading">Error fetching Diet</h4>
      <div class="alert-body">
        Pleae hit back
        <b-link class="alert-link" :to="{ name: 'apps-users-list' }">
          User List
        </b-link>
        for other users.
      </div>
    </b-alert>

    <template v-if="tasks">
      <!-- First Row -->
      <b-row cols="12">
        <b-col cols="12">
          <section id="diet">
            <b-card
              no-body
              class="diet"
              :style="{
                backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
              }"
            >
              <b-card-header>
                <b-card-title></b-card-title>

                <b-dropdown variant="link" no-caret right toggle-class="p-0">
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                  </template>

                  <b-dropdown-item href="#" @click="addTask(tasks.id)">
                    <feather-icon
                      icon="PlusIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                    Add New Meal
                  </b-dropdown-item>

                  <b-dropdown-item href="#">
                    <feather-icon
                      icon="EditIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                    Edit Meal
                  </b-dropdown-item>
                  <b-dropdown-item href="#">
                    <feather-icon
                      icon="XIcon"
                      size="18"
                      class="text-body cursor-pointer"
                    />
                    Delete Meal
                  </b-dropdown-item>
                </b-dropdown>
              </b-card-header>

              <b-card-body class="text-center">
                <h2 class="text-primary">
                  {{ tasks.diet_name }}
                </h2>
                <b-card-text class="mb-2">
                  {{ tasks.diet_description }}
                </b-card-text>
              </b-card-body>
            </b-card>

            <macros v-if="tasks" :macronutrients="tasks" @update-macronutrient="updateMicronutrient">
            </macros>

            <b-card-actions
              v-for="data in tasks.meals"
              :key="data.index"
              action-collapse
              action-close
              class="text-primary"
              @close="removeMeal(data.id)"
              :title="data.meal_title.toUpperCase()"
            >
            
              <!-- <b-card-title class="mt-1 mb-75">
                {{ data.meal_title.toUpperCase() }}

      </b-card-title> -->

              <b-row>
                <!-- User Info: Left col -->
                <b-col
                  cols="21"
                  xl="12"
                  class="d-flex justify-content-between flex-column"
                >

                  <!-- User Avatar & Action Buttons -->
                  <b-table
                    responsive
                    :items="data.FoodLists"
                    :fields="fields"
                    v-model="visibleRows"
                    class="mb-0"
                  >

                  
                    <!-- Optional default data cell scoped slot -->
                    <template #cell(action)="data">
                      <b-dropdown
                        variant="link"
                        toggle-class="text-decoration-none"
                        no-caret
                      >
                        <template v-slot:button-content>
                          <feather-icon
                            icon="MoreVerticalIcon"
                            size="16"
                            class="text-body align-middle mr-25"
                          />
                        </template>
                        <b-dropdown-item @click="handleTaskClick(data.item)">
                          <feather-icon icon="Edit2Icon" class="mr-50" />
                          <span>Edit</span>
                        </b-dropdown-item>
                        <b-dropdown-item
                          @click="removeSingleFood(data.item.id)"
                        >
                          <feather-icon icon="TrashIcon" class="mr-50" />
                          <span>Delete</span>
                        </b-dropdown-item>
                      </b-dropdown>
                    </template>
                  </b-table>
                  <b-card-footer> </b-card-footer>
                  <b-button
                    variant="outline-primary"
                    @click="addFood(data.id)"
                    :task="data"
                  >
                    Add Food
                  </b-button>

                  <!-- User Stats -->
                </b-col>
              </b-row>
            </b-card-actions>
          </section>
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


         <b-card >

          <!-- Bar Chart - Orders -->
        <div class="d-flex justify-content-center flex-wrap">
          <div class="text-center colors-container bg-gradient-primary rounded text-white width-150 height-50 d-flex align-items-center justify-content-center mr-1 ml-50 my-1 shadow">
            <span>Total Calories {{xTotal.calories || 0}}</span>
          </div>
          <div class="text-center colors-container bg-gradient-secondary rounded text-white width-150 height-50 d-flex align-items-center justify-content-center mr-1 ml-50 my-1 shadow">
            <span>Total Protein {{xTotal.protein || 0}}</span>
          </div>
          <div class="text-center colors-container bg-gradient-success rounded text-white width-150 height-50 d-flex align-items-center justify-content-center mr-1 ml-50 my-1 shadow">
            <span>Total Carbs {{xTotal.carbs || 0}}</span>
          </div>
          <div class="text-center colors-container bg-gradient-warning rounded text-white width-150 height-50 d-flex align-items-center justify-content-center mr-1 ml-50 my-1 shadow">
            <span>Total Fat {{xTotal.fat ||0}}</span>
          </div>
          <div class="text-center colors-container bg-gradient-danger rounded text-white width-150 height-50 d-flex align-items-center justify-content-center mr-1 ml-50 my-1 shadow">
            <span>Total Fibers {{xTotal.fiber || 0}}</span>
          </div>
        </div>


                  </b-card>

      <!-- append and pepend -->

    <!-- Task Handler -->

    <todo-task-handler-sidebar
      v-model="isTaskHandlerSidebarActive"
      :task="task"
      :clear-task-data="clearTaskData"
      @remove-task="removeTask"
      @add-task="addTask"
      @add-foods="addFoods"
      @update-task="updateTask"
    />
  </div>
</template>

<script>
import store from "@/store";
import { ref, watch, computed, onUnmounted } from "@vue/composition-api";
import {
  BFormInput,
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
} from "bootstrap-vue";

import macros from "./macros.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { formatDate, avatarText } from "@core/utils/filter";
import { useRouter } from "@core/utils/utils";
import { useResponsiveAppLeftSidebarVisibility } from "@core/comp-functions/ui/app";
import TodoLeftSidebar from "./TodoLeftSidebar.vue";
import todoStoreModule from "./todoStoreModule";
import TodoTaskHandlerSidebar from "./TodoTaskHandlerSidebar.vue";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";

export default {
  components: {
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BBadge,
    BAvatar,
    VuePerfectScrollbar,
    BRow,
    BCol,
    BAlert,
    BLink,
    BCardHeader,
    BDropdown,
    BCard,
    BDropdownItem,
    BImg,
    BButton,
    BAvatar,
    BRow,
    BCol,
    BTable,
    BCardText,
    BCardBody,
    BCardTitle,
    BBadge,
    BCardFooter,
    BCardActions,
    // App SFC
    TodoLeftSidebar,
    TodoTaskHandlerSidebar,
    macros,
    
  },

  data() {
    return {
      fields: [
        "food_name",
        "carbohydrate",
        "protein",
        "fat",
        "fiber",
        "calories",
        "action",
      ],
      visibleRows: [],
    };
  },

  methods: {
    addFood(val) {
      this.task.id = val;

      this.isTaskHandlerSidebarActive = true;
    },
  },

  computed: {

      xTotal: function () {
        let MealsTotal = {}
          this.tasks.meals.forEach((el) => {
          el.FoodLists.forEach((a) => {
          MealsTotal['calories'] = (MealsTotal['calories'] || 0) + a.calories;
          MealsTotal["protein"] = (MealsTotal["protein"] || 0) + a.protein;
          MealsTotal["fat"] = (MealsTotal["fat"] || 0) + a.fat;
          MealsTotal["carbs"] = (MealsTotal["carbs"] || 0) + a.carbohydrate;
          MealsTotal["fiber"] = (MealsTotal["fiber"] || 0) + a.fiber;
        });
      }
     
      );
       return MealsTotal
    }


  },

  setup() {
    const TODO_APP_STORE_MODULE_NAME = "app-todo";

    // Register module
    if (!store.hasModule(TODO_APP_STORE_MODULE_NAME))
      store.registerModule(TODO_APP_STORE_MODULE_NAME, todoStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TODO_APP_STORE_MODULE_NAME))
        store.unregisterModule(TODO_APP_STORE_MODULE_NAME);
    });

    const { route, router } = useRouter();
    const routeSortBy = computed(() => route.value.query.sort);
    const routeQuery = computed(() => route.value.query.q);
    const routeParams = computed(() => route.value.params);
    watch(routeParams, () => {
      // eslint-disable-next-line no-use-before-define
      fetchTasks();
    });

    const tasks = ref([]);
    const totalCounter = ref({});
    const sortOptions = [
      "latest",
      "title-asc",
      "title-desc",
      "assignee",
      "due-date",
    ];
    const sortBy = ref(routeSortBy.value);
    watch(routeSortBy, (val) => {
      if (sortOptions.includes(val)) sortBy.value = val;
      else sortBy.value = val;
    });
    const resetSortAndNavigate = () => {
      const currentRouteQuery = JSON.parse(JSON.stringify(route.value.query));

      delete currentRouteQuery.sort;

      router
        .replace({ name: route.name, query: currentRouteQuery })
        .catch(() => {});
    };

    const blankTask = {
      id: null,
      title: "",
      dueDate: new Date(),
      description: "",
      assignee: null,
      tags: [],
      isCompleted: false,
      isDeleted: false,
      isImportant: false,
    };
    const task = ref(JSON.parse(JSON.stringify(blankTask)));
    const clearTaskData = () => {
      task.value = JSON.parse(JSON.stringify(blankTask));
    };

    const addTask = (val) => {
      store.dispatch("app-todo/addTask", val).then(() => {
        console.log("ADD TASK");
        // eslint-disable-next-line no-use-before-define
        fetchTasks();
      });
    };

    const addFoods = (taskData, foodid, foodname) => {
      console.log(
        "add food dispatcher",
        taskData,
        "food_id",
        foodid,
        "food_name",
        foodname
      );
      store
        .dispatch("app-todo/addFoods", { taskData, foodid, foodname })
        .then(() => {
          // eslint-disable-next-line no-use-before-define
          fetchTasks();
        });
    };

    const removeTask = () => {
      store.dispatch("app-todo/removeTask", { id: task.value.id }).then(() => {
        // eslint-disable-next-line no-use-before-define
        fetchTasks();
      });
    };
    const removeMeal = (val) => {
      store.dispatch("app-todo/removeMeal", { val }).then(() => {
        // eslint-disable-next-line no-use-before-define
        fetchTasks();
      });
    };

    const removeSingleFood = (val) => {
      store.dispatch("app-todo/removeSingleFood", { val }).then(() => {
        // eslint-disable-next-line no-use-before-define
        fetchTasks();
      });
    };

    const updateTask = (taskData) => {
      store.dispatch("app-todo/updateTask", { task: taskData }).then(() => {
        // eslint-disable-next-line no-use-before-define
        fetchTasks();
      });
    };

    const updateMicronutrient = (val) => {
      store.dispatch("app-todo/updateMicronutrient", { val }).then(() => {

       // fetchTasks();
      });
    }

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    };

    const isTaskHandlerSidebarActive = ref(false);
    const mealid = ref();

    const taskTags = [
      {
        title: "Team",
        color: "primary",
        route: { name: "apps-todo-tag", params: { tag: "team" } },
      },
      {
        title: "Low",
        color: "success",
        route: { name: "apps-todo-tag", params: { tag: "low" } },
      },
      {
        title: "Medium",
        color: "warning",
        route: { name: "apps-todo-tag", params: { tag: "medium" } },
      },
      {
        title: "High",
        color: "danger",
        route: { name: "apps-todo-tag", params: { tag: "high" } },
      },
      {
        title: "Update",
        color: "info",
        route: { name: "apps-todo-tag", params: { tag: "update" } },
      },
    ];

    const resolveTagVariant = (tag) => {
      if (tag === "team") return "primary";
      if (tag === "low") return "success";
      if (tag === "medium") return "warning";
      if (tag === "high") return "danger";
      if (tag === "update") return "info";
      return "primary";
    };

    const resolveAvatarVariant = (tags) => {
      if (tags.includes("high")) return "primary";
      if (tags.includes("medium")) return "warning";
      if (tags.includes("low")) return "success";
      if (tags.includes("update")) return "danger";
      if (tags.includes("team")) return "info";
      return "primary";
    };

    // Search Query
    const searchQuery = ref(routeQuery.value);
    watch(routeQuery, (val) => {
      searchQuery.value = val;
    });
    // eslint-disable-next-line no-use-before-define
    watch([searchQuery, sortBy], () => fetchTasks());
    const updateRouteQuery = (val) => {
      const currentRouteQuery = JSON.parse(JSON.stringify(route.value.query));

      if (val) currentRouteQuery.q = val;
      else delete currentRouteQuery.q;

      router.replace({ name: route.name, query: currentRouteQuery });
    };

    const fetchTasks = () => {
      store
        .dispatch("app-todo/fetchTasks", { id: router.currentRoute.params.id })
        .then((response) => {
          tasks.value = response.data.data.Fitness_Diet_by_pk;
        });
    };


    fetchTasks();
 
    const handleTaskClick = (taskData) => {
      task.value = taskData;
      isTaskHandlerSidebarActive.value = true;
    };

    // Single Task isCompleted update
    const updateTaskIsCompleted = (taskData) => {
      // eslint-disable-next-line no-param-reassign
      taskData.isCompleted = !taskData.isCompleted;
      updateTask(taskData);
    };

    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility();



    // tt();

    return {
      task,
      tasks,
      removeTask,
      addTask,
      updateTask,
      clearTaskData,
      taskTags,
      searchQuery,
      fetchTasks,
      perfectScrollbarSettings,
      updateRouteQuery,
      resetSortAndNavigate,
      removeMeal,
      removeSingleFood,
      addFoods,
      // UI
      resolveTagVariant,
      resolveAvatarVariant,
      isTaskHandlerSidebarActive,

      // Click Handler
      handleTaskClick,

      // Filters
      formatDate,
      avatarText,

      // Single Task isCompleted update
      updateTaskIsCompleted,

      // Left Sidebar Responsive
      mqShallShowLeftSidebar,

      //FOOD
      mealid,
      totalCounter,
      updateMicronutrient
    };
  },
};
</script>

<style lang="scss" scoped>


.draggable-task-handle {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  cursor: move;

  .todo-task-list .todo-item:hover & {
    visibility: visible;
  }
}
</style>

<style lang="scss">
@import "~@core/scss/base/pages/app-todo.scss";
</style>
