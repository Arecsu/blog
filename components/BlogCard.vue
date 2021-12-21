<template>
   <div>
      <NuxtLink
         :to="{ name: 'blog-slug', params: { slug: article.slug } }"
         class="post-card"
      >
         <img
            class="post-card-cover"
            :src="require(`~/assets/covers/${article.cover}`)"
         />
         <span class="post-card-title link-arrow">{{ article.title }}</span>
         <span class="post-card-date">{{
            $dayjs(article.updatedAt).fromNow()
         }}</span>
         <p>{{ article.description }}</p>
      </NuxtLink>
   </div>
</template>

<script>
export default {
   props: ['article'],
};
</script>

<style lang="sass" scoped>

.post-card
   display: flex
   flex-flow: column
   margin-bottom: 2em

   &-cover
      height: 14em
      max-width: 100%
      display: block
      align-self: flex-start
      margin-bottom: 1em

   &-title
      font-size: 2em
      font-weight: 700
      text-decoration: none
      margin-bottom: 0.3em
      letter-spacing: -0.03em

   &-date
      font-size: 0.75em
      text-transform: uppercase

   .link-arrow
      display: block

   &:hover .link-arrow
      transform: translateX(1.1em)

   &:hover .link-arrow:before
      opacity: 1
      transform: translateX(-1.2em)

.page-leave-active .post-card
   transition: .25s ease
   transform: translateX(-1em)
</style>
