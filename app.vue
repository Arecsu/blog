<template>
  <NuxtLayout name="default">
    <NuxtLoadingIndicator color="var(--color-text)" :height="2" :throttle="200" />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Pre-cache font files and embedded them in the head.
// We import them to know the exact compiled path of the font files.
import notoserif400 from "@fontsource/noto-serif/files/noto-serif-latin-400-normal.woff2?url"
// import interItalic from "./assets/font-inter/Inter-roman.var.woff2?url"
// import interRoman from "./assets/font-inter/Inter-italic.var.woff2?url"
import inter from "./assets/font-inter/Inter.var.woff2?url"

import headThemeSwitch from './scripts/headThemeSwitch.js?raw'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} · a9r` : "a9r"
  },
  script: [{ children: headThemeSwitch }],
  link: [
    /* crossorigin is mandatory to enable proper cache-control by cloudflare and probably every
       other CDN / server provider. Otherwise, it will request not only the font from this header,
       but also from the CSS @font-face of each font.
       */
    { rel: "preload", as: "font", href: notoserif400, type: "font/woff2", crossorigin: "anonymous", key: 'noto-serif-400' },
    // { rel: "preload", as: "font", href: interRoman, type: "font/woff2", crossorigin: "anonymous", key: 'inter-var-roman' },
    // { rel: "preload", as: "font", href: interItalic, type: "font/woff2", crossorigin: "anonymous", key: 'inter-var-italic' },
    { rel: "preload", as: "font", href: inter, type: "font/woff2", crossorigin: "anonymous", key: 'inter-var-experimental' },
  ],
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
  transition-timing-function: ease-out;
  /* transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1); */
  /* transition-timing-function: cubic-bezier(.54, 1.2, .38, 1.11); */
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.page-enter-from {
  transform: translateX(0.5rem);
}
.page-leave-to {
  transform: translateX(-1rem);
  transition-timing-function: ease-in;
}
</style>
