<template>
  <div>
    <!-- faq search section -->
    <section id="faq-search-filter">
      <b-card
        no-body
        class="faq-search"
        :style="{
          backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
        }"
      >
        <b-card-body class="text-center">
          <h2 class="text-primary">Search for your favourite excercise</h2>
          <b-card-text class="mb-2">
            or you can add your own exercise and later add it to your workouts.
          </b-card-text>

          <!-- form -->
          <b-form class="faq-search-input">
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                id="searchbar"
                v-model="SearchQuery"
                placeholder="Search exercise..."
              />
            </b-input-group>
          </b-form>
          <!-- form -->
        </b-card-body>
      </b-card>

      <b-card title="Excercises">
        <div class="media-list">
          <b-media
            vertical-align="top"
            v-for="data in excerciseFetchedData"
            :key="data.id"
          >
            <template #aside>
              <b-img
                :src="`https://i1.ytimg.com/vi/${data.video_id}/default.jpg`"
                blank-color="#ccc"
                width="64"
                alt="placeholder"
              />
            </template>
            <h4
              @click="showExcerciseDetail(data.id)"
              class="media-heading cursor-pointer"
            >
              {{ data.title }}
            </h4>
            <b-card-text class="mb-0">
              {{ data.description }}
            </b-card-text>
          </b-media>
        </div>
      </b-card>
    </section>

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

        <b-row>
          <b-col md="3" v-if="singleExcerciseDetail.exercise_category">
            <div class="my-1">
              <span> Category:</span>
            </div>

            <b-link>
              <b-badge
                pill
                class="mr-75"
                :variant="tagsColor(singleExcerciseDetail.exercise_category)"
              >
                {{ singleExcerciseDetail.exercise_category }}
              </b-badge>
            </b-link>
          </b-col>
          <b-col md="3" v-if="singleExcerciseDetail.level">
            <div class="my-1">
              <span> Level:</span>
            </div>

            <b-badge pill class="mr-75" :variant="tagsColor(m)">
              {{ singleExcerciseDetail.level }}
            </b-badge>
          </b-col>
          <b-col md="3" v-if="singleExcerciseDetail.muscle_worked">
            <div class="my-1"><span> Muscle worked:</span></div>
            <b-badge
              v-for="m in singleExcerciseDetail.muscle_worked"
              :key="m"
              pill
              class="mr-75"
              :variant="tagsColor(m)"
            >
              {{ m }}
            </b-badge>
          </b-col>
          <b-col md="3" v-if="singleExcerciseDetail.mechanics_type">
            <div class="my-1">
              <span> Mechanics type: </span>
            </div>

            <b-link>
              <b-badge
                pill
                class="mr-75"
                :variant="tagsColor(singleExcerciseDetail.mechanics_type)"
              >
                {{ singleExcerciseDetail.mechanics_type }}
              </b-badge>
            </b-link>
          </b-col>
        </b-row>
        <div v-if="singleExcerciseDetail.description">
          <div class="my-1">
            <span> Description:</span>
          </div>
          <div
            class="blog-content"
            v-html="singleExcerciseDetail.description"
          />
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="showAddExcerciseModal"
      id="add-excercise"
      title="Add Excercise"
      hide-header
      size="lg"
      @ok="addExcercisetoDB"
    >
      <validation-observer ref="registerForm">
        <b-form @submit.prevent="signup">
          <b-row>
            <b-col md="12">
              <b-form-group
                label="Excercise Title"
                label-for="register-firstname"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Exercise Title"
                  vid="Exercise Title"
                  rules="required"
                >
                  <b-form-input
                    id="exercise-title"
                    v-model="ex.title"
                    name="Exercise Title"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Chest Press"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="12">
              <b-form-group
                label="Excercise Description"
                label-for="exercise-description"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Exercise Description"
                  vid="Exercise Description"
                  rules="required"
                >
                  <b-form-textarea
                    id="exercise-description"
                    v-model="ex.description"
                    name="Exercise description"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Chest Press"
                  />

                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- 
          <b-embed
            v-if="ex.video_url"
            type="iframe"
            :src="singleExcerciseDetail.video_url"
            allowfullscreen
            class="rounded mb-50"
          /> -->

            <b-col md="12">
              <b-form-group label="Youtube Video URL" label-for="ex-video_url">
                <validation-provider
                  #default="{ errors }"
                  name="Video Video URL"
                  vid="Video Video URL"
                  rules="required"
                >
                  <b-form-input
                    @change="updateMyValue(ex.video_url)"
                    id="ex-video_url"
                    v-model="ex.video_url"
                    name="Youtube Video URL"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://www.youtube.com/embed/xyz123dfj"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Video Id" label-for="ex-utube_id">
                <b-form-input
                  id="ex-utube_id"
                  v-model="ex.video_id"
                  value="Enter youtube URL to capture the video id"
                  readonly
                />
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Category" label-for="ex-Category">
                <validation-provider
                  #default="{ errors }"
                  name="Exercise Category"
                  vid="ex-Category"
                  rules="required"
                >
                  <v-select
                    v-model="ex.exercise_category"
                    :state="errors.length > 0 ? false : null"
                    id="ex-Category"
                    name="Category"
                    :options="CATEGORY"
                  >
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Exercise Type" label-for="ex-type">
                <validation-provider
                  #default="{ errors }"
                  name="Exercise Type"
                  vid="ex-type"
                  rules="required"
                >
                  <v-select
                    v-model="ex.type"
                    :state="errors.length > 0 ? false : null"
                    id="ex-type"
                    name="Exercise Type"
                    :options="TYPE"
                    label="title"
                  >
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Other Muscles Worked" label-for="ex-muscle">
                <validation-provider
                  #default="{ errors }"
                  name="Other Muscles Worked"
                  vid="ex-muscle"
                  rules="required"
                >
                  <v-select
                    v-model="ex.muscle_worked"
                    :state="errors.length > 0 ? false : null"
                    id="ex-muscle"
                    name="Other Muscles Worked"
                    :options="MUSCLES"
                    label="title"
                    multiple
                  >
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Mechanics" label-for="ex-Mechanics">
                <validation-provider
                  #default="{ errors }"
                  name="Mechanics"
                  vid="ex-Mechanics"
                >
                  <v-select
                    v-model="ex.mechanics_type"
                    :state="errors.length > 0 ? false : null"
                    id="ex-Mechanics"
                    name="Mechanics"
                    :options="MECHANICS"
                    label="title"
                  >
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Level" label-for="ex-Level">
                <validation-provider
                  #default="{ errors }"
                  name="Level"
                  vid="ex-Level"
                >
                  <v-select
                    v-model="ex.level"
                    :state="errors.length > 0 ? false : null"
                    id="ex-Level"
                    name="Level"
                    :options="LEVEL"
                    label="title"
                  >
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-modal>
    <div class="text-center">
      <b-button
        @click="
          () => {
            this.showAddExcerciseModal = !this.showAddExcerciseModal;
          }
        "
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
      >
        Add your own exercise
      </b-button>
    </div>
  </div>
