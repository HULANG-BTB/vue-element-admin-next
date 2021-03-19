<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      Fixed header, sorted by header order,
    </div>
    <fixed-head />

    <div style="margin:30px 0 5px 20px">
      Not fixed header, sorted by click order
    </div>
    <unfixed-head />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import FixedHead from './components/fixed-head.vue'
import UnfixedHead from './components/unfixed-head.vue'

export default defineComponent({
  name: 'DynamicTable',
  components: { FixedHead, UnfixedHead }
})
</script>
