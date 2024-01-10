<template>
   <div class="ingredients">
      <h2 class="ingredients-title">
         <Icon name="fluent-emoji:spoon" /> Ingredientes
      </h2>
      <slot name="IngredientsIntro" />
      <div class="subingredients">
         <slot />
      </div>
   </div>
</template>

<style scoped lang="scss">
.ingredients-title {
   svg {
      margin-left: -.1em;
      transform: translateY(-.1em);
   }
}

.ingredients {
   grid-area: two;
   padding-bottom: 1rem;
}

.subingredients {
   width: 100%;
   columns: 16rem auto;
   gap: 2rem;

   @media (max-width: 38rem) {
      columns: unset;
   }

   & :deep(ul) {
      list-style: none;
      padding: 0;
   }

   & :deep(li) {
      margin-bottom: .7em;

      &:before {
         content: '- ';
         opacity: .7;
      }
   }

   & :deep(code) {
      /* background: red; */
      font-family: inherit;
      background-color: var(--color-bg-quantity-subingredient);
      font-weight: 500;
      padding: .20em .35em;
      font-size: .88em;
      border-radius: .2em;
   }
}
</style>