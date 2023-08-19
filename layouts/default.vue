<template>
  <div class="global-container">
    <div class="the-page">
      <Header />
      <NoScript>
        <style>
          main {
            display: block !important;
          }
          .header-container {
            display: grid !important;
          }
          .dark-mode-button {
            display: none !important;
          }
        </style>
      </NoScript>
      <Transition name="show-full-page">
        <main v-show="display">
          <slot />
        </main>
      </Transition>
    </div>

    <!-- <div class="noise-background"></div> -->
    <!-- <div class="dotted-background"></div> -->
    <!-- <div class="radial-background"></div> -->
  </div>
</template>

<script setup>
/* 
   this hacky workaround ensures that we don't 
   get dark mode icon to flash because nuxt hasn't
   run yet to populate the reactive values while the
   rest of the HTML document has finished rendering.
   
   This way, onMounted() is called together with all
   the reactive values needed to properly display
   everything at the same time.

   This also solves some jump of content in the ingredients
   in the recipes!
*/
const display = ref(false)
onMounted(() => {
  display.value = true
})
</script>

<style>
.show-full-page-enter-active,
.show-full-page-leave-active {
  transition: opacity 0.35s, transform 0.35s;
  transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}

.show-full-page-enter-from,
.show-full-page-leave-to {
  opacity: 0;
  transform: translateY(-.8rem) scale(0.995);
}

.global-container {
  display: grid;
  height: 100vh;
  /* overflow: hidden; */
}

.the-page {
  /* padding-inline: clamp(1em, 0.5em + 2vw, 2.5em); */
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1 / 2 / 2;
  /* overflow: auto; */
  /* overflow-x: hidden; */
}

.noise-background,
.radial-background {
  grid-area: 1 / 1 / 2 / 2;
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.noise-background {
  background-image: url("/nnnoise.svg");
  mix-blend-mode: plus-lighter;
  background-repeat: repeat;
  opacity: var(--bg-noise-background-opacity);
}

html[theme="dark"] .radial-background {
  mix-blend-mode: plus-lighter;
}

html[theme="light"] .radial-background {
  mix-blend-mode: darken;
}

.radial-background {
  background: var(--bg-radial-gradient);
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
}

main {
  padding-block: var(--padding-block-main);
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  padding-inline: var(--padding-inline-main);
}
</style>
