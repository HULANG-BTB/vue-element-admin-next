<template>
  <div class="app-container">
    <aside>
      The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.</a>
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      Show Guide
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css

const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: 'Hamburger',
      description: 'Open && Close sidebar',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: 'Breadcrumb',
      description: 'Indicate the current page location',
      position: 'bottom'
    }
  },
  {
    element: '#header-search',
    popover: {
      title: 'Page Search',
      description: 'Page search, quick navigation',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: 'Screenfull',
      description: 'Set the page into fullscreen',
      position: 'left'
    }
  },
  {
    element: '#size-select',
    popover: {
      title: 'Switch Size',
      description: 'Switch the system size',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: 'Tags view',
      description: 'The history of the page you visited',
      position: 'bottom'
    },
    padding: 0
  }
]

export default defineComponent({
  name: 'Guide',
  setup() {
    let driver: any = null

    const guide = () => {
      driver.defineSteps(steps)
      driver.start()
    }

    onMounted(() => {
      driver = new Driver()
    })

    return {
      guide
    }
  }
})
</script>
