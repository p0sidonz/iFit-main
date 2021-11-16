
 
<template>
  <div>
    <b-card-code title="Update your status...">
      <div class="form-label-group">
        <b-form-textarea
          v-model="newPostInput.content"
          id="textarea"
          rows="3"
          placeholder="You Mirin brah?"
        />
        <label for="label-textarea">You Mirin brah?</label>
        <b-button
          v-ripple.400="'rgba(40, 199, 111, 0.15)'"
          variant="flat-success"
          class="btn-icon"
        >
          <feather-icon icon="CameraIcon" />
        </b-button>
        <div class="demo-inline-spacing">
          <b-col md="15">
            <b-button
              @click.prevent="addnewPost(newPostInput.content)"
              v-ripple.40="'rgba(255, 255, 255, 0.15)'"
              block
              variant="primary"
            >
              Post
            </b-button>
          </b-col>
        </div>
      </div>
    </b-card-code>
  </div>
</template>

<script>
import { BFormTextarea, BCardText, BButton, BCol, BRow } from "bootstrap-vue";
import BCardCode from "@core/components/b-card-code";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";

export default {
  components: {
    BFormTextarea,
    BCardText,
    BCardCode,
    BButton,
    BCol,
    BRow,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      newPostInput: {
        content: "",
      },
    };
  },

  methods: {
    async addnewPost(newPostInput) {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($content: String!) {
              insert_Fitness_Posts_one(object: { content: $content }) {
                id
              }
            }
          `,
          variables: {
            content: newPostInput,
          },
        });
      this.$emit("refresh-posts");

      } catch (error) {
        console.log(error);
      }

    },
  },
};
</script>
 