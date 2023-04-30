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
               <DarkModeButton class="dark-mode-button"/>
            <span class="header-arrow">↙</span>
         </div>
      </header>
   </div>
</template>


<style scoped>
.header-container {
   display: grid;
	background-color: var(--color-header-bg);
      backdrop-filter: blur(14px);
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
   height: var(--header-height);
   font-weight: 400;
   /* border-bottom: dashed; */
   border-bottom: var(--header-border-bottom, none);
   padding-inline: var(--padding-inline-header, 0);
   margin-inline: var(--margin-inline-header, 0);
}

nav ul {
   display: flex;
   list-style-type: none;
   gap: 1.5em;
   align-items: center;
   padding: 0;
   transform: translateY(.1em)
}

a {
   text-decoration: none;
}

a.router-link-active {
   /* text-decoration: underline; */
}

.dark-mode-button {
   margin-right: 1rem;
}

.header-arrow {
   font-weight: 700;
   font-size: 1.3em;
   transform: translateY(-.04em)
}
</style>