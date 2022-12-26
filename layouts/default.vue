<template>
   <div class="container">
      <div class="sub-container">

         <Header />
         <main>
            <slot />
         </main>
      </div>
      <ClientOnly>
         <RadialBackground class="radial-background" />
      </ClientOnly>
   </div>
</template>

<script setup>


</script>

<style scoped>
.container {
   display: grid;
   height: 100vh;
   overflow: hidden;
}

.sub-container {
   padding-inline: clamp(1em, 0.5em + 2vw, 2.5em);
   display: flex;
   flex-direction: column;
   grid-area: 1 / 1 / 2 / 2;
   overflow: auto;
   overflow-x: hidden;

}

.radial-background {
   grid-area: 1 / 1 / 2 / 2;
   z-index: -1;
}

main {
   padding-block: 1.5em;
   flex-grow: 1;
   flex-shrink: 0;
   display: flex;

}
</style>