</template>

<script>
import {
  BCard,
  BCardBody,
  BForm,
  BInputGroup,
  BFormInput,
  BCardText,
  BInputGroupPrepend,
  BTabs,
  BTab,
  BImg,
  BRow,
  BCol,
  BAvatar,
  BMediaAside,
  BEmbed,
  BFormTextarea,
  BMedia,
  BButton,
  BFormGroup,
  BMediaBody,
  BFormInvalidFeedback,
  BLink,
  BBadge,
} from "bootstrap-vue";

import {
  SEARCH_EXCERCISE_LIST,
  GET_EXCERCISE_DETAIL,
  ADD_EXCERCISE_TO_DB,
} from "@/queries/";
import gql from "graphql-tag";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
import { required, email } from "@validations";
import vSelect from "vue-select";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    formValidation,
    BFormTextarea,
    BMedia,
    BForm,
    BMediaBody,
    BCard,
    BMediaAside,
    BBadge,
    BLink,
    BRow,
    BCol,
    BAvatar,
    BCardBody,
    BInputGroup,
    BFormInput,
    BCardText,
    BInputGroupPrepend,
    BTabs,
    BTab,
    BImg,
    BEmbed,
    BButton,
    BFormGroup,
    BFormInvalidFeedback,
    vSelect,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      // validation
      required,
      showExcerciseDetailModal: false,
      singleExcerciseDetail: "",
      SearchQuery: "",
      excerciseFetchedData: {},
      showAddExcerciseModal: false,
      ex: {
        title: "",
        description: "",
        video_url: "",
        video_id: "",
        video_source: "youtube",
        exercise_type: "",
        exercise_category: null,
        muscle_worked: "",
        mechanics_type: "",
        level: "",
      },
      CATEGORY: [
        "Strength",
        "abs",
        "bodyweight",
        "cables",
        "cardio",
        "dumbell",
        "machine",
        "medball",
        "powerlifting",
        "sandbag",
        "yoga",
      ],

      TYPE: [
        "strength",
        "powerlifting",
        "plyometrics",
        "stretching",
        "weightlifting",
        "cardio",
        "resistance",
      ],
      MUSCLES: [
        "obliques",
        "chest",
        "biceps",
        "shoulders",
        "back",
        "lower back",
        "triceps",
        "hamstring",
        "quadriceps",
        "forarms",
        "calves",
        "traps",
        "abdominal",
        "neck",
        "glutes",
        "adductor",
        "abductor",
        " rotator cuff",
        " hip flex",
      ],
      MECHANICS: ["ISOLATION", "COMPOUND", "N/A"],
      LEVEL: ["beginner", "advance", "expert", "intermediate"],
    };
  },
  watch: {
    SearchQuery: {
      immediate: true,
      handler() {
        this.fetchData();
      },
    },
  },
  methods: {
    async addExcercisetoDB() {
      let object = { ...this.ex };
      try {
        const data = await this.$apollo.mutate({
          mutation: ADD_EXCERCISE_TO_DB,
          variables: {
            object: { ...this.ex },
          },
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      //validation se sab hogya h ab seedhe save krna h db mai
    },

    updateMyValue(event) {
      let idk = this.YouTubeGetID(event);
      this.ex.video_id = idk;
    },

    YouTubeGetID(url) {
      var ID = "";
      url = url
        .replace(/(>|<)/gi, "")
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      } else {
        ID = url;
      }
      return ID;
    },

    async fetchData() {
      let where = {
        title: { _ilike: `%${this.SearchQuery}%` },
      };
      try {
        const data = await this.$apollo.mutate({
          mutation: SEARCH_EXCERCISE_LIST,
          variables: {
            where,
          },
        });
        this.excerciseFetchedData = data.data.Fitness_exercise;
      } catch (error) {
        console.log(error);
      }
    },

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
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-faq.scss";
@import "@core/scss/vue/libs/vue-select.scss";
</style>
