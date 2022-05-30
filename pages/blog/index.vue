<template>
	<div>
		<ul>
			<li v-for="article in articles" :key="article.slug">
				<NuxtLink v-if="article.titleAlt" :to="article.path">
					{{ article.titleAlt }}
				</NuxtLink>
				<NuxtLink v-else :to="article.path">
					{{ article.title }}
				</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	async asyncData({ $content, params }) {
		const articles = await $content('blog').sortBy('title', 'asc').fetch();

		return {
			articles,
		};
	},
	head() {
		return {
			titleTemplate: 'blog // %s',
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
