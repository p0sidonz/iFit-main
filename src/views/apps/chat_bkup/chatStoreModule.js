import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchChatsAndContacts() {
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
              query: `query ChatsListQuery($userId: Int!, $where: Fitness_User_bool_exp = {}) {
                Fitness_chat(order_by: [{chat_messages_aggregate: {max: {created_at: desc}}}]) {
                  id
                  userId
                  chat_users(where: {user_id: {_neq: $userId}}) {
                    User {
                      id
                      fullname
                      role
                      avatar
                      status
                    }
                  }
                }
                Fitness_User_by_pk(id: $userId) {
                  id
                  fullname
                  role
                  avatar
                  status
                  about
                }
                Fitness_User(where: $where) {
                  id
                  fullname
                  role
                  avatar
                  status
                  about
                }
              }
              
              
              `,
              variables: {
                userId: 18,
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

    getProfileUser() {
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
              query: `query getProfileInfo($userId: Int!) {
                Fitness_User_by_pk (id : $userId){
                  id
                  fullname
                  role
                  avatar
                  status
                  about
                  email
                }
              }
              
              `,
              variables: {
                userId: 18,
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

    getChat(ctx, { userId }) {
      console.log("get chat", userId);
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
              query: `query MyQuery($where: Fitness_chat_users_bool_exp = {}) {
                Fitness_chat_users(where: $where){
                  user_id
                  chat_id
                  chat{
                  chat_messages{
                    id
                    content
                    created_at
                    sender_id
                  }
                  chat_users{
                    User{
                      id
                      fullname
                      role
                      avatar
                      status
                      about
                      email
                    }
                  }
                  }
                }
              }
              
              `,
              variables: {
                where: { user_id: { _eq: userId } },
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

    createNewChat(ctx, {userId}) {
      console.log("createNewChat",userId)
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let objects = {
          name: "Auto created",
          chat_users: {data: {user_id: userId}}
        };

        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation($objects: [Fitness_chat_insert_input!] = {}) {
                insert_Fitness_chat(objects: $objects){
                  affected_rows
                }
              }
              
              
              `,
              variables: {
                objects
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


    sendMessage(ctx, payload) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        // let objects = {
        //   content: payload.content,
        //   chat_id: payload.chat_id,
        //   sender_id: payload.sender_id
        // };
        axios
          .post(
            "http://localhost:8080/v1/graphql",
            {
              query: `mutation MyMutation($objects: [Fitness_chat_message_insert_input!] = {}) {
                insert_Fitness_chat_message(objects: $objects){
                  returning{
                    id
                    sender_id
                    content
                  }
                }
              }
              
              
              `,
              variables: {
                objects : {
                  content: payload.content,
                  chat_id: payload.chat_id,
                  sender_id: payload.sender_id
                }
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
