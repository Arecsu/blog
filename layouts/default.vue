<template>
	<main>
		<Header />
		<Nuxt id="main-nuxt" />
		<!-- <Footer1 /> -->
		<footer>
			<span>//------------</span>
			<span>+</span>
		</footer>
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
	min-height: calc(100vh - 4rem);
	display: flex;
	flex-flow: column;
}

#main-nuxt {
	flex-grow: 1;
}

footer {
	height: 8rem;
	display: flex;
	align-items: end;
	place-content: space-between;
}
</style>
