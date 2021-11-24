import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {

    UnAssignClient(ctx, payload) {
      console.log("Unassign program pyload", payload);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation ($client_id: Int!, $program_id: Int!){
                delete_Fitness_program_assigned_clients(where: {_and: {client_id: {_eq: $client_id}, program_id: {_eq: $program_id}}}){
                  affected_rows
                }
              }
              
              
              `,
              variables: {
                program_id: payload.program_id,
                client_id: payload.user_id,
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
      console.log("assign program_id pyload", payload);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation($program_id : Int!, $client_id: Int!) {
                insert_Fitness_program_assigned_clients_one(object: {program_id: $program_id, client_id:$client_id}){
                  id
                }
              }
              
              
              `,
              variables: {
                program_id: payload.program_id,
                client_id: payload.user_id,
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
      console.log("program assigned clients fetch", context);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = {
          program_assigned_clients: {
            program_id: { _eq: context.program_id.value.value },
          },
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
