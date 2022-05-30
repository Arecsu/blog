<template>
	<div>
		<article>
			<h1 id="article">{{ article.title }}</h1>
			<nuxt-content :document="article" />
		</article>
	</div>
</template>

<script>
export default {
	async asyncData({ $content, error, params }) {
		const article = await $content('blog', params.slug)
			.fetch()
			.catch((err) => {
				error({ statusCode: 404, message: '404' });
			});

		return { article };
	},
	head() {
		return {
			titleTemplate: this.article.title + ' // %s',
			// title: this.recipe.title,
		};
	},
};
</script>

<style lang="scss" scoped>
article {
	max-width: 45rem;
}
</style>
