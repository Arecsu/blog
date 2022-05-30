<template>
	<div>
		<article>
			<nuxt-content v-if="receta_ingredientes" id="receta-ingr" :document="receta_ingredientes" />
			<nuxt-content v-if="receta_intro" id="receta-intro" :document="receta_intro" />
			<h1 id="receta-title">{{ receta_main.title }}</h1>
			<nuxt-content id="receta-main" :document="receta_main" />
		</article>
	</div>
</template>

<script>
export default {
	async asyncData({ $content, error, params }) {
		const receta_main = await $content('recetas', params.slug)
			.fetch()
			.catch((err) => {
				error({ statusCode: 404, message: '404' });
			});
		const receta_ingredientes = await $content('recetas/ingredientes', params.slug)
			.fetch()
			.catch(() => {
				return null;
			});
		const receta_intro = await $content('recetas/intro', params.slug)
			.fetch()
			.catch(() => {
				return null;
			});

		return { receta_main, receta_ingredientes, receta_intro };
	},
	head() {
		return {
			titleTemplate: this.receta_main.title + ' // %s',
			// title: this.recipe.title,
		};
	},
};
</script>

<style lang="scss" scoped>
article {
	display: grid;
	grid-template-areas:
		'receta-title'
		'receta-intro'
		'receta-ingr'
		'receta-main';
	grid-template-rows: auto;
	//margin-inline: auto;
	grid-template-columns: min(40rem, 100%);
}

#receta-ingr {
	grid-area: receta-ingr;
}

#receta-intro {
	grid-area: receta-intro;
}

#receta-main {
	grid-area: receta-main;
}

#receta-title {
	grid-area: receta-title;
}

@media screen and (min-width: 62rem) {
	article {
		column-gap: 10%;
		display: grid;
		max-width: 74rem;
		grid-template-columns: 1fr 20rem;
		grid-template-areas:
			'receta-title receta-ingr'
			'receta-intro receta-ingr'
			'receta-main receta-ingr';
	}
}
</style>

<style>
[id^='receta-'] > *:first-child,
#receta-title {
	margin-top: 0;
}
</style>
