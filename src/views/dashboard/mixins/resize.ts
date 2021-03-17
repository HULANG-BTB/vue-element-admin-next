import { debounce } from '@/utils'
import { nextTick } from 'vue'

function useResize() {
  let sidebarElement: any = document.getElementsByClassName('sidebar-container')[0]

  const resizeHandlerStack: Function[] = []

  const resizeHandler = debounce(() => {
    resizeHandlerStack.forEach((handler: Function) => handler())
  }, 50)

  const initResizeEvent = () => {
    window.addEventListener('resize', () => resizeHandler())
  }
  const destroyResizeEvent = () => {
    window.removeEventListener('resize', () => resizeHandler())
  }

  const sidebarResizeHandler = (e: any) => {
    if (e.propertyName === 'width') {
      resizeHandler()
    }
  }

  const initSidebarResizeEvent = () => {
    // 组件更新之后再添加监听事件
    nextTick(() => {
      sidebarElement = sidebarElement || document.getElementsByClassName('sidebar-container')[0]
      sidebarElement?.addEventListener('transitionend', sidebarResizeHandler)
    })
  }

  const destroySidebarResizeEvent = () => {
    sidebarElement?.removeEventListener('transitionend', sidebarResizeHandler)
  }

  const onResize = (...customResizeHandlers: Function[]) => {
    resizeHandlerStack.push(...customResizeHandlers)
  }

  initResizeEvent()
  initSidebarResizeEvent()

  const onCancel = () => {
    destroyResizeEvent()
    destroySidebarResizeEvent()
  }
  return { onResize, onCancel }
}

export default useResize
