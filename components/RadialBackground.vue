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
</style>