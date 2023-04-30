<template>
   <div class="subingredient">
      <h5 v-if="name">{{ name }}</h5>
      <slot />
   </div>
</template>

<script setup>
   defineProps(['name'])
</script>

<style scoped>
h5 {
   margin-block: 0 .4em;
   color: var(--color-subingredient-name);
   font-style: italic;
   /* text-transform: lowercase; */
}

.subingredient {
   break-inside: avoid;
   margin-bottom: 2rem;
}
</style>