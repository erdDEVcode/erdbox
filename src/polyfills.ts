import { Buffer } from 'buffer'
const Window: any = (typeof window !== 'undefined') ? window : {}
if (Window) {
  Window.Buffer = Buffer
}