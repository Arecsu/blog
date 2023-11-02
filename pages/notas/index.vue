<template>
  <div class="notas-index-container">
    <p class="under-construction"><ESFlat e="🚧" /> EN CONSTRUCCIÓN <br /></p>
    <p>Por mientras, tengo esta <NuxtLink to="/notas/links">colección de links</NuxtLink></p>
    <!-- <ul class="ul-1">
      <li v-for="{ _path, title } in notas" :key="_path">
        <NuxtLink :to="_path">
          {{ title }}
        </NuxtLink>
      </li>
    </ul> -->
  </div>
</template>

<script setup>
useHead({
  title: "notas",
})

const { data: notas } = await useAsyncData("notas", () => {
  return queryContent("notas")
    .where({ draft: { $ne: true } })
    .sort({ title: 1 })
    .only(["_path", "title"])
    .find()
})
</script>

<style>
.under-construction {
  margin: 0;
  margin-bottom: 1.6em;
}

.notas-index-container {
  display: flex;
  flex-direction: column;
  font-size: 1em;
  align-items: flex-start;
}
</style>

<style scoped lang="scss">
// a {
//   text-decoration: none;
//   padding-bottom: 0.1em;
//   font-weight: 400;
//   box-sizing: border-box;
// }
</style>
