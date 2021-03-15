<template>
  <teleport to="body">
    <div :class="{ show: show }" class="rightPanel-container">
      <div ref="rightPanelBackgroundRef" class="rightPanel-background" />
      <div class="rightPanel">
        <div class="handle-button" :style="{ top: buttonTop + 'px', 'background-color': theme }" @click="show = !show">
          <i :class="show ? 'el-icon-close' : 'el-icon-setting'" />
        </div>
        <div class="rightPanel-items">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { addClass, removeClass } from '@/utils/document'

export default defineComponent({
  name: 'RightPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  setup(props) {
    const store = useStore()

    const show = ref<boolean>(false)

    const theme = computed(() => {
      return store.state.settings.theme
    })

    const rightPanelBackgroundRef = ref<any>(null)

    watch(show, (newVal: boolean) => {
      if (newVal) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    })

    const closeRightPanel = () => {
      if (!props.clickNotClose) {
        show.value = false
      }
    }

    onMounted(() => {
      // click background to close event listener
      rightPanelBackgroundRef.value.addEventListener('click', closeRightPanel)
    })

    onBeforeUnmount(() => {
      // click background to close event listener
      rightPanelBackgroundRef.value.removeEventListener('click', closeRightPanel)
    })

    return {
      show,
      theme,
      rightPanelBackgroundRef
    }
  }
})
</script>

<style lang="scss">
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-container {
  &.show {
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

    .rightPanel-background {
      z-index: 20000;
      opacity: 1;
      width: 100%;
      height: 100%;
    }

    .rightPanel {
      transform: translate(0);
    }
  }

  .rightPanel-background {
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    background: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }

  .rightPanel {
    width: 100%;
    max-width: 260px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform: translate(100%);
    background: #fff;
    z-index: 40000;

    .handle-button {
      width: 48px;
      height: 48px;
      position: absolute;
      left: -48px;
      text-align: center;
      font-size: 24px;
      border-radius: 6px 0 0 6px !important;
      z-index: 0;
      pointer-events: auto;
      cursor: pointer;
      color: #fff;
      line-height: 48px;
      i {
        font-size: 24px;
        line-height: 48px;
      }
    }
  }
}
</style>
