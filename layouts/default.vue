<template>
	<main>
		<Header />
		<Nuxt />
		<!-- <Footer1 /> -->
	</main>
</template>

<script>
export default {
	transition: 'default',
};
</script>

<style lang="scss">
.emoji {
	height: 1em;
}

main {
	margin-inline: clamp(1rem, 5vw, 4rem);
	margin-block: 2rem;
}
</style>
