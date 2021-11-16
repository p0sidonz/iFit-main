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
            "http://localhost:8080/v1/graphql",
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
            "http://localhost:8080/v1/graphql",
            {
              query: `query MyQuery ($id: Int!) {
                  Fitness_UserRelation_by_pk(id: $id) {
                    id
                    status
                    Diets {
                      id
                      diet_name
                      diet_description
                    }
                    User {
                      id
                      username
                      role
                      phonenumber
                      country
                      fullname
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
            "http://localhost:8080/v1/graphql",
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
          "http://localhost:8080/v1/graphql",
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
