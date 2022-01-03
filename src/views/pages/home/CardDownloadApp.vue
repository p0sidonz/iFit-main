<template>
  <div>
    <b-card>
      <h5 class="text-center">Soon launching apps...</h5>

      <div class="row">
        <div class="col">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            size="lg"
            variant="success"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABKElEQVQ4jdXUO0oDURTG8Z9iEx9N1DXYxCpGQbDQJroKl6HuRBtBg40vUkXcg1YSTekC1M5EBNFiTiQmM3lAGj+4zOHc8/3vnXvmDtk6QSElX8BxlmmiD3A5oPdYilwDK9jFQx9vj+ZQxRnWMRNjI3JVzKYZJzOA56jhGV94j/EZuRtcDLu7HVxHvIZ8x1weqxFXUe42T6UAyyjibsDCi9jGbVbBgeTQ3wI4SMWobWA/raAu6frVCMDL8NTbyc6mtPCNlyFgbb2Gp5UGHIv+FzAnOeCFEfzz4cmlASt4xOYIwK3wnPYrOkRpCFgpav8o7abUJH+Z5gDgNPaGWPhX7at3JPmIixF3zvVo7F1Oe+W2OrvejLinq93qt8OK5OI34/mEj4gzu/oDfNo3Y9WumjYAAAAASUVORK5CYII="
            />
            Android
          </b-button>
        </div>
        <div class="col">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            size="lg"
            variant="secondary"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABZklEQVQ4ja3UPWsUURgF4MeNikF3XRCxcN3GRu3EwvwCWatVCz/+QRJSChH0B4gKNtYSYiHR0kYMQbHwA6czEfsQ0qVIdlMEjBb3Ls4OM7vjrqeae955D+fe94P/jAOZcxNzuIyjQ3K7+IJnWM/74Sq+oY1qCTNVXIs5rWywGQP1EkJZ1JGgkSYfRWej4gYepokPyl2zCDW8h0okjmFnDMHtnqFKTvCxvxW+gPuYxmTkTuEe7sp58zzBJeziLBbxVWiv1zG+gFVs4kmR5ST1/Q6HMY87Gf4k3ggFuKS/j5Mihz0cQSd17grXvoXveBDd9mGQ4DJmhIJdxGlhIp7iLWZxLpt0MEfoI/bxCS/wElu4jd94hefYE8Y0F0lR4B/Q94Yd4zX2cbGPJyJxHofwc0TBNn5hpUecESyPshxOYE0oWh9aUfS6MJvDUMNN/MCVHpldsA2hclNCuwxCB5+FBbtRwsBo+AOrZj3rBKOwmgAAAABJRU5ErkJggg=="
            />
            Apple
          </b-button>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { BCard, BAvatar, BButton, BCol, BRow } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  components: {
    BCard,
    BAvatar,
    BButton,
    BCol,
    BRow,
  },
  directives: {
    Ripple,
  },
};
</script>