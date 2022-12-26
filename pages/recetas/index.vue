<template>
    <ul>
      <li v-for="{ _path: slug, title } in blogPosts" :key="slug">
        <NuxtLink :to="slug">{{ title }}</NuxtLink>
      </li>
    </ul>
</template>

<script setup lang="ts">

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// data is the destructuring and blogPosts the name of the new variable
// same as `const blogPosts = ...find()).data`
const { data: blogPosts } = await useAsyncData('recetas', () => {
  return queryContent('recetas').sort({ title: 1 }).find()
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

ul {
  list-style: none;
  padding: 0;
  font-size: 1.3em;
}
li {
  margin-bottom: 0.5em;
}

</style>