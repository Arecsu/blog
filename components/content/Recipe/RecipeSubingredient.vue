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
:deep(ul) {
   list-style: none;
   padding: 0;
}

:deep(li) {
   margin-bottom: .7em;
}

:deep(li:before) {
   content: '- ';
   opacity: .7;
}

:deep(code) {
   /* background: red; */
   font-family: inherit;
   background-color: var(--color-bg-quantity-subingredient);
   font-weight: 500;
   padding: .20em .35em;
   font-size: .88em;
   border-radius: .2em;
}
</style>