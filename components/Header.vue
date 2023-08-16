<template>
  <div class="header-container" :class="display ? 'header-show' : 'header-hide'">
    <div class="noise-background"></div>
    <!-- <div class="radial-background"></div> -->
    <header>
      <nav>
        <ul>
          <li class="lines">//----</li>
          <li>
            <NuxtLink to="/notas">notas</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/recetas">recetas</NuxtLink>
          </li>
          <li>
            <NuxtLink to="https://alejandro9r.xyz" target="_blank">_hola!</NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="header-right-side">
          <HeaderThemeSwitch class="dark-mode-button" />
        <span class="header-arrow">↙</span>
      </div>
    </header>
  </div> 
</template>

<script setup>
const display = ref(false)
onMounted(() => {
  display.value = true
})
</script>

<style scoped lang="scss">
.header-hide {
  transform: translateY(calc(var(--header-height) * -1));
  opacity: 0;
}

.header-container {
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.5s cubic-bezier(0.65, 0, 0.35, 1);
  transition-delay: 0s;
  display: grid;
  background-color: var(--color-header-bg);
  backdrop-filter: blur(14px);
  position: sticky;
  top: 0;
  z-index: 1;
}

.header-container .noise-background,
.header-container .radial-background,
header {
  grid-area: 1 / 1 / 2 / 2;
}

.header-right-side {
  display: flex;
  align-items: center;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  height: var(--header-height);
  font-weight: 400;
  /* border-bottom: dashed; */
  border-bottom: var(--header-border-bottom, none);
  padding-inline: var(--padding-inline-header, 0);
  margin-inline: var(--margin-inline-header, 0);
}

nav {
  ul {
    display: flex;
    list-style-type: none;
    gap: 1.5em;
    align-items: center;
    padding: 0;
    transform: translateY(0.1em);
    font-size: 0.9em;
    margin-bottom: 0.05em;
  }

  .lines {
    font-size: 0.85em;
    margin-bottom: -0.1.2em;
    font-weight: 600;
    font-style: italic;
    letter-spacing: 0.05em;
    user-select: none;
  }
}

a {
  text-decoration: none;
}

a.router-link-active {
  /* text-decoration: underline; */
}

.dark-mode-button {
  margin-right: 0.9rem;
}

.header-arrow {
  font-weight: 400;
  font-size: 1.3em;
  transform: translateY(-0.04em);
}
</style>
