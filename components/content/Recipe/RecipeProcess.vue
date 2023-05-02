<template>
   <div class="recipe-process">
      <h2 class="recipe-process-title" v-if="process"><Icon class="recipe-process-icon" name="fluent-emoji:bowl-with-spoon" /> Proceso</h2>
      <slot />
   </div>
</template>

<script setup>
defineProps({
   process: Boolean
})
</script>

<style lang="scss">
.recipe-process-icon {
   transform: translateY(-.1em);
}

.recipe-process {
   max-width: 40em;
   grid-area: three;
}

.recipe-process :nth-child(2){
   margin-top: 0;
}

.recipe-process {
   ul {
      list-style: none;
   }

   ul li {
      text-indent: -0.7em;
   }

   ul li:before {
      content: '- '
   }
   
   ul li,
   ol li {
      margin-bottom: .8em;
   }
}
</style>