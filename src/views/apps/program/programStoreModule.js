import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {

    deleteWeek(ctx, context)  {
      console.log("deleteWeek ", context)
      // let id = parseInt(context)
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation ($id: Int!){
                delete_Fitness_program_weeks_by_pk(id: $id) {
                  id
                }
              }
              
               `,
              variables: {
                id : context
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

    saveProgram(ctx, context) {
      console.log("saveprogram ", context.data)
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation($objects: [Fitness_program_weeks_insert_input!] = {}) {
                insert_Fitness_program_weeks(objects: $objects, on_conflict: {constraint: workout_weeks_pkey, update_columns: updated_at}) {
                  affected_rows
                }
              }
              
               `,
              variables: {
                objects : context.data
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
            "http://localhost:8080/v1/graphql",
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

    searchWorkout(ctx, value) {
      console.log("workout search query", value.value);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          title: { _ilike: `%${value.value}%` },
        };

        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `query MyQuery($where: Fitness_workout_bool_exp = {}) {
                Fitness_workout(where: $where) {
                  id
                  title
                  description
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

    createWorkout(ctx, workoutdata) {
      console.log("workout store dta", workoutdata.workoutdata.title);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            "http://localhost:8080/v1/graphql",
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

    fetchProgram() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {};

        where = {
          traineelist: {},
        };
        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `query MyQuery {
                Fitness_program(where: {owner: {_eq: 18}}) {
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

    getWorkout(ctx, id) {
      console.log(id.id);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `query MyQuery ($id: Int!){
                Fitness_program_by_pk(id: $id) {
                  id
                  title
                  description
                  is_active
                  updated_at
                  workout_weeks(distinct_on: id) {
                    id
                    program_id
                    program_days(distinct_on: id) {
                      id
                      rest_day
                      completed
                      workout_id
                      workout {
                        id
                        title
                      }
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
