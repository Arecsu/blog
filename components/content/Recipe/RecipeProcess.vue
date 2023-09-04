<template>
  <div class="recipe-process">
    <h2 class="recipe-process-title" v-if="process">
      <Icon class="recipe-process-icon" name="fluent-emoji:bowl-with-spoon" /> Proceso
      <!-- 
      <span class="icon-with-text">
        <Icon class="recipe-process-icon" name="fluent-emoji:bowl-with-spoon" /><span>🥣</span>
      </span>
      Proceso
       -->
    </h2>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  process: Boolean,
})
</script>

<style lang="scss">
/*
.icon-with-text {
  // display: inline-flex;
  position: relative;
}
.icon-with-text > span {
  // opacity: 0;
  position: absolute;
  left: 0;
  // top: 0;
  // opacity: 0;
  color: transparent;
  z-index: -1;
}

*::selection {
  background: rgba(96, 193, 234, 0.505);
}
*/
.recipe-process-icon {
  transform: translateY(-0.1em);
}

.recipe-process {
  max-width: 40em;
  grid-area: three;
}

.recipe-process :nth-child(2) {
  margin-top: 0;
}

.recipe-process {
  ul {
    list-style: none;
  }

  ul li {
    text-indent: -0.7em;
  }

  ul li:before {
    content: "- ";
  }

  ul li,
  ol li {
    margin-bottom: 0.8em;
  }
}
</style>
