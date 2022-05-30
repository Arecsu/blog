<template>
	<header>
		<nav>
			<span>//</span>
			<NuxtLink to="/recetas">recetas</NuxtLink>
			<NuxtLink to="/blog">blog</NuxtLink>
			<a href="https://alejandro9r.xyz/">hola!</a>
		</nav>
	</header>
</template>

<style scoped>
nav {
	margin-bottom: 1.2rem;
	display: flex;
	gap: calc(2rem - clamp(0.8rem, 2vw, 1rem));
}
nav a {
	color: white;
}
</style>
