<template>
   <div class="header-container">
      <div class="header-radial-blur"></div>
      <header>
         <nav>
            <ul>
               <li>
                  <NuxtLink to="/notas">notas</NuxtLink>
               </li>
               <li>
                  <NuxtLink to="/recetas">recetas</NuxtLink>
               </li>
               <li>
                  <NuxtLink to="https://alejandro9r.xyz" target="_blank">_hola!</NuxtLink>
               </li>
            </ul>
         </nav>
         <div class="header-right-side">
            <ClientOnly>
               <DarkModeButton class="dark-mode-button"/>
            </ClientOnly>
            <span>↙</span>
         </div>
      </header>
   </div>
</template>


<style scoped>
.header-container {
   display: grid;
	background-color: var(--color-bg-0);
   position: sticky;
   top: 0;
   z-index: 1;
}

.header-radial-blur,
header {
   grid-area: 1 / 1 / 2 / 2;
}

.header-radial-blur {
   /* z-index: 2; */
}

.header-right-side {
   display: flex;
   align-items: center;
}

header {
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   overflow: hidden;
   font-weight: 500;
   /* border-bottom: dashed; */
   border-bottom: var(--header-border-bottom, none);
   padding-inline: var(--padding-inline-header, 0);
   margin-inline: var(--margin-inline-header, 0);
}

nav ul {
   display: flex;
   list-style-type: none;
   gap: 1.5em;
   height: var(--header-height);
   align-items: center;
   padding: 0;
   transform: translateY(.2em)
}

a {
   text-decoration: none;
}

a.router-link-active {
   /* text-decoration: underline; */
}

.dark-mode-button {
   margin-right: 3rem;
}

span {
   font-weight: 700;
}
</style>