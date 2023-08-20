import Vue from "vue";
import { ToastPlugin, ModalPlugin } from "bootstrap-vue";
import VueCompositionAPI from "@vue/composition-api";
import VueSweetalert2 from "vue-sweetalert2";
import LoadScript from "vue-plugin-load-script";
import VueProgressBar from "vue-progressbar";
import VueClipboard from "vue-clipboard2";

import router from "./router";
import store from "./store";
import App from "./App.vue";

// Global Components
import "./global-components";

// 3rd party plugins
import "@/libs/portal-vue";
import "@/libs/toastification";
import { createProvider } from "./vue-apollo";

VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(VueSweetalert2);
Vue.use(require("vue-moment"));
Vue.use(LoadScript);

Vue.use(VueProgressBar, {
  color: "rgb(115, 103, 240)",
  failedColor: "red",
  height: "100px",
});

// Composition API
Vue.use(VueCompositionAPI);

import { provide } from "@vue/composition-api";
import { DefaultApolloClient } from "@vue/apollo-composable";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const getAuth = JSON.parse(localStorage.getItem("apollo-token"));

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_HTTP,
});
const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_HTTP_WS,
  options: {
    reconnect: true,

    connectionParams: {
      headers: {
        Authorization: getAuth,
      },
    },
  },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// import core styles
require("@core/scss/core.scss");

// import assets styles
require("@/assets/scss/style.scss");

Vue.config.productionTip = false;

new Vue({
  setup() {
    provide(DefaultApolloClient, client);
  },
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
