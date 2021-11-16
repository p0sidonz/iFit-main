<template>
  <div>
    <!-- modal trigger button -->
    <b-modal title="Assigned P.t">
      <b-card-text>
        <h5>Check First Paragraph</h5>
        Oat cake ice cream candy chocolate cake chocolate cake cotton candy
        dragée apple pie. Brownie carrot cake candy canes bonbon fruitcake
        topping halvah. Cake sweet roll cake cheesecake cookie chocolate cake
        liquorice.
      </b-card-text>
    </b-modal>
  </div>
</template>

   <script>
import { BModal, BButton, VBModal, BAlert, } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BButton,
    BModal,
    BAlert,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
}
</script>
 