// Full Calendar Plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

// eslint-disable-next-line object-curly-newline
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import store from "@/store";

export default function userCalendar() {
  // Use toast
  const toast = useToast();
  // ------------------------------------------------
  // refCalendar
  // ------------------------------------------------
  const refCalendar = ref(null);

  // ------------------------------------------------
  // calendarApi
  // ------------------------------------------------
  let calendarApi = null;
  onMounted(() => {
    calendarApi = refCalendar.value.getApi();
  });

  // ------------------------------------------------
  // calendars
  // ------------------------------------------------
  const calendarsColor = {
    diet: "success",
    program: "danger",
  };

  // ------------------------------------------------
  // event
  // ------------------------------------------------
  const blankEvent = {
    title: "",
    start: "",
    end: "",
    allDay: false,
    url: "",
    extendedProps: {
      calendar: "",
      guests: [],
      location: "",
      description: "",
    },
  };
  const event = ref(JSON.parse(JSON.stringify(blankEvent)));
  const clearEventData = () => {
    event.value = JSON.parse(JSON.stringify(blankEvent));
  };

  // *===========================================================================---*
  // *--------- Calendar API Function/Utils --------------------------------------------*
  // Template Future Update: We might move this utils function in its own file
  // *===========================================================================---*

  // ------------------------------------------------
  // (UI) addEventInCalendar
  // ? This is useless because this just add event in calendar and not in our data
  // * If we try to call it on new event then callback & try to toggle from calendar we get two events => One from UI and one from data
  // ------------------------------------------------
  // const addEventInCalendar = eventData => {
  //   toast({
  //     component: ToastificationContent,
  //     position: 'bottom-right',
  //     props: {
  //       title: 'Event Added',
  //       icon: 'CheckIcon',
  //       variant: 'success',
  //     },
  //   })
  //   calendarApi.addEvent(eventData)
  // }

  // ------------------------------------------------
  // (UI) updateEventInCalendar
  // ------------------------------------------------
  const updateEventInCalendar = (
    updatedEventData,
    propsToUpdate,
    extendedPropsToUpdate
  ) => {
    toast({
      component: ToastificationContent,
      props: {
        title: "Event Updated",
        icon: "CheckIcon",
        variant: "success",
      },
    });

    // const existingEvent = calendarApi.getEventById(updatedEventData.id);

    // --- Set event properties except date related ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setProp
    // dateRelatedProps => ['start', 'end', 'allDay']
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index];
      existingEvent.setProp(propName, updatedEventData[propName]);
    }

    // --- Set date related props ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, {
      allDay: updatedEventData.allDay,
    });

    // --- Set event's extendedProps ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index];
      existingEvent.setExtendedProp(
        propName,
        updatedEventData.extendedProps[propName]
      );
    }
  };

  // ------------------------------------------------
  // (UI) removeEventInCalendar
  // ------------------------------------------------
  const removeEventInCalendar = (eventId) => {
    toast({
      component: ToastificationContent,
      props: {
        title: "Event Removed",
        icon: "TrashIcon",
        variant: "danger",
      },
    });
    calendarApi.getEventById(eventId).remove();
  };

  // ------------------------------------------------
  // grabEventDataFromEventApi
  // ? It will return just event data from fullCalendar's EventApi which is not required for event mutations and other tasks
  // ! You need to update below function as per your extendedProps
  // ------------------------------------------------
  const grabEventDataFromEventApi = (eventApi) => {
    const {
      id,
      title,
      start,
      end,
      url,
      // eslint-disable-next-line object-curly-newline
      extendedProps: { calendar, guests, location, description, type },
      allDay,
    } = eventApi;

    return {
      id,
      title,
      start,
      url,
      end,
      extendedProps: {
        type,
        calendar,
        guests,
        location,
        description,
      },
      allDay,
    };
  };

  // ------------------------------------------------
  // addEvent
  // ------------------------------------------------

  const addEvent = (eventData) => {
    store
      .dispatch("calendar/addEvent", { event: eventData })
      .then((response) => {
        console.log(response);
        // eslint-disable-next-line no-use-before-define
        refetchEvents();
      });
  };

  // ------------------------------------------------
  // updateEvent
  // ------------------------------------------------
  const updateEvent = (eventData) => {
    store
      .dispatch("calendar/updateEvent", { event: eventData })
      .then((response) => {
        if (
          response.data.data.update_Fitness_userrelation_calendar.returning[0]
            .id
        ) {
          toast({
            component: ToastificationContent,
            props: {
              title: "Event Updated",
              icon: "CheckIcon",
              variant: "success",
            },
          });

          // const updatedEvent = response.data.event;

          // const propsToUpdate = ["id", "title", "url"];
          // const extendedPropsToUpdate = [
          //   "calendar",
          //   "guests",
          //   "location",
          //   "description",
          // ];

          // updateEventInCalendar(
          //   updatedEvent,
          //   propsToUpdate,
          //   extendedPropsToUpdate
          // );

          refetchEvents();
        }
      });
  };

  // ------------------------------------------------
  // removeEvent
  // ------------------------------------------------
  const removeEvent = () => {
    const eventId = event.value.id;
    store.dispatch("calendar/removeEvent", { id: eventId }).then(() => {
      removeEventInCalendar(eventId);
    });
  };

  // ------------------------------------------------
  // refetchEvents
  // ------------------------------------------------
  const refetchEvents = () => {
    calendarApi.refetchEvents();
  };

  // ------------------------------------------------
  // selectedCalendars
  // ------------------------------------------------
  const selectedCalendars = computed(
    () => store.state.calendar.selectedCalendars
  );
  const selectedTrainers = computed(
    () => store.state.calendar.selectedTrainers
  );

  const userInformation = computed(() => store.state.calendar.USERINFO);
  const userOption = computed(() => store.state.calendar.userOption);

  const selectedTrainersx = computed({
    get: () => store.state.calendar.selectedTrainers,
    set: (val) => {
      store.commit("calendar/SET_TRAINER_EVENTS", val);
    },
  });

  const selectedUsers = computed(() => store.state.calendar.selectedUsers);

  watch(selectedCalendars, () => {
    refetchEvents();
  });

  watch(selectedTrainers, () => {
    refetchEvents();
  });

  watch(selectedUsers, () => {
    refetchEvents();
  });

  // --------------------------------------------------------------------------------------------------
  // AXIOS: fetchEvents
  // * This will be called by fullCalendar to fetch events. Also this can be used to refetch events.
  // --------------------------------------------------------------------------------------------------
  const fetchEvents = (info, successCallback) => {
    // If there's no info => Don't make useless API call
    if (!info) return;
    // Fetch Events from API endpoint
    if (userInformation.value.role === "user") {
      console.log("I AM AUSER ACCOUNT");
      if (!selectedTrainers.value.length) {
        console.log("empty array", selectedTrainers.value);
        store
          .dispatch("calendar/fetchbyTrainerCalendar", {
            trainerlist: selectedTrainers.value,
            type: selectedCalendars.value,
          })
          .then((response) => {
            store.commit(
              "calendar/SET_TRAINER_OPT_EVENTS",
              response.data.data.Fitness_User
            );
            console.log(selectedTrainers);
          });
      }
      if (
        selectedTrainers.value.length ||
        Object.keys(selectedTrainers.value).length
      ) {
        store
          .dispatch("calendar/fetchEvents", {
            trainerlist: selectedTrainers.value,
            type: selectedCalendars.value,
          })
          .then((response) => {
            let res = response.data.data.Fitness_userrelation_calendar;
            let haha = res.map((item, index) => {
              let ok = item;
              if (item.type === "program") {
                ok.extendedProps = { calendar: "program" };
              }
              if (item.type === "diet") {
                ok.extendedProps = { calendar: "diet" };
              }
              if (item.description) {
                ok.extendedProps = { description: item.description };
              }
              if (item.location) {
                ok.extendedProps = { location: item.location };
              }
              if (item.workout) {
                ok.title = item.workout.title;
              }

              if (item.url === null && !item.workout) {
                ok.url = `#`;
              }
              if (item.url === null && item.workout) {
                ok.url = `workout/view/${item.workout.id}`;
              }
              console.log("fetchevents", ok);
              return ok;
            });

            console.log(response);
            successCallback(res);
          })
          .catch(() => {
            toast({
              component: ToastificationContent,
              props: {
                title: "Error fetching calendar events",
                icon: "AlertTriangleIcon",
                variant: "danger",
              },
            });
          });
      }
    }
    if (userInformation.value.role === "trainer") {
      if (!userOption.value.length) {
        store
          .dispatch("calendar/fetchbyUserList", {
            trainerlist: selectedTrainers.value,
            type: selectedCalendars.value,
          })
          .then((response) => {
            store.commit(
              "calendar/SET_USER_SELECTED_EVENTS",
              response.data.data.Fitness_User
            );
          });
        console.log("USER OPTIONS LIST ", userOption);
      }
      if (
        selectedUsers.value.length ||
        Object.keys(selectedUsers.value).length
      ) {
        store
          .dispatch("calendar/fetchEvents", {
            userlist: selectedUsers.value,
            type: selectedCalendars.value,
          })
          .then((response) => {
            let res = response.data.data.Fitness_userrelation_calendar;
            let haha = res.map((item, index) => {
              let ok = item;
              if (item.type === "program") {
                ok.extendedProps = { calendar: "program" };
              }
              if (item.type === "diet") {
                ok.extendedProps = { calendar: "diet" };
              }

              if (item.workout) {
                ok.title = item.workout.title;
              }
              if (item.description) {
                ok.extendedProps = { description: item.description };
              }
              if (item.location) {
                ok.extendedProps = { location: item.location };
              }

              if (item.url === null && !item.workout) {
                ok.url = `#`;
              }
              if (item.url === null && item.workout) {
                ok.url = `workout/view/${item.workout.id}`;
              }

              console.log("fetchevents", ok);
              return ok;
            });

            console.log(haha);

            successCallback(haha);
          })
          .catch(() => {
            toast({
              component: ToastificationContent,
              props: {
                title: "Error fetching calendar events",
                icon: "AlertTriangleIcon",
                variant: "danger",
              },
            });
          });

        console.log("idk ab kya krna", selectedUsers);
      }
    }
  };

  // ------------------------------------------------------------------------
  // calendarOptions
  // * This isn't considered in UI because this is the core of calendar app
  // ------------------------------------------------------------------------
  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    events: fetchEvents,

    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: false,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: false,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,
    displayEventTime: false,
    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.calendar];

      return [
        // Background Color
        `bg-light-${colorName}`,
      ];
    },
    eventClick({ event: clickedEvent, jsEvent }) {
      jsEvent.preventDefault();
      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      event.value = grabEventDataFromEventApi(clickedEvent);
      // eslint-disable-next-line no-use-before-define
      if (
        userInformation.value.role === "trainer" &&
        event.value.extendedProps.type != "Other"
      ) {
        isEventHandlerSidebarActive.value = false;
        showEventDetailModal.value = true;
      }
      if (
        userInformation.value.role === "trainer" &&
        event.value.extendedProps.type === "Other"
      ) {
        isEventHandlerSidebarActive.value = true;
      }

      if (userInformation.value.role === "user") {
        showEventDetailModal.value = true;
      }
    },

    customButtons: {
      sidebarToggle: {
        // --- This dummy text actual icon rendering is handled using SCSS ----- //
        text: "sidebar",
        click() {
          // eslint-disable-next-line no-use-before-define
          isCalendarOverlaySidebarActive.value = !isCalendarOverlaySidebarActive.value;
        },
      },
    },

    dateClick(info) {
      /*
        ! Vue3 Change
        Using Vue.set isn't working for now so we will try to check reactivity in Vue 3 as it can handle this automatically
        ```
        event.value.start = info.date
        ```
      */
      event.value = JSON.parse(
        JSON.stringify(Object.assign(event.value, { start: info.date }))
      );
      // eslint-disable-next-line no-use-before-define

      if (userInformation.value.role === "trainer") {
        isEventHandlerSidebarActive.value = true;
      }
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      updateEvent(grabEventDataFromEventApi(droppedEvent));
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      updateEvent(grabEventDataFromEventApi(resizedEvent));
    },

    // Get direction from app state (store)
    direction: computed(() => (store.state.appConfig.isRTL ? "rtl" : "ltr")),
    rerenderDelay: 350,
  });

  // ------------------------------------------------------------------------

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const isEventHandlerSidebarActive = ref(false);

  const isCalendarOverlaySidebarActive = ref(false);

  const showEventDetailModal = ref(false);

  return {
    refCalendar,
    isCalendarOverlaySidebarActive,
    calendarOptions,
    event,
    clearEventData,
    addEvent,
    updateEvent,
    removeEvent,
    refetchEvents,
    fetchEvents,

    // ----- UI ----- //
    isEventHandlerSidebarActive,
    showEventDetailModal,
  };
}
