import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    saveExcercise(ctx, context) {
      // console.log("context", context)
      let test = context.data.filter((item, items) => {
        return delete item.exercise;
      });
      //   console.log("test",test)

      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
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
            process.env.VUE_APP_GRAPHQL_HTTP,
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
          title: { _ilike: `%${value.value}%` },
        };
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_exercise_bool_exp = {}) {
                Fitness_exercise(where: $where){
                  id
                  title
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


    updatePackage(ctx, payload) {
      // let amount = payload.data.amount.replace(/,/g, '');
      //   console.log(amount)
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation updatePackage($id: Int!, $title: String!, 
                $amount: numeric!, $currency: String!, $description: String!,
                $status: String!, $subscription_days: Int! 
                ) {
                  update_Fitness_trainer_package_by_pk
                  (pk_columns: {id: $id},
                    _set: {title: $title,
                      amount: $amount, 
                      currency: $currency, 
                      description: $description, 
                      status: $status, 
                      subscription_days: $subscription_days}) {
                    id
                  }
                }
                
              `,
              variables: {
                id: payload.data.id,
                title: payload.data.title,
                description: payload.data.description,
                amount: amount,
                status: payload.data.status,
                subscription_days: payload.data.subscription_days,
                currency: payload.data.currency,
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


    createProgram(ctx, workoutdata) {
      let amount = workoutdata.amount.replace(/,/g, '');
      amount = parseInt(amount,10);
      console.log(amount)
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation($title: String!, $description: String!, $status: String!, $subscription_days: Int!, $amount: numeric!, $currency: String!) {
                insert_Fitness_trainer_package_one(object: {title: $title, description: $description, amount: $amount, status: $status, subscription_days: $subscription_days, currency: $currency}) {
                  id
                }
              }
              
              `,
              variables: {
                title: workoutdata.title,
                description: workoutdata.description,
                amount: amount,
                status: workoutdata.status,
                subscription_days: workoutdata.days,
                currency: workoutdata.currency,
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

    fetchPackages(ctx, payload) {
      console.log(payload);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        let where = {
          user_id: { _eq: payload.id },
        };
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_trainer_package_bool_exp = {}) {
                Fitness_trainer_package(where: $where) {
                  id
                  title
                  status
                  created_at
                  amount
                  currency
                  subscription_days
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

    previewProgram(ctx, id) {
      console.log("previewProgram", id);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery ($id: Int!){
                Fitness_trainer_package_by_pk(id: $id){
                  id
                  title
                  description
                  amount
                  subscription_days
                  status
                  currency
                  created_at
                  User{
                    id
                    username
                    fullname
                    avatar
                
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

    editPackage(ctx, id) {
      console.log("editPackage", id);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery ($id: Int!){
                Fitness_trainer_package_by_pk(id: $id){
                  id
                  title
                  description
                  amount
                  subscription_days
                  status
                  created_at
                  currency
                  User{
                    id
                    username
                    avatar
                    fullname
                    
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

    createProgram(ctx, workoutdata) {
      console.log("package store dta", workoutdata);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation($title: String!, $description: String!, $status: String!, $subscription_days: Int!, $amount: numeric!, $currency: String!) {
                insert_Fitness_trainer_package_one(object: {title: $title, description: $description, amount: $amount, status: $status, subscription_days: $subscription_days, currency: $currency}) {
                  id
                }
              }
              
              `,
              variables: {
                title: workoutdata.title,
                description: workoutdata.description,
                amount: workoutdata.amount,
                status: workoutdata.status,
                subscription_days: workoutdata.days,
                currency: workoutdata.currency,
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
