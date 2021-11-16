<template>
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
          <b-dropdown-item href="#">
            <feather-icon
              icon="EditIcon"
              size="18"
              class="text-body cursor-pointer"
            />
            Edit
          </b-dropdown-item>
          <b-dropdown-item href="#">
            <feather-icon
              icon="XIcon"
              size="18"
              class="text-body cursor-pointer"
            />
            Delete
          </b-dropdown-item>
        </b-dropdown>
      </b-card-header>

      <b-card-body class="text-center">
        <h2 class="text-primary">
          {{ dietData.diet_name }}
        </h2>
        <b-card-text class="mb-2">
          {{ dietData.diet_description }}
        </b-card-text>
      </b-card-body>
    </b-card>

    <b-card-actions
      v-for="data in dietData.meals"
      :key="data.index"
      action-collapse
      action-close
      class="text-primary"
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
                <b-dropdown-item>
                  <feather-icon icon="TrashIcon" class="mr-50" />
                  <span>Delete</span>
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </b-table>
          <b-card-footer>
            <b-button
              variant="primary"
              @click="isTaskHandlerSidebarActive = true"
              :task="task"
            >
              Add Food
            </b-button>
          </b-card-footer>

          <!-- User Stats -->
        </b-col>
      </b-row>
    </b-card-actions>

    <todo-task-handler-sidebar
      v-model="isTaskHandlerSidebarActive"
      :task="task"
      :clear-task-data="clearTaskData"
      @remove-task="removeTask"
      @add-task="addTask"
      @update-task="updateTask"
    />
  </section>
</template>

<script>
import store from "@/store";
import router from "@/router";

import {
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
} from "bootstrap-vue";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
import TodoTaskHandlerSidebar from "./TodoTaskHandlerSidebar.vue";
import { ref, onUnmounted } from "@vue/composition-api";

export default {
  components: {
    TodoTaskHandlerSidebar,

    BCardFooter,
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    BTable,
    BCardText,
    BCardBody,
    BCardTitle,
    BCardHeader,
    BCardTitle,
    BDropdown,
    BDropdownItem,
    BImg,
    BBadge,
    BCardActions,
  },

  props: {
    dietData: {
      type: Object,
      required: true,
    },
    dietMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        "food_name",
        "quantity",
        "protein",
        "carbs",
        "fat",
        "kals",
        "action",
      ],
    };
  },

  methods: {
    // handleTaskClick2(data) {
    //   console.log(data)
    // }
  },

  setup() {
    let blankTask = {
      id: null,
      food_name: "",
    };
    let task = ref(JSON.parse(JSON.stringify(blankTask)));

    const isTaskHandlerSidebarActive = ref(false);

    //Grab the table food to the sidebar for update
    const handleTaskClick = (data) => {
      task.value = data;
      isTaskHandlerSidebarActive.value = true;
    };

    const addTask = (val) => {
      store.dispatch("app-todo/addTask", val).then(() => {
        // eslint-disable-next-line no-use-before-define
        fetchTasks();
      });
    };
    const fetchTasks = (id) => {
      store.dispatch("diet-user/fetchDiet");

    };

    const updateTask = (taskData) => {
      store
        .dispatch("diet-user/updateTask", { task: taskData })
        .then((response) => {

          // eslint-disable-next-line no-use-before-define
        });
    };

    //clearthedietdata
    const clearTaskData = () => {
      task.value = JSON.parse(JSON.stringify(blankTask));
    };

    const removeTask = () => {
      store.dispatch("app-todo/removeTask", { id: task.value.id }).then(() => {
        // eslint-disable-next-line no-use-before-define
      });
    };
    return {
      isTaskHandlerSidebarActive,

      //click handler
      handleTaskClick,
      task,
      clearTaskData,
      removeTask,
      addTask,
      updateTask,
      fetchTasks
    };
  },
};
</script>

<style>
</style>
