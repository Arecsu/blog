<template>
  <div class="notas-container">
    <ul>
      <li>
        <NuxtLink v-for="{ _path: slug, title } in notas" :key="slug" :to="slug">
          {{ title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'notas',
})

const { data: notas } = await useAsyncData('notas', () => {
  return queryContent('notas').where({ draft: { $ne: true } }).sort({ title: 1 }).find()
})


</script>

<style scoped lang="scss">
a {
  text-decoration: none;
  padding-bottom: 0.1em;
  font-weight: 400;
  box-sizing: border-box;
}

.notas-container {
  display: flex;
  flex-direction: column;
  font-size: 1em;
  align-items: flex-start;
}

ul {
  list-style: none;
  padding: 0;
  gap: 1em;
}

li {
  margin-bottom: 0.5em;
  
  &:before{
    content: "-";
    margin-right: 0.5em;
  }
}
</style>