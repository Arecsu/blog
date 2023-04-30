<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// You might choose this based on an API call or logged-in status
const layout = "default";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} · a9r` : 'a9r';
  }
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
  transform: translateX(.5rem);
}
.page-leave-to {
  transform: translateX(-1rem);
  transition-timing-function: ease-in;
}
</style>
