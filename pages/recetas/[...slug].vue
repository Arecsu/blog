<template>
  <div class="recipe-layout">
    <RecipeSidebar :icon="recipe.icon" :title="recipe.title" />
    <div class="recipe-container">
      <span class="recipe-title" ref="recipeTitle">
        <Icon class="recipe-icon-title" v-if="recipe.icon" :name="recipe.icon" />{{ recipe.title }}
      </span>
      <ContentDoc class="recipe" tag="div" />
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

<style lang="scss">
.recipe-layout {
  display: flex;
  flex-direction: row;
}

.recipe-layout,
.recipe-container {
  width: 100%;
}

.recipe-sidebar-title,
.recipe-title {
  font-family: var(--font-serif);
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


.recipe {

  display: grid;
  grid-template-areas:
    /* "one two" */
    "three two"
    "three two";
  column-gap: 10rem;
  grid-template-columns: auto clamp(20rem, 0rem + 40vw, 56rem);
  align-self: flex-start;
  margin-bottom: 8rem;

  @media (max-width: 90rem) {
    grid-template-areas:
      "one"
      "two"
      "three";
    grid-template-columns: auto;
    row-gap: 2rem;
    align-self: stretch;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 3rem 0 1.38rem;
    font-family: var(--font-serif);
    letter-spacing: -0.03em;
    /* font-weight: 600; */
    font-weight: 400;
    line-height: 1.3;
  }

  h1 {
    margin-top: 0;
    font-size: 5.653rem;
  }

  h2 {
    font-size: clamp(3rem, 5vw, 3.998rem);
  }

  h3 {
    font-size: 2.827rem;
  }

  h4 {
    font-size: 1.999rem;
  }

  h5 {
    font-size: 1.414rem;
  }

  ul,
  ol {
    padding-left: 2em;
  }

  p {
    margin-block: 1em;
  }

  >*> :first-child {
    margin-top: 0;
  }
}
</style>