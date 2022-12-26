<template>
  <div class="article-container">
    <div class="recipe-sidebar">
      <span>{{ recipe.title }}</span>
    </div>
    <ContentDoc class="recipe" tag="article" />
  </div>
</template>

<script setup>
const route = useRoute()

console.log(route.path)

const recipe = await queryContent('recetas').where({ _path: route.path }).findOne()

</script>

<style scoped>
.article-container {
  display: flex;
  flex-direction: row;
}

.recipe-sidebar {
  display: flex;
  writing-mode: vertical-lr;
  border-right: dashed;
  width: 4rem;
  
  position: sticky;
  top: calc(clamp(3em, 1.5em + 2vw, 4em));
  height: calc(100vh - clamp(3em, 1.5em + 2vw, 4em) - 2rem);

  text-transform: lowercase;
  font-family: "Noto Serif Display", serif;
  font-weight: 600;
  font-size: 2em;
  align-items: flex-start;
  place-content: flex-end;
}

.recipe-sidebar span {
  transform: scale(-1);
  line-height: 0.6em;
}

</style>

<style>
.recipe {
  padding-left: 3em;
}

h1, h2, h3, h4 {
  font-family: "Noto Serif Display", serif;
  font-weight: 600;
}

h1 {
  font-size: 4em;
  letter-spacing: -0.03em;
  /* text-transform: uppercase; */
}

p {
  margin-block: 1em;
}

article {
  max-width: 40em;
}
</style>
