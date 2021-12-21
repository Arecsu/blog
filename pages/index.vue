<template>
   <div>
      <BlogCard
         v-for="article of articles"
         :key="article.slug"
         :article="article"
      />
   </div>
</template>

<script>
export default {
   async asyncData({ $content, params }) {
      const articles = await $content('articles')
         .only(['title', 'description', 'cover', 'slug', 'updatedAt'])
         .sortBy('createdAt', 'asc')
         .fetch();

      return {
         articles,
      };
   },
};
</script>
