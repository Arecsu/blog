<template>
  <div class="base-container">
    <p>hello! I'm Alejandro</p>
    <p class="text-lowercase">
      Founder of <a href="https://martyr.shop">martyr⁠—</a> and creative at <a href="https://www.monkstudeyo.com/" target="_blank">mönk</a>
    </p>
    <p class="text-lowercase">    Based in argentina. Born in 1994. Exploring the intersection between technology and human interaction.
      <br>
      <br> Amidst the chaos that surrounds us, how does beauty and simplicity come to light?
      <br>
      <br> My work is a lifelong, continuous journey to find the answer.
      <br>
      <br> For authentic people. By authentic people. ←
    </p>
    <!-- <p> -->
    <!-- <a href="https://www.youtube.com/watch?v=lGMyPamuPjk" target="_blank"><i>don't be a sellout</i></a> -->
    <!-- </p> -->
    <div class="spacer" />
    <div class="text-small text-footer">
    <!-- <div class="text-footer"> -->
      <p style="white-space: pre">
        <a href="mailto:alejandro@martyr.shop">email</a>: alejandro@martyr.shop
        <br>
        <a href="https://github.com/Arecsu/" target="_blank">github</a>{{ "  //  "
        }}<a href="https://instagram.com/alejandro9r" target="_blank">instagram</a>{{ "  //  "
      }}<a href="https://www.last.fm/user/Alejandro9R" target="_blank">last.fm</a>
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
  font-size: 0.9em;
  line-height: 1.8em;
  a {
    text-underline-offset: 0.12em;
  }
}
.text-lowercase {
  text-transform: lowercase;
}
</style>
