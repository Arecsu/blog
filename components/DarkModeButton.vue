<template>
      <button v-tippy="{ content: `${themeState}`, placement: 'bottom-start' }" class="button-no-style" @click="next()">
         <Transition name="slide-up">
            <Icon v-if="isActuallyDark() === 'dark'" name="fluent:weather-moon-16-regular" size="1.1em" />
            <Icon v-else name="fluent:weather-sunny-16-filled" size="1.1em" />
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
   transition: opacity 1s, transform 1s;
   transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
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
}

button svg {
   grid-area: 1 / 1 / 2 / 2;
   margin-top: .1em;

}
</style>