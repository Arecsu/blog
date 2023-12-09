<template>
  <button v-if="!currentColorScheme" class="button-no-style">
    <div class="colormode-placeholder-dark">
      <Icon name="tabler:ghost-filled" size="1.2em" />
    </div>
    <div class="colormode-placeholder-light">
      <Icon name="ic:outline-lightbulb" size="1.1em" />
    </div>
  </button>
  <button v-else
    v-tippy="{ content: `${themeState.tooltip}`, placement: 'bottom-end', delay: [50, 150], allowHTML: true }"
    class="button-no-style" @click="nextColorScheme()">
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
const beachIcon = `<img class="emoji-inline" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23FFB02E' d='M5.01 29.034h21.98c1.66 0 3.01-1.35 3.01-3.01v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6c0 1.67 1.35 3.01 3.01 3.01Z'/%3E%3Cpath fill='%2326EAFC' d='M28 17.034H4a2 2 0 0 0-2 2v2h27.99v-2c0-1.1-.89-2-1.99-2Z'/%3E%3Cpath fill='%237D4533' d='M24.25 6.974 7.12 24.104c-.2.2-.2.52 0 .72.2.2.52.2.72 0l17.13-17.13c.2-.2.2-.52 0-.72-.2-.2-.52-.2-.72 0Z'/%3E%3Cpath fill='%23F8312F' d='M22.82 24.944c.76.76 1.95.82 2.52.08 3.9-5.1 3.49-12.46-1.21-17.16-4.7-4.7-12.08-5.12-17.18-1.22-.74.56-.68 1.75.08 2.51l.76.76 11.18 3.08 3.08 11.18.77.77Z'/%3E%3Cpath fill='%23F4F4F4' d='M22.04 24.174c5.08-5.08 6-12.38 2.06-16.32-3.94-3.94-11.23-3.02-16.31 2.06l14.25 14.26Z'/%3E%3Cpath fill='%23F8312F' d='M18.47 20.594c5.08-5.08 7.6-10.79 5.63-12.75-1.97-1.96-7.67.56-12.75 5.64l7.12 7.11Z'/%3E%3C/svg%3E" alt="🏖️">`
const owlIcon = `<img class="emoji-inline" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%236D4534' d='M26.713 2a4.79 4.79 0 0 1-1.145 3.122A6.124 6.124 0 0 1 27 9.062c0 1.528-.307 2.727-.86 3.666.554 1.314.86 2.757.86 4.272a11 11 0 0 1-5.933 9.766l.12 1.234-5.228.53-5.15-.53.123-1.235A10.999 10.999 0 0 1 5 17c0-1.546.319-3.017.894-4.351-.524-.927-.814-2.102-.814-3.588 0-1.5.543-2.877 1.432-3.939A4.81 4.81 0 0 1 5.366 2h5.649c1.077 0 1.987.357 2.768 1h4.504c.78-.643 1.634-1 2.71-1h5.716Z'/%3E%3Cpath fill='%23FFDEA7' d='M7.84 14.596C9.78 15.74 12.573 16 15.67 16h.74c3.061 0 5.828-.253 7.765-1.366.295.858.455 1.779.455 2.736C24.63 22.064 20.77 28 16 28c-4.77 0-8.63-5.936-8.63-10.63 0-.97.165-1.904.47-2.774Z'/%3E%3Cpath fill='%23FF822D' d='M14.545 13h2.99a1.5 1.5 0 0 0-1.49-1.5c-.827 0-1.5.673-1.5 1.5ZM16 28c1.83 0 3.556-.447 5.074-1.238.47.737.783 1.582.895 2.49.05.41-.29.748-.704.748h-10.53c-.414 0-.755-.337-.704-.748a5.985 5.985 0 0 1 .897-2.488A10.953 10.953 0 0 0 16 28Z'/%3E%3Cpath fill='%231C1C1C' d='M14 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm12 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'/%3E%3Cpath fill='%23FCD53F' d='M13.748 9.514a3.305 3.305 0 1 1-6.61 0 3.305 3.305 0 0 1 6.61 0Zm11.093 0a3.305 3.305 0 1 1-6.61 0 3.305 3.305 0 0 1 6.61 0Z'/%3E%3Cpath fill='%23533566' d='M12.479 9.514a2.035 2.035 0 1 1-4.071 0 2.035 2.035 0 0 1 4.07 0Zm11.093 0a2.035 2.035 0 1 1-4.07 0 2.035 2.035 0 0 1 4.07 0Z'/%3E%3C/svg%3E" alt="🦉">`
const computerIcon = `<img class="emoji-inline" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23635994' d='M30 7.876v18.277A3.845 3.845 0 0 1 26.149 30H5.85A3.845 3.845 0 0 1 2 26.153V5.847A3.845 3.845 0 0 1 5.851 2h18.257c.93 0 1.82.37 2.48 1.02l2.392 2.378c.65.66 1.02 1.548 1.02 2.478Z'/%3E%3Cpath fill='%23E6E6E6' d='M6 18h20v12H6V18Z'/%3E%3Cpath fill='%23F8312F' d='M6 17.5A1.5 1.5 0 0 1 7.5 16h17a1.5 1.5 0 0 1 1.5 1.5V19H6v-1.5Z'/%3E%3Cpath fill='%23321B41' d='M24.116 2A3.53 3.53 0 0 1 26 2.551v8.7c0 .97-.79 1.75-1.75 1.75H7.75A1.747 1.747 0 0 1 6 11.25V2h18.116Z'/%3E%3Cpath fill='%23E6E6E6' d='M22.64 12H12.36c-.75 0-1.36-.61-1.36-1.36V3.27c0-.7.57-1.27 1.27-1.27H24v8.64c0 .75-.61 1.36-1.36 1.36Z'/%3E%3Cpath fill='%23321B41' d='M22.03 11h-2.06a.978.978 0 0 1-.97-.982V3.982c0-.54.436-.982.97-.982h2.06c.534 0 .97.441.97.982v6.046a.976.976 0 0 1-.97.972Z'/%3E%3C/svg%3E" alt="💾">`

