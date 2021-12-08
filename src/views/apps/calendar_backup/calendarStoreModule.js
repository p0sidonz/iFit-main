import axios from "@axios";
import { computed } from "@vue/composition-api";

export default {
  namespaced: true,
  state: {
    calendarOptions: [
      {
        color: "danger",
        label: "program",
      },
      {
        color: "success",
        label: "diet",
      },
    ],
    trainerOptions: [],
    selectedTrainers: [],
    selectedCalendars: ["program", "diet"],

    //for user role trainer
    selectedUsers: [],
    userOption: [],
    USERINFO: JSON.parse(localStorage.getItem("userInfo")),
  },
  getters: {},
  mutations: {
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val;
    },
    SET_TRAINER_EVENTS(state, val) {
      state.selectedTrainers = val;
    },
    SET_TRAINER_OPT_EVENTS(state, val) {
      state.trainerOptions = val;
    },
    SET_USER_EVENTS(state, val) {
      state.selectedUsers = val;
    },
    SET_USER_SELECTED_EVENTS(state, val) {
      state.userOption = val;
    },
  },
  actions: {
    fetchEvents(ctx, payload) {
      console.log("payload",payload)
      let searchType = payload.type[0];
      let rid = null;
      if (payload.trainerlist) {
        rid = payload.trainerlist.trainer_list_arr[0].id;
      }
      if (payload.userlist) {
        rid = payload.userlist.traineelist.id;
      }
      let where = {};
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        if (payload.type.length === 2) {
          where = { UserRelation: { id: { _eq: rid } } };
        }
        if (payload.type.length < 2) {
          where = {
            UserRelation: { id: { _eq: rid } },
            _and: { type: { _eq: searchType } },
          };
        }
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_userrelation_calendar_bool_exp = {}) {
                Fitness_userrelation_calendar(where: $where) {
                  id
                  url
                  title
                  start
                  end
                  allDay
                  type
                  workout {
                    id
                    title
                  }
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

    fetchbyUserList(ctx, payload) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = { traineelist: {} };
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery($where: Fitness_User_bool_exp = {}, $offset: Int, $limit: Int) {
                Fitness_User(where: $where, limit: $limit, offset: $offset) {
                  id
                  fullname
                  traineelist{
                    id
                  }
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

    fetchbyTrainerCalendar(ctx, payload) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");
        let where = { trainer_list_arr: {} };
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

                  }
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

    fetchEventsx(ctx, { calendars }) {
      console.log(calendars);
      return new Promise((resolve, reject) => {
        axios
          .get("/apps/calendar/events", {
            params: {
              calendars: calendars.join(","),
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    addEvent(ctx, { event }) {
      console.log(event);

      return new Promise((resolve, reject) => {
        axios
          .post("/apps/calendar/events", { event })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    updateEvent(ctx, { event }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/apps/calendar/events/${event.id}`, { event })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    removeEvent(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/apps/calendar/events/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
};
