import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchInvoices(ctx, queryParams) {
      console.log("hdhhasdh")
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_User_bool_exp = {}, $offset: Int, $limit: Int) {
              Fitness_Diet(where: {owner: {_eq: 18}}) {
                id
                diet_name
                diet_description
                target_calories
                created_at
              }
            }`,
              variables: {
                // offset: queryParams.page
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: freshTocken,
              },
            }
          )
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchInvoice(ctx, { id }) {
      console.log(id)
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery ($id: Int!){
                Fitness_Diet_by_pk(id: $id) {
                  id
                  diet_name
                  diet_description
                  target_calories
                  target_protein
                  target_fat
                  target_fibre
                  target_sodium
                  target_sugar
                  target_carbs
                  is_macro_set
                  macro_type
                  meals {
                    id
                    meal_title
                    meal_decsription
                    FoodLists {
                      id
                      food_name
                      carbohydrate
                      calories
                      protein
                      fat
                      fiber
                      quantity
                      per_serving_cals
                      serving_description

                    }
                  }
                }
              }
              `,
              variables: {
                id: id,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: freshTocken,
              },
            }
          )
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchClients() {
      return new Promise((resolve, reject) => {
        axios
          .get("/apps/invoice/clients")
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    fetchAssignedClients() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {};

        where = {
          traineelist: {},
        };
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_User_bool_exp = {}, $offset: Int, $limit: Int) {
                Fitness_User(where: $where, limit: $limit, offset: $offset) {
                  id
                  firstName
                  username
                  role
                  email
                  fullname
                  traineelist{
                    id
                    status
                  }
                }
                Fitness_User_aggregate(where: $where){
                  aggregate{
                    count
                  }
                }
                Fitness_Diet_by_pk(id: 4) {
                  diet_name
                  diet_assigned_clients {
                    diet_clients {
                      id
                    }
                  }
                }
              }`,
              variables: {
                where,
                // limit: queryParams.perPage,
                // offset: queryParams.page
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: freshTocken,
              },
            }
          )
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    // addUser(ctx, userData) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post('/apps/user/users', { user: userData })
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
  },
};
