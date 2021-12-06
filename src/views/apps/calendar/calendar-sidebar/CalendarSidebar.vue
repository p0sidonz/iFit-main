<template>
  <div class="sidebar-wrapper d-flex justify-content-between flex-column flex-grow-1">
    <div class="p-2">


                <h5 class="app-label section-label mb-1 text-primary">
          <span class="align-middle">Select the trainer to get your schedule</span>
        </h5>
      <b-form-group>
        <v-select
        
          v-model="selectedTrainers"
          label="fullname"
          :options="trainerOptions"
        />
      </b-form-group>


      <div class="mt-3">
        <h5 class="app-label section-label mb-1">
          <span class="align-middle">Calendar options</span>
        </h5>
        <b-form-checkbox
          v-model="checkAll"
          class="mb-1"
        >
          View All
        </b-form-checkbox>
        <b-form-group>
          <b-form-checkbox-group
            v-model="selectedCalendars"
            name="event-filter"
            stacked
          >
            <b-form-checkbox
              v-for="item in calendarOptions"
              :key="item.label"
              name="event-filter"
              :value="item.label"
              class="mb-1"
              :class="`custom-control-${item.color}`"
            >
              {{ item.label.toUpperCase() }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>


      </div>
    </div>
    <b-img :src="require('@/assets/images/pages/calendar-illustration.png')" />
  </div>
</template>

<script>
import {
  BButton, BFormGroup, BFormCheckboxGroup, BFormCheckbox, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import useCalendarSidebar from './useCalendarSidebar'
import vSelect from 'vue-select'

export default {
  directives: {
    Ripple,
  },
  components: {
    BButton,
    BImg,
    BFormCheckbox,
    BFormGroup,
    BFormCheckboxGroup,
    vSelect
  },
  props: {
    isEventHandlerSidebarActive: {
      type: Boolean,
      require: true,
    },
  },
  setup() {
    const {
      calendarOptions,
      trainerOptions,
      selectedCalendars,
      selectedTrainers,
      checkAll,
    } = useCalendarSidebar()

    return {
      calendarOptions,
      selectedCalendars,
      selectedTrainers,
      trainerOptions,
      checkAll,
    }
  },
}
</script>

<style>

</style>
