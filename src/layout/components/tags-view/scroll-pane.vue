<template>
  <el-scrollbar ref="scrollContainerRef" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, SetupContext } from 'vue'

export default defineComponent({
  name: 'ScrollPane',
  emits: ['scroll'],
  setup(props, context: SetupContext) {
    const tagAndTagSpacing = 4 // tagAndTagSpacing

    const scrollContainerRef = ref<any>(null)

    const handleScroll = (event: any) => {
      const eventDelta = event.wheelDelta || -event.deltaY * 40
      const $scrollWrapper = scrollContainerRef.value.$refs.wrap

      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }

    const emitScroll = () => {
      context.emit('scroll')
    }

    onMounted(() => {
      scrollContainerRef.value.$refs.wrap.addEventListener('scroll', emitScroll, true)
    })

    onBeforeUnmount(() => {
      scrollContainerRef.value.$refs.wrap.removeEventListener('scroll', emitScroll)
    })

    // 外置方法 移动到目标
    const moveToTarget = (currentTag: any, tagList: any[]) => {
      const $container = scrollContainerRef.value.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = scrollContainerRef.value.$refs.wrap

      // console.log($instance.parent)

      // const tagList = $instance.parent.tagRefs.value
      // console.log(tagList)
      // console.log(tagRefs)

      // const tagList = tagRefs as Array<any>
      let firstTag = null
      let lastTag = null
      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }
      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item: any) => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing
        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    return {
      scrollContainerRef,
      handleScroll,
      moveToTarget
    }
  }
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  /deep/ {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
