import axios from "@axios";
import { GET_TRAINEE } from "@/queries/";
import gql from "graphql-tag";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {



    fetchUsers(ctx, queryParams) {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      console.log("queryParams", queryParams);
      let where = {};
      return new Promise((resolve, reject) => {
        if (queryParams.role & queryParams.status) {
          where = {
            role: { _in: queryParams.role },
            traineelist: {
              User: {
                status: { _eq: queryParams.status },
              },
            },
          };
        }
        if (queryParams.role & queryParams.status & queryParams.q) {
          where = {
            role: { _eq: queryParams.role },
            traineelist: {
              User: {
                firstName: { _ilike: `%${queryParams.q}%` },
                status: { _eq: queryParams.status },
              },
            },
          };
        }
        if (queryParams.role) {
          where = {
            traineelist: {
              User: {
                role: { _in: queryParams.role },
              },
            },
          };
        }
        if (queryParams.q) {
          where = {
            traineelist: {
              User: {
                firstName: { _ilike: `%${queryParams.q}%` },
              },
            },
          };
        }
        if (queryParams.status) {
          where = {
            traineelist: {
              status: { _eq: queryParams.status },
            },
          };
        }
        if (!queryParams.role & !queryParams.q & !queryParams.status) {
          where = {
            traineelist: {},
          };
        }
        console.log(where);

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
                    user_subscriptions(where: {is_expired: {_eq: true}}){
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
                      username
                      role
                      avatar
                      phonenumber
                      country
                      fullname
                      status
                      is_follow
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
