<template>
   <div>
   </div>
</template>

<script setup>

const r = document.querySelector(':root')

const update = (event) => {
   const xMousePercent = parseFloat(event.pageX / window.innerWidth * 100);
   r.style.setProperty('--mouse-x', xMousePercent + '%')
}
onMounted(() => {
   window.addEventListener('mousemove', update)
})

</script>

<style scoped>
div {
   background: radial-gradient(circle at var(--mouse-x, 50%) 350%, rgba(255, 102, 0, 0.8) 0%, rgba(255, 0, 0, 0) 75%);

}
</style>