<template>
  <div class="recipe-layout">
    <Head>
      <Title>{{ recipe.title.toLowerCase() }}</Title>
    </Head>
    <RecipeSidebar :icon="recipe.icon" :title="recipe.title" />
    <div class="recipe-container">
      <h1 class="recipe-title" :style="{ '--recipe-title-width': titleWidth }">
        <Icon class="recipe-icon-title" v-if="recipe.icon" :name="recipe.icon" />{{ recipe.title }}
      </h1>
      <!-- Render the document already fetched above. <ContentDoc> queried it again in the
           browser, and on a URL with a trailing slash (static hosts redirect to one) that
           missed the prerendered data: the whole recipe re-rendered after load. -->
      <ContentRenderer :value="recipe" class="recipe" tag="div" />
    </div>
  </div>
</template>

<script setup>
import { recipeTitleWidth } from '~/utils/recipe.mjs'
import titleMetrics from '~/utils/recipe-title-metrics.json'

definePageMeta({ key: route => route.path })
const route = useRoute()
const slug = route.params.slug[0]
const dataKey = `recipe-${slug}`

/* 
useContentHead({
  head: {
    titleTemplate: (title) => `${title.toLowerCase()} · a9r`,
  }
}) 
*/

// need to use useAsyncData otherwise it doesn't work at static generation
const { data } = await useAsyncData(dataKey, () => {
  // Content paths have no trailing slash; static hosts add one to /recetas/x/.
  return queryContent("recetas").where({ _path: route.path.replace(/(.)\/$/, '$1') }).findOne()
})

if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Receta no encontrada' })
// While this page transitions out, Nuxt already clears its async data and the route
// points at the next recipe: keep rendering this page's own recipe until it's gone.
const recipe = shallowRef(data.value)
watch(data, value => { if (value) recipe.value = value })
createRecipeViewer(recipe)
// Computed while rendering (on the server too), so the title is sized in the first paint.
const titleWidth = computed(() => recipeTitleWidth(recipe.value.title, Boolean(recipe.value.icon), titleMetrics))
const headerTitle = useHeaderTitle()
onMounted(() => {
  headerTitle.value = recipe.value.title.toLowerCase()
})


onBeforeRouteLeave((to, from) => {
  headerTitle.value = ""
})
// useHeaderTitle().value = recipe.value.title.toLowerCase()

</script>

<style lang="scss">
.recipe-layout {
  --recipe-border: color-mix(in srgb, var(--color-text) 22%, transparent);
  --recipe-muted: color-mix(in srgb, var(--color-text) 72%, var(--color-bg-0));
  display: flex;
  flex-direction: row;
  min-width: 0;

  button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible, a:focus-visible {
    outline: 2px solid var(--color-subingredient-name);
    outline-offset: 3px;
  }
}

.recipe-layout,
.recipe-container {
  width: 100%;
}

.recipe-sidebar-title,
.recipe-title {
  font-family: var(--font-serif);
  /* letter-spacing: -.06em; */
  /* text-transform: lowercase; */
}

.recipe-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  min-width: 0;
  // The title measures itself against this column (cqi units).
  container-type: inline-size;
}

.recipe-icon-title {
  margin-right: .15em;
  margin-left: -.02em;
  font-size: .9em;
  transform: translateY(-.10em);
}

.recipe-title {
  // One line across the column: --recipe-title-width is the title's width in em (set by
  // the server, see recipeTitleWidth), so 100cqi / width fits it exactly. Never larger
  // than the usual size, and never below 2.5rem: a long title on a phone wraps instead,
  // in balanced lines.
  font-size: max(2.5rem, min(clamp(4em, 3em + 4vw, 8em), 100cqi / var(--recipe-title-width, 1)));
  text-wrap: balance;
  margin-bottom: .3em;
  font-weight: 500;
  /* font-weight: 600; */
  letter-spacing: -.05em;
  line-height: 1em;
  display: inline-block;
}


.recipe {

  display: grid;
  grid-template-areas:
    /* "one two" */
    "three two"
    "three two";
  column-gap: 10rem;
  grid-template-columns: auto clamp(20rem, 0rem + 40vw, 56rem);
  align-self: flex-start;
  margin-bottom: 8rem;

  // Keep in sync with the sticky-ingredients query in RecipeIngredients.vue.
  @media (max-width: 90rem) {
    grid-template-areas:
      "one"
      "two"
      "three";
    grid-template-columns: auto;
    row-gap: 2rem;
    align-self: stretch;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: var(--font-serif);
    letter-spacing: -0.03em;
    /* font-weight: 600; */
    font-weight: 400;
    line-height: 1.3;
    word-break: break-word;
  }

  h1 {
    margin-block: 1.2em 0.6em;
    font-size: 5.653rem;
  }

  h2 {
    margin-block: 1em 0.4em;
    font-size: clamp(1.8rem, 7vw, 4rem);

    // Trim the line box to the capitals so controls beside a title center on its letters.
    // Padding gives back what was trimmed (~.29em a side in Noto Serif), so the layout
    // matches browsers without text-box. Margins wouldn't: they collapse and the first
    // child's is zeroed.
    @supports (text-box: trim-both cap alphabetic) {
      text-box: trim-both cap alphabetic;
      padding-block: 0.29em;
    }

    // Emoji stand on the baseline like the letters (nuxt-icon centers them). Fluent emoji
    // leave 2/32 of blank space below the drawing, hence the extra nudge down.
    > .icon { vertical-align: calc(-2em / 32); }
  }

  h3 {
    margin-block: 1.2em 0.5em;
    font-size: clamp(1.6rem, 7vw, 2.8rem);
  }

  h4 {
    margin-block: 2em 0.5em;
    font-size: clamp(1.4rem, 7vw, 2rem);
  }

  h5 {
    margin-block: 2.4em 1em;
    font-size: clamp(1.2rem, 7vw, 1.4rem);
  }

  ul,
  ol {
    padding-left: 2em;
  }

  p {
    margin-block: 1em;
  }

  >*> :first-child {
    margin-top: 0;
  }
}
</style>