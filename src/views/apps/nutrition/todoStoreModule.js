import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    UnAssignClient(ctx, payload) {
      console.log("Unassign diet pyload", payload);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($client_id: Int!, $diet_id: Int!){
                delete_Fitness_diet_assigned_clients(where: {_and: {client_id: {_eq: $client_id}, diet_id: {_eq: $diet_id}}}){
                  affected_rows
                }
              }
              
              
              `,
              variables: {
                diet_id: payload.meal_id,
                client_id: payload.userId,
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

    assignClient(ctx, payload) {
      console.log("assign diet pyload", payload);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation($diet_id : Int!, $user_id: Int!, $relationship_id: Int!) {
                insert_Fitness_diet_assigned_clients_one(object: {diet_id: $diet_id, client_id:$user_id, relationship_id: $relationship_id}){
                  id
                }
              }
              
              
              `,
              variables: {
                diet_id: payload.meal_id,
                user_id: payload.userId,
                relationship_id: payload.relationship_id,
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

    nonAssignedClients() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          traineelist: {},
        };

        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_User_bool_exp = {}, $offset: Int, $limit: Int) {
                Fitness_User(where: $where, limit: $limit, offset: $offset) {
                  fullname
                  id
                  avatar
                  UserRelations{
      id
    }
                }
              }
              
              `,
              variables: {
                where,
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

    fetchAssignedClients(ctx, context) {
      console.log(context.mealid);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          diet_assigned_clients: {
            diet_id: { _eq: context.meal_id.value.value },
          },
        };
        console.log(where);
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_User_bool_exp = {}, $offset: Int, $limit: Int) {
                Fitness_User(where: $where, limit: $limit, offset: $offset) {
                  fullname
                  id
                  avatar
              
                }
              }
              
              `,
              variables: {
                where,
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

    deleteDiet(ctx, id) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($id: Int!){
                delete_Fitness_Diet_by_pk(id: $id) {
                  id
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

    createMeal(ctx, createMealData) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($diet_name: String!, $diet_description: String!){
                insert_Fitness_Diet_one(object: {diet_name: $diet_name, diet_description: $diet_description}) {
                  id
                }
              }
              `,
              variables: {
                diet_name: createMealData.mealdata.title,
                diet_description: createMealData.mealdata.description,
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

    fetchInvoices(ctx, context) {
      console.log("fetchInvoices", context);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {};

        where = {
          owner: { _eq: 11 },
        };
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_User_bool_exp = {}, $offset: Int, $limit: Int) {
              Fitness_Diet{
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

    fetchTasks(ctx, dietid) {
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

    updateMicronutrient(ctx, macros) {
      let MAC = macros.val.macros;
      delete MAC.meals;
      delete MAC.diet_description;
      delete MAC.diet_name;
      delete MAC.id;
      MAC.is_macro_set = true;

      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation($id: Int! , $_set: Fitness_Diet_set_input = {}) {
                update_Fitness_Diet_by_pk(pk_columns: {id: $id}, _set: $_set){
                  id
                }
              }
            `,
              variables: {
                id: macros.val.id,
                _set: { ...MAC },
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
          .catch((error) => reject(console.log(error)));
      });
    },
    addTask(ctx, taskData) {
      if (taskData.id & taskData.foodid) {
        return console.log("bhai gand mt mara yar");
      }
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($diet_id: Int! ){
                insert_Fitness_meal(objects: { diet_id: $diet_id}) {
                  affected_rows
            }
          }
            `,
              variables: {
                diet_id: taskData,
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

    addFoods(ctx, taskData) {
      console.log("ADD HORHA H FOODS", taskData);
      if (!taskData) {
        console.log("bsdk hacker");
      }
      let objects = {
        ...taskData.taskData,
        meal_id: taskData.foodid,
        food_name: taskData.foodname,
        per_serving_cals: taskData.taskData.calories,
      };
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation($objects: [Fitness_FoodList_insert_input!] = {}) {
                insert_Fitness_FoodList(objects: $objects) {
                  affected_rows
                }
              }
            `,
              variables: {
                objects,
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
          .catch((error) => reject(console.log(error)));
      });
    },

    removeSingleFood(ctx, id) {
      console.log("SINGELE FOOD DELETE", id.val);
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($id: Int!){
                delete_Fitness_FoodList_by_pk(id: $id) {
                id
            }
          }
            `,
              variables: {
                id: id.val,
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

    removeMeal(ctx, id) {
      console.log("delete", id.val);
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($id: Int!){
                delete_Fitness_meal_by_pk( id: $id) {
                id
            }
          }
            `,
              variables: {
                id: id.val,
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
      console.log("update", task);
      if (!task.id) {
        return console.log("update ni hoga ab cuz value null h");
      }
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($id: Int!, $quantity: Int! $carbohydrate: numeric!, $fat: numeric!, $calories: numeric!, $protein: numeric! ){
              update_Fitness_FoodList_by_pk( pk_columns: {id: $id}, _set: {quantity: $quantity, carbohydrate: $carbohydrate, fat: $fat, calories: $calories, protein: $protein}) {
                id
            }
          }
            `,
              variables: {
                id: task.id,
                fat: task.fat,
                carbohydrate: task.carbohydrate,
                calories: task.calories,
                protein: task.protein,
                quantity: task.quantity,
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
          .catch((error) => reject(console.log(error)));
      });
    },

    removeTask(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/apps/todo/tasks/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
};
