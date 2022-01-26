<template>
   <div>
      <RecipeCard
         v-for="recipe of recipes"
         :key="recipe.slug"
         :recipe="recipe"
      />
   </div>
</template>

<script>
export default {
   async asyncData({ $content, params }) {
      const recipes = await $content('recipes')
         .only(['title', 'description', 'cover', 'slug', 'updatedAt'])
         .sortBy('updatedAt', 'desc')
         .fetch();

      return {
         recipes,
      };
   },
   head() {
      return {
         titleTemplate: 'Recetas 🍕 // %s',
         // title: this.recipe.title,
      };
   },
};
</script>
