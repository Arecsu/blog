<template>
  <div class="header-container">
    <!-- <div class="noise-background"></div> -->
    <!-- <div class="radial-background"></div> -->
    <header
      @mouseenter="mouseOverHeaderDesktop"
      @mouseleave="resetScrollConditionForTitleDesktop"
      @touchend="resetScrollConditionForTitleMobile"
    >
      <nav >
        <Transition name="header-title">
          <span v-if="showHeaderTitle && headerTitle">→ {{ headerTitle }}</span>
          <ul v-else @click.stop="">
            <!-- <li class="lines">//----</li> -->
            <li>
              <NuxtLink to="/"><span style="font-style: italic">/--</span>base</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/notas">notas</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/recetas">recetas</NuxtLink>
            </li>
            <!-- <li> -->
            <!-- <NuxtLink to="https://alejandro9r.xyz" target="_blank">_hola!</NuxtLink> -->
            <!-- </li> -->
          </ul>
        </Transition>
      </nav>
      <Transition name="header-right-on-title">
        <div class="header-right-side" v-if="!showHeaderTitle || !headerTitle">
          <!-- <Weather /> -->
          <!-- <ClientOnly> -->
          <HeaderThemeSwitch class="dark-mode-button" />
          <!-- </ClientOnly> -->
          <span class="header-arrow">↙</span>
        </div>
      </Transition>
    </header>
  </div>
</template>

<script setup>
let ShowingHeaderMenu_lastYPos = 0
let ScrollDownLastPosition = 0
let PagePositionBeforeScrolling = 0
let isRouteChanging = false
let isTouchscreenOnly = false

const headerTitle = useHeaderTitle()

// const showHeaderTitle = ref(false)
const mouseOverHeader = ref(false)
const scrollConditionForTitle = ref(false)

const route = useRoute()
const routePath = computed(() => route.path)

const mouseOverHeaderDesktop = () => {
  if (isTouchscreenOnly) return
  mouseOverHeader.value = true
}

const resetScrollConditionForTitle = () => {
  scrollConditionForTitle.value = false
  if (process.client) {
    ShowingHeaderMenu_lastYPos = window.scrollY
    ScrollDownLastPosition = window.scrollY
  }
  mouseOverHeader.value = false
}

const resetScrollConditionForTitleMobile = () => {
  setTimeout(() => {
    mouseOverHeader.value = true
    resetScrollConditionForTitle()
  }, 50)
}

const resetScrollConditionForTitleDesktop = () => {
  if (isTouchscreenOnly) return
  resetScrollConditionForTitle()
}



const showHeaderTitle = computed(() => {
  if (mouseOverHeader.value === false && scrollConditionForTitle.value === true) {
    return true
  }
  return false
})

onMounted(() => {
  if(window.matchMedia("(pointer: coarse)").matches) isTouchscreenOnly = true
  watch(routePath, (value) => (isRouteChanging = true), { deep: true, immediate: true })

  ShowingHeaderMenu_lastYPos = window.scrollY
  ScrollDownLastPosition = window.scrollY
  PagePositionBeforeScrolling = window.scrollY

  window.addEventListener("scroll", () => {
    if (isRouteChanging) {
      ShowingHeaderMenu_lastYPos = window.scrollY
      ScrollDownLastPosition = window.scrollY
      PagePositionBeforeScrolling = window.scrollY
      isRouteChanging = false
      return
    }
    if (window.scrollY > ShowingHeaderMenu_lastYPos + 200 && scrollConditionForTitle.value === false) {
      // we are indeed scrolling down
      // showHeader when we are scrolling down + 400px
      scrollConditionForTitle.value = true
    }

    if (window.scrollY > PagePositionBeforeScrolling) {
      ScrollDownLastPosition = window.scrollY
    } else if (window.scrollY + 60 < ScrollDownLastPosition || window.scrollY < 300) {
      // we are scrolling up +60px! (or within the first 300px of the page)
      // header menu should be visible and save the position
      scrollConditionForTitle.value = false
      ShowingHeaderMenu_lastYPos = window.scrollY
    }

    PagePositionBeforeScrolling = window.scrollY
  })
})
</script>

<style scoped lang="scss">
@keyframes headerAppear {
  0% {
    opacity: 0;
    transform: translateY(calc(var(--header-height) * -1));
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes headerDelay {
  from {
    opacity: 0;
    transform: translateY(calc(var(--header-height) * -1));
  }
  to {
    opacity: 0;
    transform: translateY(calc(var(--header-height) * -1));
  }
}
/*
.header-container {
  $header-animation-delay: 1s;
  animation: 1s ease-out 0s 1 headerDelay,
    0.8s cubic-bezier(0.16, 1, 0.3, 1) $header-animation-delay 1 headerAppear;
}
*/

/*
animation-duration: 1s; // the duration of the animation 
animation-timing-function: ease-out; // how the animation will behave
animation-delay: 0s; // how long to delay the animation from starting
animation-iteration-count: 1;//  how many times the animation will play
animation-name: slideInFromLeft; // the name of the animation we defined above
*/

.header-container {
  display: grid;
  /* background-color: var(--color-header-bg); */
  background-color: var(--color-bg-0);
  /* backdrop-filter: blur(14px); */
  position: sticky;
  top: 0;
  z-index: 1;
}

.header-container .noise-background,
.header-container .radial-background,
header {
  grid-area: 1 / 1 / 2 / 2;
}

.header-right-side {
  display: flex;
  align-items: center;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  height: var(--header-height);
  font-weight: 400;
  /* border-bottom: dashed; */
  border-bottom: var(--header-border-bottom, none);
  padding-inline: var(--padding-inline-header, 0);
  margin-inline: var(--margin-inline-header, 0);
}

nav {
  display: inline-grid;
}

nav > * {
  grid-area: 1 / 1 / 2 / 2;
}

nav {
  ul {
    display: flex;
    list-style-type: none;
    gap: 1.5em;
    align-items: center;
    padding: 0;
    //transform: translateY(0.1em);
    font-size: 0.9em;
    margin-bottom: 0.05em;
    margin-top: 0.1em;
  }

  .lines {
    font-size: 0.85em;
    margin-bottom: -0.1.2em;
    font-weight: 600;
    vertical-align: baseline;
    font-style: italic;
    letter-spacing: 0.05em;
    user-select: none;
  }
}

a {
  text-decoration: none;
}

a.router-link-active {
  /* text-decoration: underline; */
}

.dark-mode-button {
  margin-right: 0.9rem;
}

.header-arrow {
  font-weight: 400;
  font-size: 1.3em;
  transform: translateY(-0.04em);
}
</style>

<style>
.header-title-enter-active,
.header-title-leave-active,
.header-right-on-title-enter-active,
.header-right-on-title-leave-active {
  transition: opacity 0.15s, transform 0.2s;
  transition-timing-function: ease;
}

.header-title-enter-from {
  opacity: 0;
  transform: translateY(1em);
}

.header-title-leave-to {
  opacity: 0;
  transform: translateY(-1em);
}

/* .header-right-on-title-enter-active,
.header-right-on-title-leave-active {
  transition: opacity 0.2s, transform 0.2s;
  transition-timing-function: ease;
}

.header-right-on-title-leave-active {
  transition-delay: .2s;
} */

.header-right-on-title-enter-from {
  opacity: 0;
  transform: translateY(0.5em);
}

.header-right-on-title-leave-to {
  opacity: 0;
  transform: translateY(-0.5em);
}
</style>
