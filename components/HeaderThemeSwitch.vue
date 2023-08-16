<template>
   <button v-tippy="{ content: `${themeState.tooltip}`, placement: 'bottom-start' }" class="button-no-style"
      @click="cycleThemeNext()">
      <Transition name="slide-up">
         <Icon v-if="themeState.icon === 'dark'" name="tabler:ghost-filled" size="1.2em" />
         <Icon v-else-if="themeState.icon === 'light'" name="ic:outline-lightbulb" size="1.1em" />
         <Icon v-else name="ic:outline-lightbulb" size="1.1em" />
      </Transition>
   </button>
</template>

<script setup>
// useCycleList has { state, next, prev }
// const { state, next } = useCycleList(['dark', 'light', 'cafe', 'contrast', 'auto'], { initialValue: mode })
// connecting this to https://color-mode.nuxtjs.org/
const colorMode = useColorMode()
const { state: cycleThemeState, next: cycleThemeNext } = useCycleList(['dark', 'light', 'system'], { initialValue: colorMode.value })
watchEffect(() => colorMode.preference = cycleThemeState.value)


// colorMode.preference:  Actual color-mode selected (can be 'system'), update it to change the user preferred color mode
// colorMode.value:       Useful to know what color mode has been detected when $colorMode === 'system', you should not update it
const themeState = computed(() => {
   switch (colorMode.preference) {
      case 'light':
         return { tooltip: 'vitamina D 🏖️', icon: 'light' }
      case 'dark':
         return { tooltip: 'oscuroOooOo 🦉', icon: 'dark' }
   }
   // case 'system':
   return { tooltip: 'igual que el sistema 💿', icon: colorMode.value /* could be 'light' or 'dark' */ }
})
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
   transition: opacity .7s, transform .7s;
   transition-timing-function: cubic-bezier(0.68, -0.5, 0.15, 1.38);
}

.slide-up-enter-from {
   opacity: 0;
   transform: translateY(1em);
}

.slide-up-leave-to {
   opacity: 0;
   transform: translateY(-1em);
}
</style>

<style scoped>
button {
   display: inline-grid;
   width: 1.85em;
}

button svg {
   grid-area: 1 / 1 / 2 / 2;
   margin-top: .1em;

}
</style>