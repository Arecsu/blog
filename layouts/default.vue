<template>
   <div class="global-container">
      <div class="the-page">
         <Header />
         <main>
            <slot />
         </main>
      </div>
         <div class="noise-background"></div>
         <div class="radial-background"></div>
   </div>
</template>

<script setup>

const r = window.document.querySelector(':root')

const update = (event) => {
   const xMousePercent = parseFloat(event.pageX / window.innerWidth * 100);
   r.style.setProperty('--mouse-x', xMousePercent + '%')
}
onMounted(() => {
   window.addEventListener('mousemove', update)
})

</script>

<style>
.global-container {
   display: grid;
   height: 100vh;
   /* overflow: hidden; */
}

.the-page {
   /* padding-inline: clamp(1em, 0.5em + 2vw, 2.5em); */
   display: flex;
   flex-direction: column;
   grid-area: 1 / 1 / 2 / 2;
   /* overflow: auto; */
   /* overflow-x: hidden; */

}
.noise-background,
.radial-background {
   grid-area: 1 / 1 / 2 / 2;
   z-index: -1;
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
}

.noise-background {
   background-image: url('/nnnoise.svg');
   mix-blend-mode: plus-lighter;
   background-repeat: repeat;
   opacity: var(--bg-noise-background-opacity);
}

.radial-background {
	background: var(--bg-radial-gradient);
	background-size: 100vw 100vh;
	background-repeat: no-repeat;
}

main {
   padding-block: var(--padding-block-main);
   flex-grow: 1;
   flex-shrink: 0;
   display: flex;
   padding-inline: var(--padding-inline-main);

}
</style>