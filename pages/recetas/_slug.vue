<template>
   <article class="post-content">
      <h1>{{ recipe.title }}</h1>
      <img
      	 v-if="!recipe.cover.hide"
         :src="require(`~/content/recetas-covers/${recipe.cover.file}`)"
         :width="`${recipe.cover.width}`"
         :height="`${recipe.cover.height}`"
      />
      <nuxt-content :document="recipe" />
      <!-- <p>Post last updated: {{ formatDate(article.updatedAt) }}</p> -->
      <!-- <p>Post last updated: {{ $dayjs(recipe.updatedAt).fromNow() }}</p> -->
   </article>
</template>

<script>
export default {
   async asyncData({ $content, params }) {
      const recipe = await $content('recetas', params.slug).fetch();

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
   height: auto
   border-radius: 0.4em
   width: 100%
</style>
