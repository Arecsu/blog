<template>
   <div class="ingredients">
      <h2>Ingredientes</h2>
      <slot name="intro" />
      <div class="subingredients">
         <slot />
      </div>
   </div>
</template>

<style scoped>
.ingredients {
   grid-area: two;
}

.subingredients {
   width: 100%;
   columns: 16rem auto;
   gap: 2rem;
}

@media (max-width: 38rem) {
   .subingredients {
      columns: unset;
   }
}

.subingredients :deep(ul) {
   list-style: none;
   padding: 0
}

.subingredients :deep(li) {
   margin-bottom: .7em;
}

/*
.subingredient :deep(li:before) {
   content: '- ';
}
*/

.subingredients :deep(code) {
   /* background: red; */
   font-family: inherit;
   background-color: var(--color-bg-quantity-subingredient);
   padding: .15em .3em;
   font-size: .9em;
   border-radius: .2em;
}
</style>