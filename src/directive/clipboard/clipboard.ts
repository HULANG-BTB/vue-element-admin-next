import { ObjectDirective, DirectiveBinding } from 'vue'

import Clipboard from 'clipboard'

const clipboard: ObjectDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    if (binding.arg === 'success') {
      el.clipboardSuccessCallback = binding.value
    } else if (binding.arg === 'error') {
      el.clipboardErrorCallback = binding.value
    } else {
      const clipboard = new Clipboard(el, {
        text() {
          return binding.value
        },
        action() {
          return binding.arg === 'cut' ? 'cut' : 'copy'
        }
      })
      clipboard.on('success', (e) => {
        const callback = el.clipboardSuccessCallback
        callback?.(e)
      })
      clipboard.on('error', (e) => {
        const callback = el.clipboardErrorCallback
        callback?.(e)
      })
      el.clipboard = clipboard
    }
  },
  beforeUnmount(el: any, binding: DirectiveBinding) {
    if (binding.arg === 'success') {
      delete el.clipboardSuccessCallback
    } else if (binding.arg === 'error') {
      delete el.clipboardErrorCallback
    } else {
      el.clipboard.destroy()
      delete el.clipboard
    }
  }
}

export default clipboard
