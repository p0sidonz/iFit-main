import axios from "@axios";
import { GET_TRAINEE } from "@/queries/";
import gql from "graphql-tag";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchDiet(ctx, dietid) {
      console.log("ONCE AGAIN")
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      console.log(dietid.id);
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
                  meals {
                    id
                    meal_title
                    meal_decsription
                    FoodLists {
                      id
                      food_name
                      carbs
                      fat
                      protein
                      kals
                      quantity
                      serving_size
                    }
                  }
                }
              }
              `,
              variables: {
                id: dietid.id,
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

    updateTask(ctx, { task }) {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      console.log(task);
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($id: Int!, $serving_size: Int!, $carbs: Int!, $fat: Int!, $kals: Int!, $protein: Int! ){
              update_Fitness_FoodList_by_pk( pk_columns: {id: $id}, _set: {serving_size: $serving_size, carbs: $carbs, fat: $fat, kals: $kals, protein: $protein}) {
                id
            }
          }
            `,
              variables: {
                id: task.id,
                fat: task.fat,
                carbs: task.fat,
                serving_size: task.serving_size,
                kals: task.kals,
                protein: task.protein,
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
  },
};
