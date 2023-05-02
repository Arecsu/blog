<template>
      <button v-tippy="{ content: `${themeState}`, placement: 'bottom-start' }" class="button-no-style" @click="next()">
         <Transition name="slide-up">
            <Icon v-if="isActuallyDark() === 'dark'" name="tabler:ghost-filled" size="1.2em" />
            <Icon v-else name="ic:outline-lightbulb" size="1.1em" />
         </Transition>
      </button>
</template>

<script setup>
// fluent-emoji:crescent-moon
// fluent-emoji:sun-behind-small-cloud

const { state, next } = useCycleList(['dark', 'light', 'auto'], { initialValue: colorMode })
const isDark = usePreferredDark()

const isActuallyDark = () => {
   if (state.value !== 'auto') {
      return state.value
   }
   return isDark.value ? 'dark' : 'light'
}

const themeState = computed(() => {
   switch (state.value) {
      case 'light':
         return 'vitamina D 🏖️'
      case 'dark':
         return 'oscuroOooOo 🦉'
      case 'auto':
         return 'igual que el sistema 💿'
   }
   return ''
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