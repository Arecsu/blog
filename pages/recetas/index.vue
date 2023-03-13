<template>
  <div class="recipes-list-container">
    <NuxtLink v-for="{ _path: slug, title } in blogPosts" :key="slug" :to="slug">
      <span>{{ title }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// data is the destructuring and blogPosts the name of the new variable
// same as `const blogPosts = ...find()).data`
const { data: blogPosts } = await useAsyncData('recetas', () => {
  return queryContent('recetas').where({ draft: { $ne: true } }).sort({ title: 1 }).find()
})


/*
const data2 = await queryContent('recetas').find()
console.log(data2)

// https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
const data22 = Array.from(new Set(data2.map((item: any) => item.category)))

// group array of objects by values in a key
function groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
};

const uniqueValues = groupBy(data2, 'category');
console.log(uniqueValues)
*/

// query by category
const { data: asd } = await useAsyncData('recetasDulces', () => {
  return queryContent('recetas').where({ category: 'dulce' }).find()
})
</script>

<style scoped>
a {
  text-decoration: none;
  padding-bottom: 0.1em;
  font-weight: 400;
  text-transform: lowercase;
  box-sizing: border-box;
}

a {
  background:
    var(--color-underline-link),
    var(--color-underline-link-hover);
  background-size: 100% 3px, 0 3px;
  background-position: 100% 100%, 0 100%;
  background-repeat: no-repeat;
  transition: background-size 400ms;
}

a:hover {
  background-size: 0 3px, 100% 3px;
}

.recipes-list-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: 1.3em;
  align-items: flex-start;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.5em;
}
</style>