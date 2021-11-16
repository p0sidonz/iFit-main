import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    nonAssignedClients() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          traineelist: {},
        };

        axios
          .post(
            "http://localhost:8080/v1/graphql",
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

    fetchAssignedClients(ctx, context) {
      console.log(context.mealid);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          diet_assigned_clients: { diet_id: { _eq: context.meal_id.value.value } },
        };
        console.log(where);
        axios
          .post(
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");
      const PreMacros = {
        target_calories: macros.val.target_calories,
        target_protein: macros.val.target_protein,
        target_carbs: macros.val.target_carbs,
        target_sodium: macros.val.target_sodium,
        target_fat: macros.val.target_fat,
        target_fiber: macros.val.target_fibre,
        target_sugar: macros.val.target_sugar,
        target_type: macros.val.macro_type,
      };

      console.log("PRE", PreMacros);

      return new Promise((resolve, reject) => {
        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation($id: Int! , $_set: Fitness_Diet_set_input = {}) {
                update_Fitness_Diet_by_pk(pk_columns: {id: $id}, _set: $_set){
                  id
                }
              }
            `,
              variables: {
                PreMacros,
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
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
