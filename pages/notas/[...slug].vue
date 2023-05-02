<template>
	<div class="nota-container">
		<ContentDoc tag="article" />
	</div>
</template>


<style lang="scss">

.nota-container {
	display: flex;
	width: 100%;
	// center content in the middle horizontally
	justify-content: center;
}

.nota-container article {

	width: min(100%, 54rem);

	:first-child {
		margin-top: 0;
	}

	h1,
	h2,
	h3,
	h4,
	h5 {
		margin: 3rem 0 1.38rem;
		letter-spacing: -0.045em;
		/* font-weight: 600; */
		font-weight: 600;
		line-height: 1.3;
	}

	h1 {
		margin-top: 0;
		font-size: 5.653rem;
	}

	h2 {
		font-size: clamp(3rem, 5vw, 3.998rem);
	}

	h3 {
		font-size: 2.827rem;
	}

	h4 {
		font-size: 1.999rem;
	}

	h5 {
		font-size: 1.414rem;
	}

	ul,
	ol {
		padding-left: 0em;
	}

	p {
		margin-block: 1em;
	}

}
</style>

<script setup>
</script>
