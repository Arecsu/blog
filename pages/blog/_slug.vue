<template>
   <article class="post-content">
      <h1>{{ article.title }}</h1>
      <nuxt-content :document="article" />
      <!-- <p>Post last updated: {{ formatDate(article.updatedAt) }}</p> -->
      <!-- <p>Post last updated: {{ $dayjs(article.updatedAt).fromNow() }}</p> -->
   </article>
</template>

<script>
export default {
   async asyncData({ $content, params }) {
      const article = await $content('articles', params.slug).fetch();

      return { article };
   },

   methods: {
      formatDate(date) {
         const options = { year: 'numeric', month: 'long', day: 'numeric' };
         return new Date(date).toLocaleDateString('en', options);
      },
   },

   head() {
      return {
         titleTemplate: this.article.title + ' // %s',
         // title: this.article.title,
      };
   },
};
</script>

<style lang="sass">
article img
   border-radius: 0.4em
   width: 100%
</style>
