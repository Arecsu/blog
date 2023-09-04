<template>
  <button v-if="!useColorLoaded" class="button-no-style">
    <div class="colormode-placeholder-dark">
      <Icon name="tabler:ghost-filled" size="1.2em" />
    </div>
    <div class="colormode-placeholder-light">
      <Icon name="ic:outline-lightbulb" size="1.1em" />
    </div>
  </button>
  <button
    v-else
    v-tippy="{ content: `${themeState.tooltip}`, placement: 'bottom-end', delay: [50, 150] }"
    class="button-no-style"
    @click="cycleThemeNext()"
  >
    <Transition name="slide-up">
      <div v-if="themeState.icon === 'dark'">
        <Icon name="tabler:ghost-filled" size="1.2em" />
      </div>
      <div v-else-if="themeState.icon === 'light'">
        <Icon name="ic:outline-lightbulb" size="1.1em" />
      </div>
    </Transition>
  </button>
</template>

<script setup>
// useCycleList has { state, next, prev }
// const { state, next } = useCycleList(['dark', 'light', 'cafe', 'contrast', 'auto'], { initialValue: mode })
// connecting this to https://color-mode.nuxtjs.org/
const colorMode = useColorMode()
// ↓ this thing prevents SSR problems and icon uncertainty during initial client load
const useColorLoaded = ref(false)

const themeState = computed(() => {
  switch (colorMode.preference) {
    case "light":
      return { tooltip: "vitamina D 🏖️", icon: "light" }
    case "dark":
      return { tooltip: "oscuro 🦉", icon: "dark" }
  }
  // case 'system':
  return { tooltip: "igual que el sistema 💿", icon: colorMode.value /* could be 'light' or 'dark' */ }
})

const { state: cycleThemeState, next: cycleThemeNext } = useCycleList(["dark", "light", "system"], {
  // colorMode.preference:  Actual color-mode selected (can be 'system'), update it to change the user preferred color mode
  // colorMode.value:       Useful to know what color mode has been detected when $colorMode === 'system', you should not update it
  // initialValue: colorMode.value,
})

onMounted(() => {
  cycleThemeState.value = colorMode.value
  watchEffect(() => (colorMode.preference = cycleThemeState.value))
  useColorLoaded.value = true
})
</script>

<style>
.colormode-placeholder-dark,
.colormode-placeholder-light {
  display: none;
}

html.theme-dark .colormode-placeholder-dark {
  display: block;
}

html.theme-light .colormode-placeholder-light {
  display: block;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.7s, transform 0.7s;
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

button > div {
  grid-area: 1 / 1 / 2 / 2;
  margin-top: 0.1em;
}
</style>
