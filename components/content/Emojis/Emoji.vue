<template>
  <template v-if="props.i && fetchURI">
    <img class="emoji-inline" width="64" height="64" :src="`data:image/svg+xml,${fetchURI}`" :alt="e" />
    <!-- <span class="emoji-inline-svg" v-html="fetchUrl"></span> -->
  </template>
  <template v-else-if="props.f === 'svg'">
    <img class="emoji-inline" width="64" height="64" :src="url" :alt="e" />
  </template>
  <template v-else-if="props.f === 'img'">
    <img class="emoji-inline" width="64" height="64" :srcset="url" :src="fallbackUrl" :alt="e" />
  </template>
</template>

<script lang="ts" setup>
type emojiType = "c" | "f" // type color or flat
type emojiFormat = "svg" | "img" // type color or flat

export interface Props {
  e: string // emoji
  t?: emojiType // type color or flat
  i?: boolean // true ? inline svg : img
  f?: emojiFormat // format svg or img
}

const props = withDefaults(defineProps<Props>(), {
  t: "c",
  i: false,
  f: "svg",
})

let url: string
// let fetchUrl = ref<string | null>()
let fetchURI = ref<string | null>()

const code = [...props.e].map((e) => e.codePointAt(0)!.toString(16)).join(`-`) // gives correctly 1f469-200d-2695-fe0f
const urlWithUnicode = `https://raw.githubusercontent.com/Arecsu/fluent-webmoji/main/assets/${code}`
const fallbackUrl = props.t === "c" ? `${urlWithUnicode}/color-128x.webp` : `${urlWithUnicode}/flat-128x.webp`

const urlConstructSVG = () => (props.t === "c" ? `${urlWithUnicode}/color.min.svg` : `${urlWithUnicode}/flat.min.svg`)

const urlConstructIMG = () =>
  props.t === "c"
    ? `${urlWithUnicode}/color-32x.webp 32w,
       ${urlWithUnicode}/color-64x.webp 64w,
       ${urlWithUnicode}/color-128x.webp 128w
       ${urlWithUnicode}/color.min.svg 256w`
    : `${urlWithUnicode}/flat-32x.webp 32w,
       ${urlWithUnicode}/flat-64x.webp 64w,
       ${urlWithUnicode}/flat-128x.webp 128w
       ${urlWithUnicode}/flat.min.svg 256w`

// https://gist.github.com/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
const encodeSvg = (svgString: string) => {
  return (
    svgString
      .replace("<svg", ~svgString.indexOf("xmlns") ? "<svg" : '<svg xmlns="http://www.w3.org/2000/svg"')
      .replace(/"/g, "'")
      .replace(/%/g, "%25")
      .replace(/#/g, "%23")
      .replace(/{/g, "%7B")
      .replace(/}/g, "%7D")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E")
      .replace(/\s+/g, " ")
  )
}

if (props.i === true) {
  url = urlConstructSVG()
  // fetchUrl = await $fetch<any>(url).then((response) => response.text())
  const { data, error } = await useAsyncData<string>(url, () => $fetch<any>(url).then((response) => response.text()))
  // fetchUrl.value = data.value
  fetchURI.value = encodeSvg(data.value!)
} else {
  url = props.f === "svg" ? urlConstructSVG() : urlConstructIMG()
}
</script>