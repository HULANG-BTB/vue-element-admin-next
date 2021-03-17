import { debounce } from '@/utils'

function useResize() {
  const sidebarElement: any = document.getElementsByClassName('sidebar-container')[0]

  const resizeHandlerStack: Function[] = []

  const resizeHandler = debounce(() => {
    resizeHandlerStack.forEach((handler: Function) => handler())
  }, 300)

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
    sidebarElement?.addEventListener('transitionend', sidebarResizeHandler)
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
