<script lang="ts" setup>
import { tags as tagTextMap } from '~/meta'
const { tag: curTag, tags, tagMap } = useTags()
const inactiveStyle = 'opacity-40 hover:opacity-60'
const parseName = (tag: string) => {
  return Object.hasOwn(tagTextMap, tag)
    ? tagTextMap[tag]
    : tag
}
</script>

<template>
  <div class="prose mb-0 text-lg sm:text-xl" flex="~ gap2 sm:gap3 wrap">
    <router-link
      to="/posts"
      class="!border-none !font-400"
      :class="curTag === undefined ? '' : inactiveStyle"
    >
      All
    </router-link>
    <router-link
      v-for="tag in tags"
      :key="tagMap[tag].path"
      :to="tagMap[tag].path"
      class="!border-none !font-400"
      :class="curTag === tag ? '' : inactiveStyle"
    >
      {{ parseName(tag) }}
    </router-link>
  </div>
</template>

<style></style>
