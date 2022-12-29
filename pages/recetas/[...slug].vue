<template>
  <div class="recipe-layout">
    <div class="recipe-sidebar">
      <span class="recipe-sidebar-title">{{ recipe.title }}</span>
    </div>
    <div class="recipe-container">
      <span class="recipe-title">{{ recipe.title }}</span>
      <RecipeRender />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const recipe = await queryContent('recetas').where({ _path: route.path }).findOne()
</script>

<style scoped>
.recipe-layout {
  display: flex;
  flex-direction: row;
}

.recipe-sidebar {
  display: flex;
  writing-mode: vertical-lr;
  border-right: var(--sidebar-recipe-border);
  color: var(--color-sidebar);
  border-color: var(--color-sidebar);
  width: auto;
  font-size: clamp(1.3em, 0.5em + 1vw, 1.6em);
  padding-block: 1.5em;

  margin-left: calc(var(--padding-inline-main) * -1);
  position: sticky;
  top: calc(var(--header-height) + var(--padding-block-main) + var(--border-size-1));
  height: calc(100vh - var(--header-height) - var(--border-size-1) - (var(--padding-block-main) * 2));

  text-transform: lowercase;
  align-items: flex-start;
  place-content: flex-end;
  flex-shrink: 0;
  /* flex-grow: 1; */
  margin-right: 3rem;
}

@media (max-width: 50rem) {
  .recipe-sidebar {
    display: none;
  }
}
.recipe-sidebar-title,
.recipe-title {
  font-family: var(--font-headings-1);
  /* letter-spacing: -.06em; */
  /* text-transform: lowercase; */

}

.recipe-sidebar-title {
  transform: scale(-1);
  line-height: 0.6em;
  /* font-size: clamp(1.3em, 0.5em + 1vw, 1.6em); */
}

.recipe-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.recipe-title {
  font-size: clamp(4em, 3em + 4vw, 8em);
  margin-bottom: .3em;
  font-weight: 500;
  /* font-weight: 600; */
  letter-spacing: -.05em;
  line-height: 1em;
}
</style>