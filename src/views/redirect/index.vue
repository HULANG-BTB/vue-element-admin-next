<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute, Router, RouteLocationNormalizedLoaded } from 'vue-router'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const router: Router = useRouter()
    const { params, query } = route
    const { path } = params
    router.replace({ path: '/' + path, query })
  }
})
</script>
