
 
<template>
  <div>
    <div class="form-label-group">
      <b-form-textarea
        v-model="newPostInput.content"
        id="textarea"
        rows="2"
        placeholder="May be few words...?"
      />
      <label for="label-textarea">You Mirin brah?</label>
      <b-button
        v-ripple.400="'rgba(40, 199, 111, 0.15)'"
        variant="flat-success"
        class="btn-icon"
      >
      </b-button>

      <b-link>
        <b-img
          v-if="postFile"
          ref="previewEl"
          rounded
          center
          class="d-inline-block mr-1 mb-1"
          :src="postFile"
          fluid
        />
      </b-link>

      <b-media no-body>
        <!--/ avatar -->
        <b-media-body class="mt-75 ml-75">
          <!-- upload button -->
          <b-button
            v-if="!postFile"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            size="sm"
            class="mb-75 mr-75"
            @click="$refs.refInputEl.$el.click()"
          >
            Upload
          </b-button>
          <b-button
            v-if="postFile"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            size="sm"
            class="mb-75 mr-75"
            @click="addnewPost"
          >
            Add post
          </b-button>

          <b-form-file
            ref="refInputEl"
            v-model="postFile"
            accept=".jpg, .png, .gif"
            :hidden="true"
            plain
            @input="inputImageRenderer"
          />
          <!--/ upload button -->

          <!-- reset -->
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            size="sm"
            class="mb-75 mr-75"
            @click="
              () => {
                this.postFile = null;
              }
            "
          >
            Reset
          </b-button>
          <!--/ reset -->
          <b-card-text>Allowed JPG, GIF or PNG.</b-card-text>
        </b-media-body>
      </b-media>
    </div>
  </div>
</template>

<script>
import {
  BFormTextarea,
  BCardText,
  BButton,
  BCol,
  BRow,
  BMedia,
  BMediaAside,
  BMediaBody,
  BLink,
  BImg,
} from "bootstrap-vue";
import BCardCode from "@core/components/b-card-code";
import Ripple from "vue-ripple-directive";
import gql from "graphql-tag";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
import { BFormFile } from "bootstrap-vue";

export default {
  components: {
    BFormTextarea,
    BCardText,
    BCardCode,
    BButton,
    BCol,
    BRow,
    BMedia,
    BMediaAside,
    BMediaBody,
    BFormFile,
    BLink,
    BImg,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      postFile: null,
      base64: null,
      newPostInput: {
        content: "",
      },
    };
  },

  methods: {
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
          const result = reader.result;
          return resolve(result);
        };

        reader.onerror = function (error) {
          return reject(error);
        };

        reader.readAsDataURL(file);
      });
    },

    async addnewPost() {
      console.log(this.postFile)
      const fileBase64 = await this.getBase64(this.postFile);
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation ($content: String!, $base64str: String!, $name: String!) {
              createPost(content: $content, base64str: $base64str, name: $name) {
                id
              }
            }
          `,
          variables: {
            content: this.newPostInput.content,
            base64str: fileBase64,
            name: this.postFile.name
          },
        });
        this.$emit("refresh-posts");
      } catch (error) {
        console.log(error);
      }
    },
  },

  setup() {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(
      refInputEl,
      (base64) => {
        previewEl.value.src = base64;
      }
    );

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
};
</script>
 