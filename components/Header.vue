<template>
   <header>
      <nav>
         <ul>
            <li><NuxtLink to="/notas">notas</NuxtLink></li>
            <li><NuxtLink to="/recetas">recetas</NuxtLink></li>
            <li><NuxtLink to="https://alejandro9r.xyz" target="_blank">_hola!</NuxtLink></li>
         </ul>
      </nav>
      <span>↙</span>
   </header>
</template>

<style scoped>

header {
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   font-weight: 500;
   border-bottom: dashed;
   position: sticky;
   top: 0;
}

nav ul {
   display: flex;
   list-style-type: none;
   gap: 1.5em;
   height: clamp(3em, 1.5em + 2vw, 4em);
   align-items: center;
   padding: 0;
}
a {
   text-decoration: none;
}
a.router-link-active {
   text-decoration: underline;
}

span {
   font-weight: 700;
}
</style>