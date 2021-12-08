import axios from "@axios";
import { computed } from "@vue/composition-api";
import { BIconX } from "bootstrap-vue";

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
      console.log("payload", payload);
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
                  location
                  description
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

    addEvent(ctx, event) {
      let xyz = event;
      console.log("eventt", xyz.event);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        let x = {
          title: event.event.title,
          url: event.event.eventUrl,
          type: event.event.extendedProps.type,
          start: event.event.start,
          end: event.event.end,
          allDay: event.event.allDay,
          description: event.event.extendedProps.description,
          relation_id: xyz.event.extendedProps.guests.traineelist.id,
        };
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `
             

              mutation MyMutation($start: date, $end: date, $relation_id: Int! $type: String,
                $url: String, $allDay : Boolean!, $title: String!
                ) {
                  insert_Fitness_userrelation_calendar(objects: {
                    start:$start, 
                    end: $end, 
                    relation_id: $relation_id,
                    type: $type,
                    url: $url,
                    allDay: $allDay,
                    title: $title
                  }) {
                    returning {
                      id
                    }
                  }
                }
          
          `,
              variables: {
                ...x,
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

    updateEvent(ctx, event) {
      let xyz = event;
      console.log(event);
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        let x = {
          id: event.event.id,
          title: event.event.title,
          url: event.event.url,
          type: event.event.extendedProps.type,
          start: event.event.start,
          end: event.event.end,
          allDay: event.event.allDay,
          description: event.event.extendedProps.description,
          location: event.event.extendedProps.location,
          relation_id: xyz.event.extendedProps.guests.traineelist.id,
        };
        console.log("X UPDATED ",x)
        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `
              mutation MyMutation( $id: Int!, $start: date, $end: date, $relation_id: Int!, $type: String, $url: String, $allDay: Boolean!, $title: String!, $location: String, $description: String) {
                update_Fitness_userrelation_calendar( where:
                   {id: {_eq: $id}},
                    _set: {
                      url: $url,
                       type: $type, 
                       title: $title,
                        start: $start, 
                        relation_id: $relation_id, 
                        location: $location, 
                        end: $end, 
                        description: $description, 
                        allDay: $allDay}) {
                  returning {
                    id
                  }
                }
              }
          `,
              variables: {
                ...x,
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
