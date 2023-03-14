<template>
  <div class="recipe-layout">
    <RecipeSidebar :icon="recipe.icon" :title="recipe.title" />
    <div class="recipe-container">
      <span class="recipe-title" ref="recipeTitle">
        <Icon class="recipe-icon-title" v-if="recipe.icon" :name="recipe.icon" />{{ recipe.title }}
      </span>
      <RecipeRender />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

useContentHead({
  head: {
    titleTemplate: (title) => `${title.toLowerCase()} · a9r`,
  }
})

const recipe = await queryContent('recetas').where({ _path: route.path }).findOne()
</script>

<style scoped>
.recipe-layout {
  display: flex;
  flex-direction: row;
}

.recipe-layout,
.recipe-container {
  width: 100%;
}

:deep(.recipe-sidebar-title),
.recipe-title {
  font-family: var(--font-headings-1);
  /* letter-spacing: -.06em; */
  /* text-transform: lowercase; */

}

.recipe-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.recipe-icon-title {
  margin-right: .15em;
  margin-left: -.02em;
  font-size: .9em;
  transform: translateY(-.10em);
}

.recipe-title {
  font-size: clamp(4em, 3em + 4vw, 8em);
  margin-bottom: .3em;
  font-weight: 500;
  /* font-weight: 600; */
  letter-spacing: -.05em;
  line-height: 1em;
  display: inline-block;
}
</style>