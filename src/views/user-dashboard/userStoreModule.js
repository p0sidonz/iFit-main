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
                  updated_at
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

    getWorkout(ctx, id) {
      console.log(id.id);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
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
    
    fetchUsers(ctx, queryParams) {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      console.log("queryParams", queryParams);
      let where = {trainer_list_arr : {}};
      return new Promise((resolve, reject) => {


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
                  status
                  trainer_list_arr{
                    id
                    status
                    user_subscriptions{
                      start_date
                      end_date
                      trainer_package{
                        id
                        title
                        subscription_days
                      }
                    
                  
                    }
                  }
                }
                Fitness_User_aggregate(where: $where){
                  aggregate{
                    count
                  }
                }
              }`,
              variables: {
                where,
                limit: queryParams.perPage,
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
    fetchUser(ctx, { id }) {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery ($id: Int!) {
                  Fitness_UserRelation_by_pk(id: $id) {
                    id
                    status
                    additional_profile_detail{
                      profile_completed
                    }
                    user_subscriptions(order_by: {created_at: asc}) {
                      start_date
                      end_date
                      order_status
                      trainer_package{
                        id
                        title
                        amount
                        subscription_days
                        created_at
                      }
                    }
                    program_assigned_clients{
                      program_details{
                        id
                        title
                        
                      }
                    }		
                    
                    diet_assigned_clients{
                      diet_details{
                        id
                        diet_name
                        diet_description
                      }
                    }
                    User {
                      id
                      role
                      gender
                    }
                    TrainerByUserId {
                      id
                      username
                      role
                      avatar
                      phonenumber
                      country
                      fullname
                      status
                      is_applied
                      
                    }
                  }
              }
              `,
              variables: {
                id,
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
    addUser(ctx, userData) {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      return new Promise((resolve, reject) => {
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `mutation MyMutation ($phonenumber: Int!, $email: String!, $firstName: String!,$password : String!, $username:  String!, $lastName: String! ){
                addUserToTrainer(phonenumber: $phonenumber, email: $email, firstName:  $firstName, password: $password , username: $username, lastName: $lastName) {
                  ok
                  error
                }
              }
              `,
              variables: {
                phonenumber: userData.phonenumber,
                email: userData.email,
                firstName: userData.firstname,
                password: userData.password,
                username: userData.username,
                lastName: userData.lastname,
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

  viewDietPlans(ctx, userData) {
    const token = localStorage.getItem("apollo-token");
    const freshTocken = token.replace(/['"]+/g, "");

    return new Promise((resolve, reject) => {
      axios
        .post(
          process.env.VUE_APP_GRAPHQL_HTTP,
          {
            query: `mutation MyMutation ($phonenumber: Int!, $email: String!, $firstName: String!,$password : String!, $username:  String!, $lastName: String! ){
              addUserToTrainer(phonenumber: $phonenumber, email: $email, firstName:  $firstName, password: $password , username: $username, lastName: $lastName) {
                ok
                error
              }
            }
            `,
            variables: {
              phonenumber: userData.phonenumber,
              email: userData.email,
              firstName: userData.firstname,
              password: userData.password,
              username: userData.username,
              lastName: userData.lastname,
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
};
