<template>
  <div v-if="isExternalIcon" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const isExternalIcon = computed<boolean>((): boolean => {
      return isExternal(props.iconClass)
    })

    const iconName = computed<string>((): string => {
      return `#icon-${props.iconClass}`
    })

    const svgClass = computed<string>((): string => {
      if (props.className) {
        return 'svg-icon ' + props.className
      } else {
        return 'svg-icon'
      }
    })

    const styleExternalIcon = computed<Record<string, any>>(
      (): Record<string, any> => {
        return {
          mask: `url(${props.iconClass}) no-repeat 50% 50%`,
          '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
        }
      }
    )

    return {
      isExternalIcon,
      iconName,
      svgClass,
      styleExternalIcon
    }
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
