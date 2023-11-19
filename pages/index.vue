<template>
  <div class="base-container">
    <p>hello! <ESColor e="🤗" /> I'm Alejandro</p>
    <p>
      making <a href="https://martyr.shop">martyr⁠—</a>
      <br />
      and working on projects with people all around the globe <ESFlat e="🌎" />
    </p>
    <p>
      I love to create beautiful, blazing fast, and stunning web experiences. Exploring the intersection between software and visual arts <ESColor e="✨" />
    </p>
    <p style="margin: 0">apart from work, I also:</p>
    <ul class="list-type-1">
      <li>like to read and learn new things <ESFlat e="📖" /></li>
      <li>enjoy time with family and friends</li>
      <li>cook (fan of sweet things), and share some recipes <NuxtLink to="/recetas">here</NuxtLink></li>
      <li>do Yoga and train to stay in shape</li>
      <li>
        and music is a huge part <a href="https://www.last.fm/user/Alejandro9R" target="_blank">of my daily life</a>
      </li>
    </ul>
    <p>
      — from Tucumán, Argentina
      <Icon name="twemoji:flag-argentina" style="vertical-align: -0.15em; margin-left: 0.2em" />
    </p>
    <!-- <p> -->
    <!-- <a href="https://www.youtube.com/watch?v=lGMyPamuPjk" target="_blank"><i>don't be a sellout</i></a> -->
    <!-- </p> -->
    <div class="spacer" />
    <div class="text-small text-footer">
    <!-- <div class="text-footer"> -->
      <p style="white-space: pre">
        <a href="https://github.com/Arecsu/" target="_blank">github</a>{{ "  //  "
        }}<a href="https://instagram.com/alejandro9r" target="_blank">instagram</a>
        <br/><a href="mailto:alejandro@martyr.shop">email</a>: alejandro@martyr.shop
      </p>
    </div>
    <!-- 
    <div id="img-wrapper">
      <div class="img-and-background">
        <div class="img-background"></div>
        <img width="1685" height="1080" src="https://alejandro9r.xyz/tami.jpg" />
      </div>

      <div class="img-control">
        <span class="small">↑ TAMI</span>
        <span onclick="killImg()" class="small rip-img-button">↖</span>
      </div>
    </div>
     -->
    <p id="img-text-hidden" class="img-text-c">
      <!-- <a href="https://www.youtube.com/watch?v=ACULtdKEVdY" target="_blank">???</a> -->
    </p>
  </div>
</template>

<script setup>
useHead({
  title: "",
})
</script>

<style lang="scss">
.base-container {
  display: flex;
  flex-direction: column;
  // margin-bottom: 1em;
  max-width: 56ch;
  // margin: 3em;
  margin: 2.2vw 2.5vw 3vw 2.2vw;
  p,
  ul {
    &:not(:last-child) {
      margin: 0;
      margin-bottom: 1.6em;
    }
  }
}

.spacer {
  height: 2em;
}

.list-type-1 {
  list-style-type: circle;
  padding-left: 2em;
  margin: 0;
}

.text-footer {
  margin-top: auto;
}

.text-small {
  font-size: 0.85em;
  a {
    text-underline-offset: 0.12em;
  }
}
</style>
