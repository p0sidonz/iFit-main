/* eslint-disable */
<template>
  <b-card title="Create Awesome 🙌">
    <b-card-text v-for="user in users" :key="user.email">{{user.email}} , {{user.id}}</b-card-text>
    <b-card-text>Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin. Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.</b-card-text>
  </b-card>
</template>

<script>

import { BCard, BCardText } from 'bootstrap-vue'
import gql from 'graphql-tag'

export default {
  components: {
    BCard,
    BCardText,
  },
  data() {
    return {
      users: null,
    }
  },
  apollo: {
    seeProfile: gql`query {
    seeProfile ($username: String!) {
      username
      email
    }
    }`,
          variables: {
        username: "ethicalankit",
      },
  },
}
</script>

<style>

</style>
