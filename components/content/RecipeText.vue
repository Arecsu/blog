<template>
   <div class="recipe-text">
      <h2 v-if="process">
         <Icon class="recipe-text-process-icon" name="fluent-emoji:bowl-with-spoon" /> Proceso
      </h2>
      <slot />
   </div>
</template>

<script setup>
defineProps({
   process: Boolean
})
</script>

<style>
.recipe-text-process-icon {
   transform: translateY(-.1em);
}

.recipe-text {
   max-width: 40em;
   grid-area: three;

}
</style>