// ↓ this thing prevents SSR problems and icon uncertainty during initial client load
const systemColorScheme = ref()
const currentColorScheme = ref()

const themeState = computed(() => {
  switch (currentColorScheme.value) {
    case "light":
      return { tooltip: `vitamina D ${beachIcon}`, icon: "light" }
    case "dark":
      return { tooltip: `oscuro ${owlIcon}`, icon: "dark" }
  }
  // case 'system':
  return { tooltip: `igual que el sistema ${computerIcon}`, icon: systemColorScheme.value /* could be 'light' or 'dark' */ }
})

const colorSchemes = ["dark", "light", "system"]


const nextColorScheme = () => {
  const indexCurrentColorScheme = colorSchemes.indexOf(currentColorScheme.value)
  const indextNextColorScheme = (indexCurrentColorScheme + 1) % colorSchemes.length
  currentColorScheme.value = colorSchemes[indextNextColorScheme]
}

const systemSchemeInit = () => {
  const systemDarkMatchMedia = window.matchMedia("(prefers-color-scheme: dark)")
  systemColorScheme.value = systemDarkMatchMedia.matches ? "dark" : "light"
  // when system color scheme changes, update the systemColorScheme value
  systemDarkMatchMedia.addEventListener("change", e => e.matches ? systemColorScheme.value = "dark" : systemColorScheme.value = "light");
}

const metaThemeColorChange = (theme) => {
  document.querySelector('meta[name="theme-color"]').setAttribute('content',
    theme === 'dark'
      ? '#0e141b'
      : '#fbeec0'
  )
}

const updateThemeDOM = (theme) => {
  document.documentElement.setAttribute('theme', theme)
  metaThemeColorChange(theme)
}

onMounted(() => {
  // initial currentColorSetting. If localstore has value, adopt that. Otherwise, 'system'
  currentColorScheme.value = localStorage.getItem("theme-setting") || 'system'
  // initiate systemColor for 'auto' value and event listener when system changes color scheme
  systemSchemeInit()

  watch(currentColorScheme, () => {
    currentColorScheme.value === 'system' ? updateThemeDOM(systemColorScheme.value) : updateThemeDOM(currentColorScheme.value)
    localStorage.setItem("theme-setting", currentColorScheme.value)
  })

  // watch for system color scheme changes
  watch(systemColorScheme, () => {
    if (currentColorScheme.value === 'system') updateThemeDOM(systemColorScheme.value)
  })
})

</script>

<style>
.colormode-placeholder-dark,
.colormode-placeholder-light {
  display: none;
}

html[theme="dark"] .colormode-placeholder-dark {
  display: block;
}

html[theme="light"] .colormode-placeholder-light {
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

button>div {
  grid-area: 1 / 1 / 2 / 2;
  margin-top: 0.1em;
}
</style>
