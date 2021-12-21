<template>
   <article class="post-content">
      <h1>{{ recipe.title }}</h1>
      <img :src="require(`~/content/recipes-covers/${recipe.cover}`)" alt="" />
      <nuxt-content :document="recipe" />
      <!-- <p>Post last updated: {{ formatDate(article.updatedAt) }}</p> -->
      <!-- <p>Post last updated: {{ $dayjs(recipe.updatedAt).fromNow() }}</p> -->
   </article>
</template>

<script>
export default {
   async asyncData({ $content, params }) {
      const recipe = await $content('recipes', params.slug).fetch();

      return { recipe };
   },

   methods: {
      formatDate(date) {
         const options = { year: 'numeric', month: 'long', day: 'numeric' };
         return new Date(date).toLocaleDateString('en', options);
      },
   },

   head() {
      return {
         titleTemplate: this.recipe.title + ' // %s',
         // title: this.recipe.title,
      };
   },
};
</script>

<style lang="sass">
article img
   border-radius: 0.4em
   width: 100%
</style>
