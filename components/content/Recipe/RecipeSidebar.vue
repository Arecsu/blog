<template>
   <div class="recipe-sidebar">
      <div v-if="icon && false" class="recipe-icon-sidebar">
         <Icon :name="icon" />
      </div>
      <span class="recipe-sidebar-title">{{ title }}</span>
   </div>
</template>

<script setup>
const props = defineProps({
   icon: String,
   title: String,
})
</script>

<style scoped>
.recipe-sidebar {
   display: flex;
   writing-mode: vertical-lr;
   border-right: var(--sidebar-recipe-border);
   font-size: clamp(1.3em, 0.5em + 1vw, 1.6em);
   width: 3.5em;
   color: var(--color-subingredient-name);

   margin-left: calc(var(--padding-inline-main) * -1);
   position: sticky;
   top: calc(var(--header-height) + var(--padding-block-main) + var(--border-size-1));
   height: calc(100vh - var(--header-height) - var(--border-size-1) - (var(--padding-block-main) * 2));

   align-items: center;
   /* justify-content: space-between; */
   justify-content: flex-end;
   text-transform: lowercase;

   flex-shrink: 0;
   /* flex-grow: 1; */
   margin-right: 3rem;
}

@media (max-width: 50rem) {
   .recipe-sidebar {
      display: none;
   }
}

.recipe-icon-sidebar {
   transition: opacity .5s ease;
   opacity: 0;
}

.recipe-sidebar-title {
   transform: scale(-1) translateX(.1em);
   line-height: 0.6em;
   /* font-size: clamp(1.3em, 0.5em + 1vw, 1.6em); */
}
</style>