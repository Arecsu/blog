<template>
  <Emoji :e="e" :t="t" :f="f" :i="i"/>
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
  f: "img",
})
</script>