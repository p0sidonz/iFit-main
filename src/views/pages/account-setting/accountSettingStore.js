import axios from "@axios";
import { GET_TRAINEE } from "@/queries/";
import gql from "graphql-tag";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUser(ctx, { id }) {
      const token = localStorage.getItem("apollo-token");
      const freshTocken = token.replace(/['"]+/g, "");

      return new Promise((resolve, reject) => {
        axios
          .post(
            "http://127.0.0.1:8080/v1/graphql",
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
  },
};
