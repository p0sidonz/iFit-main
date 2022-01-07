import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {


    deleteExcercise(ctx, id) {
      console.log("delete excercise")
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `mutation MyMutation ($id: Int!){
                delete_Fitness_workout_exercise_by_pk(id: $id) {
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

    deleteWorkout(ctx, id) {
      console.log("delete workout")
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `mutation MyMutation ($id: Int!){
                delete_Fitness_workout_by_pk(id: $id) {
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

    saveExcercise(ctx, context) {
      console.log("context",context)
      // console.log("context", context)
      let test = context.data.filter((item, items) => {
        if(item.exercise) {
          return delete item.exercise

        }
        })

         console.log("test",test)
        
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `mutation MyMutation($objects: [Fitness_workout_exercise_insert_input!] = {}) {
                insert_Fitness_workout_exercise(objects: $objects, on_conflict: {constraint: workout_exercise_pkey, update_columns: json_sets}) {
                  affected_rows
                }
              }
               `,
              variables: {
                objects: test,
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

    addExcercise(ctx, context) {
      console.log("add excersise store ", context);
      const workoutidx = parseInt(context.workoutID);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `mutation MyMutation($exercise_id: Int!, $workout_id: Int!) {
                insert_Fitness_workout_exercise_one(object: {workout_id: $workout_id, exercise_id: $exercise_id}) {
                  id
                }
              }
              
              
              `,
              variables: {
                workout_id: workoutidx,
                exercise_id: context.excerciseId,
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

    searchExcercise(ctx, value) {
      console.log("excercise search query", value.value);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          title: {_ilike: `%${value.value}%` }
        }
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `query MyQuery($where: Fitness_exercise_bool_exp = {}) {
                Fitness_exercise(where: $where){
                  id
                  title
                }
              }
              
              
              `,
              variables: {
                where
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

    createWorkout(ctx, workoutdata) {
      console.log("workout store dta", workoutdata.workoutdata.title);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `mutation MyMutation ($title: String!, $description: String!){
                insert_Fitness_workout_one(object: {title: $title, description: $description}) {
                  id
                }
              }
              `,
              variables: {
                title: workoutdata.workoutdata.title,
                description: workoutdata.workoutdata.description,
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

    fetchWorkouts() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {};

        where = {
          traineelist: {},
        };
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `query MyQuery {
                Fitness_workout {
                  id
                  title
                  description
                  created_at
                }
              }
              `,
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

    getExcercices(ctx, id) {
      console.log(id.id);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
            {
              query: `query MyQuery ($id: Int!){
                Fitness_workout_by_pk(id: $id) {
                  id
                  title
                  description
                  is_active
                  workout_exercises{
                    id
                    workout_id
                    exercise_id
                    json_sets
                  exercise{
                    id
                    title
                  }
                  }
                  
                }
              }
              
              `,
              variables: {
                id: id.id,
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
