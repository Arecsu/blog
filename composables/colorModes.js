import { useColorMode } from '@vueuse/core'

export const colorMode = useColorMode({
   selector: 'html',
   attribute: 'theme',
   emitAuto: true,
})