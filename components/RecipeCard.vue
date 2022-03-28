<template>
   <div>
      <NuxtLink
         :to="{ name: 'recetas-slug', params: { slug: recipe.slug } }"
         class="post-card"
      >
         <img
            class="post-card-cover lazyload"
            :data-src="`/recetas-covers/${recipe.cover.file}`"
            :width="`${recipe.cover.width}`"
            :height="`${recipe.cover.height}`"
         />
         <div class="post-card-info">
            <span class="post-card-title link-arrow">{{ recipe.title }}</span>
            <p>{{ recipe.description }}</p>
         </div>
      </NuxtLink>
   </div>
</template>

<script>
export default {
   props: ['recipe'],
};
</script>

<style lang="sass" scoped>

.post-card
   display: flex
   flex-flow: row
   margin-bottom: 2em
   gap: 1em
   align-items: center

   &-cover
      height: auto
      width: 12em
      display: block
      align-self: flex-start
      border-radius: 4px
      z-index: 1
      object-fit: cover
      margin: auto 0

   &-info
      p
         margin-bottom: 0

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
