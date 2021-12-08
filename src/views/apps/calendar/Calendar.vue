<template>
  <div class="app-calendar overflow-hidden border">
    <div class="row no-gutters">
      <!-- Sidebar -->
      <div
        class="
          col
          app-calendar-sidebar
          flex-grow-0
          overflow-hidden
          d-flex
          flex-column
        "
        :class="{ show: isCalendarOverlaySidebarActive }"
      >
        <calendar-sidebar
          :is-event-handler-sidebar-active.sync="isEventHandlerSidebarActive"
        />
      </div>
      <!-- Calendar -->
      <div class="col position-relative">
        <div class="card shadow-none border-0 mb-0 rounded-0">
          <div class="card-body pb-0">
            <full-calendar
              ref="refCalendar"
              :options="calendarOptions"
              class="full-calendar"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar Overlay -->
      <div
        class="body-content-overlay"
        :class="{ show: isCalendarOverlaySidebarActive }"
        @click="isCalendarOverlaySidebarActive = false"
      />
      <calendar-event-handler
        v-model="isEventHandlerSidebarActive"
        :event="event"
        :clear-event-data="clearEventData"
        @remove-event="removeEvent"
        @add-event="addEvent"
        @update-event="updateEvent"
      />
    </div>

    <b-modal
      v-model="showEventDetailModal"
      title="Event Information"
      centered
      hide-header
      hide-footer
    >
      <b-card no-body class="card-developer-meetup">
        <div class="bg-light-primary rounded-top text-center"></div>
        <b-card-body>
          <!-- metting header -->
          <div class="meetup-header d-flex align-items-center">
            <div class="my-auto">
              <b-card-title class="mb-25">
                {{ event.title }}
              </b-card-title>
              <b-card-text class="mb-0">
                {{ event.extendedProps.description }}
              </b-card-text>
            </div>
          </div>
          <!--/ metting header -->

          <!-- media -->
          <b-media no-body>
            <b-media-aside class="mr-1">
              <b-avatar rounded variant="light-primary" size="34">
                <feather-icon icon="CalendarIcon" size="18" />
              </b-avatar>
            </b-media-aside>
            <b-media-body v-if="event.extendedProps.type === 'Other'">
              <h6 class="mb-0">Event Start Date:</h6>
              <small>{{ event.start | moment("dddd, MMMM Do YYYY") }}</small>
            </b-media-body>
            <b-media-body v-else>
              <h6 class="mb-0">Workout Date:</h6>
              <small>{{ event.start | moment("dddd, MMMM Do YYYY") }}</small>
            </b-media-body>
            <b-media-aside class="mr-1">
              <b-avatar rounded variant="light-primary" size="34">
                <feather-icon icon="MapPinIcon" size="18" />
              </b-avatar>
            </b-media-aside>
            <b-media-body>
              <h6 class="mb-0">Location:</h6>
              <small>{{
                event.extendedProps.location ? "Online" : "Gymnaisum"
              }}</small>
            </b-media-body>
          </b-media>
          <hr class="invoice-spacing" />

          <b-button
            v-if="event.extendedProps.type === 'Other'"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            block
            variant="primary"
            target="_blank"
            :href="event.url"
          >
            Visit the website
          </b-button>
          <b-button
            v-if="event.extendedProps.type === 'program'"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            block
            variant="primary"
          >
            View Program
          </b-button>
          <b-media no-body> </b-media>
        </b-card-body>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import store from "@/store";
import { onUnmounted, ref } from "@vue/composition-api";
import calendarStoreModule from "./calendarStoreModule";
import CalendarSidebar from "./calendar-sidebar/CalendarSidebar.vue";
import CalendarEventHandler from "./calendar-event-handler/CalendarEventHandler.vue";
import useCalendar from "./useCalendar";
import Ripple from "vue-ripple-directive";

import {
  BCard,
  BImg,
  BCardBody,
  BCardText,
  BCardTitle,
  BMedia,
  BMediaAside,
  BAvatar,
  BAvatarGroup,
  VBTooltip,
  BMediaBody,
  BButton,
} from "bootstrap-vue";
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    CalendarSidebar,
    CalendarEventHandler,
    BCard,
    BImg,
    BCardBody,
    BCardText,
    BCardTitle,
    BMedia,
    BMediaAside,
    BAvatar,
    BAvatarGroup,
    BMediaBody,
    BButton,
  },
  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },

  setup() {
    const CALENDAR_APP_STORE_MODULE_NAME = "calendar";

    // Register module
    if (!store.hasModule(CALENDAR_APP_STORE_MODULE_NAME))
      store.registerModule(CALENDAR_APP_STORE_MODULE_NAME, calendarStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CALENDAR_APP_STORE_MODULE_NAME))
        store.unregisterModule(CALENDAR_APP_STORE_MODULE_NAME);
    });

    const {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      showEventDetailModal,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      fetchEvents,
      refetchEvents,
      calendarOptions,

      // ----- UI ----- //
      isEventHandlerSidebarActive,
    } = useCalendar();

    fetchEvents();

    return {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      refetchEvents,
      calendarOptions,

      // ----- UI ----- //
      isEventHandlerSidebarActive,

      //Modal
      showEventDetailModal,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
</style>
