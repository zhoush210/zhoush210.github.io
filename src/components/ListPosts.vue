<script setup lang="ts">
import dayjs from 'dayjs'
const { tag } = useTags()
const { posts, blogYearMap } = usePosts(tag)
</script>

<template>
  <ul class="pt-2">
    <template v-if="!posts.length">
      <div class="text-center op-80">
        nothing here yet
      </div>
    </template>
    <template v-for="year in Object.keys(blogYearMap).reverse()" :key="year">
      <div class="my-4 text-2em op-40 top--2rem font-bold">
        {{ year }}
      </div>
      <router-link v-for="post in blogYearMap[year]" :key="post.path" :to="post.path" class="item">
        <li :title="post.title" class="flex gap-4">
          <figure class="w-26! m-0! max-h-68px flex overflow-hidden lt-sm:hidden">
            <img
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover m-0! op-0 transition-opacity-600 not-zoom"
              :src="post.headerImage"
              :alt="post.title"
              onload="this.removeAttribute('loading');this.classList.add('op-80')"
              onerror="this.parentElement.classList.add('error');"
            >
          </figure>
          <div class="flex flex-col justify-center">
            <div class="flex-1 text-lg">
              {{ post.title }}
            </div>
            <div class="text-sm op-50">
              {{ post.subTitle }}
            </div>
            <time
              :datetime="dayjs(post.meta.date).toISOString()"
              class="text-xs op-50"
            >
              {{ post.dateText }} · {{ post.readingTimeText }}
            </time>
          </div>
        </li>
      </router-link>
    </template>
  </ul>
</template>

<style scoped>
.prose a.item{
  --at-apply: block border-b-none rd-rt rd-rb py-1 md:pl-8 pl-0 md:border-l-4 border-c-border transition;
  --at-apply: text-c-dim hover:(text-c-fgDeeper bg-gray bg-op-10);
}
</style>
