<template>
  <div class="global-container">
    <div class="the-page">
      <Transition name="header">
        <!-- <Header v-if="$route.path !== '/'" /> -->
        <Header />
      </Transition>
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
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
/* we will explain what these classes do next! */
.header-enter-active,
.header-leave-active {
  transition: opacity 0.5s ease;
}

.header-enter-from,
.header-leave-to {
  opacity: 0;
}

@keyframes contentAppear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes contentDelay {
  from {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
/*
main {
  $main-animation-delay: .2s;
  animation: $main-animation-delay ease-out 0s 1 contentDelay, 
             1.3s cubic-bezier(0.16, 1, 0.3, 1) $main-animation-delay 1 contentAppear;
}
*/


.global-container {
  display: grid;
  height: 100dvh;
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

.dotted-background,
.noise-background,
.radial-background {
  grid-area: 1 / 1 / 2 / 2;
  z-index: -1;
  /* position: fixed; */
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
