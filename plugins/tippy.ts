import VueTippy from 'vue-tippy';
import '/assets/css/tippy.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueTippy, {
        defaultProps: {
            // arrow: true,
            arrow: false,
            animateFill: false,
            animation: 'shift-toward',
            // trigger: 'mouseenter',
            hideOnClick: 'false'
        },
        flipDuration: 0,
    })
})