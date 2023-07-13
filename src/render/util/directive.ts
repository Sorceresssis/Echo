import { Directive } from 'vue'

export const vFocus: Directive = (el: HTMLElement) => {
    el.focus()
}