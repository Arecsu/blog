<template>
	<div>
		<ul>
			<li v-for="receta in recetas" :key="receta.slug">
				<NuxtLink v-if="receta.titleAlt" :to="receta.path">
					{{ receta.titleAlt }}
				</NuxtLink>
				<NuxtLink v-else :to="receta.path">
					{{ receta.title }}
				</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	async asyncData({ $content, params }) {
		const recetas = await $content('recetas').sortBy('title', 'asc').fetch();

		return {
			recetas,
		};
	},
	head() {
		return {
			titleTemplate: 'recetas 🍕 // %s',
			// title: this.recipe.title,
		};
	},
};
</script>

<style scoped>
ul li {
	margin-block: calc(2.6em - clamp(2em, 5vw, 2.4em));
}
</style>
