import axios from "@axios";

export default {
  namespaced: true,
  state: {
    calendarOptions: [
      {
        color: "danger",
        label: "Program",
      },
      {
        color: "success",
        label: "Holiday",
      },
      {
        color: "info",
        label: "ETC",
      },
    ],
    selectedCalendars: ["Program",  "Holiday", "ETC"],
  },
  getters: {},
  mutations: {
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val;
    },
  },
  actions: {
    fetchEvents(ctx, calendars) {
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
                  url
                  type
                  workout{
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
