import { _ } from './utils'
import { initProxy } from './proxy'
import { initWidget } from './widget'

const Window: any = (typeof window !== 'undefined') ? window : {}

if (Window) {
  Window.addEventListener('load', () => {
    if (Window.document.body.id !== 'elrond-connect') {
      initProxy()
    } else {
      initWidget()
    }
  }, { once: true })
}
