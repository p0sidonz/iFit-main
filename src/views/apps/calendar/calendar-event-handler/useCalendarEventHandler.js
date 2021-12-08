import { ref, computed, watch } from '@vue/composition-api'
import store from '@/store'

export default function useCalendarEventHandler(props, clearForm, emit) {
  // ------------------------------------------------
  // eventLocal
  // ------------------------------------------------
  const eventLocal = ref(JSON.parse(JSON.stringify(props.event.value)))
  const resetEventLocal = () => {
    eventLocal.value = JSON.parse(JSON.stringify(props.event.value))
  }
  watch(props.event, () => {
    resetEventLocal()
  })

  // ------------------------------------------------
  // isEventHandlerSidebarActive
  // * Clear form if sidebar is closed
  // ------------------------------------------------
  watch(props.isEventHandlerSidebarActive, val => {
    if(val === true && props.event.value.extendedProps.type != "Other") {
      clearForm.value()
    }
    // ? Don't reset event till transition is finished
    if (!val) {
      setTimeout(() => {
        clearForm.value()
      }, 350)
    }
  })

  // ------------------------------------------------
  // calendarOptions
  // ------------------------------------------------
  const calendarOptions = computed(() => store.state.calendar.calendarOptions)

  const onSubmit = () => {
    const eventData = JSON.parse(JSON.stringify(eventLocal))
    
    // * If event has id => Edit Event
    // Emit event for add/update event
    if (props.event.value.id) emit('update-event', eventData.value)
    else emit('add-event', eventData.value)

    // Close sidebar
    emit('update:is-event-handler-sidebar-active', false)
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  // ------------------------------------------------
  // guestOptions
  // ------------------------------------------------

  /* eslint-disable global-require */
  const guestsOptions = computed(() => store.state.calendar.userOption);
  /* eslint-enable global-require */

  return {
    eventLocal,
    resetEventLocal,
    calendarOptions,

    // UI
    guestsOptions,
    onSubmit,
  }
}
