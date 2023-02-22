<template>
   <ContentDoc class="recipe" tag="div" />
</template>

<style>
h1,
h2,
h3,
h4,
h5 {
   margin: 3rem 0 1.38rem;
   font-family: var(--font-headings-1);
   letter-spacing: -0.03em;
   /* font-weight: 600; */
   font-weight: 400;
   line-height: 1.3;
}

h1 {
   margin-top: 0;
   font-size: 5.653rem;
}

h2 {
   font-size: clamp(3rem, 5vw, 3.998rem);
}

h3 {
   font-size: 2.827rem;
}

h4 {
   font-size: 1.999rem;
}

h5 {
   font-size: 1.414rem;
}


p {
   margin-block: 1em;
}


.recipe {
   display: grid;
   grid-template-areas:
      "one two"
      "three two";
   column-gap: 10rem;
   grid-template-columns: auto clamp(20rem, 0rem + 40vw, 56rem);
   align-self: flex-start;
}

@media (max-width: 90rem) {
   .recipe {
      grid-template-areas:
         "one"
         "two"
         "three";
      grid-template-columns: auto;
      row-gap: 2rem;
      align-self: stretch;
   }
}

.recipe>*> :first-child {
   margin-top: 0;
}
</style>