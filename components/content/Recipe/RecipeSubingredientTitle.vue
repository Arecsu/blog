<template>
  <h5 class="recipe-subingredient-title">
    <ContentSlot :use="$slots.default" unwrap="p" />
  </h5>
</template>

<style>
h5.recipe-subingredient-title {
   margin-block: 0 .4em;
   color: var(--color-subingredient-name);
   /* font-style: italic; */
   /* text-transform: lowercase; */
}
</style>