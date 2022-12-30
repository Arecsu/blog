<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// You might choose this based on an API call or logged-in status
const layout = "default";

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.20s;
  transition-timing-function: ease-out; 
  /* transition-timing-function: cubic-bezier(.54, 1.2, .38, 1.11); */
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.page-enter-from {
  transform: translateX(20px);
}
.page-leave-to {
  transform: translateX(-30px);
  transition-timing-function: ease-in;
}
</style>
