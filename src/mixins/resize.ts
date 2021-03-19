import { debounce } from '@/utils'
import { nextTick, onBeforeUnmount, onMounted } from 'vue'

export interface IResizeMixin {
  onResize: (handler: (event: any) => void) => void
  onRegister: (element: HTMLElement | any) => void
}

function useResize(wait = 50): IResizeMixin {
  let sidebarElement: any = document.getElementsByClassName('sidebar-container')[0]

  const resizeHandlerStack: Function[] = []

  const registerElementStack: any[] = []

  const resizeHandler = debounce(() => {
    resizeHandlerStack.forEach((handler: Function) => handler())
  }, wait)

  const initWindowResizeEvent = () => {
    window.addEventListener('resize', resizeHandler)
  }
  const destroyWindowResizeEvent = () => {
    window.removeEventListener('resize', resizeHandler)
  }

  const initCustomResizeEvent = () => {
    registerElementStack.forEach((element: HTMLElement | any) => {
      element?.addEventListener('resize', resizeHandler)
    })
  }

  const destroyCustomResizeEvent = () => {
    registerElementStack.forEach((element: HTMLElement | any) => {
      element?.removeEventListener('resize', resizeHandler)
    })
  }

  const sidebarResizeHandler = (e: any) => {
    if (e.propertyName === 'width') {
      resizeHandler(e)
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

  const onRegister = (el: HTMLElement | any) => {
    registerElementStack.push(el)
  }

  onMounted(() => {
    // Mounted 之后 为元素注册事件
    // 注册 Window 上的监听
    initWindowResizeEvent()
    // 注册侧边栏监听
    initSidebarResizeEvent()
    // 注册自定义的元素监听
    initCustomResizeEvent()
  })

  onBeforeUnmount(() => {
    // unMount之前移除注册的事件
    // 移除 Window 上的监听
    destroyWindowResizeEvent()
    // 移除侧边栏监听
    destroySidebarResizeEvent()
    // 移除自定义的元素监听
    destroyCustomResizeEvent()
  })

  return { onResize, onRegister }
}

export default useResize
