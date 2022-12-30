<template>
      <button v-tippy="{ content: `${themeState}` }" class="button-no-style" @click="next()">
         <Transition name="slide-up">
            <Icon v-if="isActuallyDark() === 'dark'" name="fluent-emoji:crescent-moon" size="1.1em" />
            <Icon v-else name="fluent-emoji:sun-behind-small-cloud" size="1.1em" />
         </Transition>
      </button>
</template>

<script setup>

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
   transition: all 1s;
   transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.slide-up-enter-from {
   opacity: 0;
   transform: translateY(30px);
}

.slide-up-leave-to {
   opacity: 0;
   transform: translateY(-30px);
}
</style>

<style scoped>
button {
   display: inline-grid;
}

button svg {
   grid-area: 1 / 1 / 2 / 2;
   /* transform: translateY(-.08em); */

}
</style>