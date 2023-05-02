<template>
   <button v-tippy="{ content: `${themeState.tooltip}`, placement: 'bottom-start' }" class="button-no-style"
      @click="next()">
      <Transition name="slide-up">
         <Icon v-if="themeState.icon === 'dark'" name="tabler:ghost-filled" size="1.2em" />
         <Icon v-else-if="themeState.icon === 'light'" name="ic:outline-lightbulb" size="1.1em" />
      </Transition>
   </button>
</template>

<script setup>
// fluent-emoji:crescent-moon
// fluent-emoji:sun-behind-small-cloud

// systemColorMode.value can be 'dark' or 'light'
// pageColorMode.value can be 'dark', 'light' or 'auto'
const { state, next } = useCycleList(['dark', 'light', 'auto'], { initialValue: pageColorMode })
watchEffect(() => pageColorMode.value = state.value)


const themeState = computed(() => {
   switch (pageColorMode.value) {
      case 'light':
         return { tooltip: 'vitamina D 🏖️', icon: 'light' }
      case 'dark':
         return { tooltip: 'oscuroOooOo 🦉', icon: 'dark' }
   }
   // case 'auto':
   return { tooltip: 'igual que el sistema 💿', icon: systemColorMode.value }
})

</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
   transition: opacity .9s, transform .9s;
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