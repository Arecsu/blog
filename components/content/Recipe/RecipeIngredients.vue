<template>
   <div class="ingredients">
      <h2 class="ingredients-title"><Icon name="fluent-emoji:spoon" /> Ingredientes</h2>
      <slot name="IngredientsIntro" />
      <div class="subingredients">
         <slot />
      </div>
   </div>
</template>

<style scoped>

.ingredients-title svg {
   margin-left: -.1em;
   transform: translateY(-.1em);
}

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
   padding: 0;
}

.subingredients :deep(li) {
   margin-bottom: .7em;
}

.subingredients :deep(li:before) {
   content: '- ';
   opacity: .7;
}

.subingredients :deep(code) {
   /* background: red; */
   font-family: inherit;
   background-color: var(--color-bg-quantity-subingredient);
   font-weight: 500;
   padding: .20em .35em;
   font-size: .88em;
   border-radius: .2em;
}

</style>