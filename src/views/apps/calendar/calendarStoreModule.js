import axios from "@axios";

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
    trainerOptions: ["Ankit Singh", "Kratos"],
    selectedTrainers:[],

    selectedCalendars: ["program",  "diet"],
  },
  getters: {},
  mutations: {
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val;
    },
    SET_TRAINER_EVENTS(state, val) {
      state.selectedTrainers = val;
    }, 
  },
  actions: {
    fetchEvents(ctx, calendars) {
      console.log(calendars)
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("apollo-token");
        const freshTocken = token.replace(/['"]+/g, "");

        axios
          .post(
            process.env.VUE_APP_GRAPHQL_HTTP,
            {
              query: `query MyQuery {
                Fitness_userrelation_calendar(where: {UserRelation: {id: {_eq: 12}}}) {
                  id
                  url
                  title
                  start
                  end
                  allDay
                  type
                  workout{
                    id
                    title
                  }
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
