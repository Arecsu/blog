<template>
   <a :href="link" target="_blank">{{ name }}</a>
   <span v-if="instagram"> – </span>
   <a v-if="instagram" :href="instagram" target="_blank">
      <Icon name="bi:instagram" size="1em"></Icon>
   </a>
</template>

<script setup>
// props are 'name', 'link', 'instagram'
const props = defineProps({
   name: {
      type: String,
      required: true
   },
   link: {
      type: String,
      required: true
   },
   instagram: {
      type: String,
      required: false
   }
})
</script>

<style scoped>
svg {
   height: 1em;
   margin-bottom: .1em;
}
</style>