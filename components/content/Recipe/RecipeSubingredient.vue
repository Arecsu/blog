<template>
  <div class="subingredient">
    <h5 class="recipe-subingredient-title" v-if="name">{{ name }}</h5>
    <h5 class="recipe-subingredient-title" v-else-if="$slots.title">
      <ContentSlot :use="$slots.title" unwrap="p" />
    </h5>
    <ContentSlot :use="$slots.default" />
  </div>
</template>

<script setup>
defineProps(["name"])
</script>

<style scoped>
h5.recipe-subingredient-title {
  margin-block: 0 0.4em;
  color: var(--color-subingredient-name);
  /* font-style: italic; */
  /* text-transform: lowercase; */
}

.subingredient {
  break-inside: avoid;
  margin-bottom: 2rem;
}
</style>