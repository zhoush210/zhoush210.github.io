<script setup lang="ts">
import { isClient } from '~/utils'
import { bilibili, github, site } from '~/meta'
const router = useRouter()
const isInPost = computed(() => router.currentRoute.value.path.startsWith('/posts/'))

const navbar = ref<HTMLElement | null>(null)
const isLeave = ref(false)
const isVisible = ref(false)

if (isClient) {
  const { y, directions } = useScroll(document)

  watch(y, () => {
    if (directions.top) {
      // scrolling up
      if (y.value > 0 && isLeave.value) {
        isVisible.value = true
      }
      else {
        isVisible.value = false
        isLeave.value = false
      }
    }
    else if (directions.bottom) {
      // scrolling down
      isVisible.value = false
      if (navbar.value && y.value > navbar.value!.offsetHeight)
        isLeave.value = true
    }
  })
}
</script>

<template>
  <header
    ref="navbar"
    class="z-40 w-full h-20 bg-c-bg bg-op-0 dark:bg-op-0 backdrop-blur-2 backdrop-saturate-50 transition-colors select-none"
    :class="[
      isLeave
        && 'fixed -top-20 left-0 transition-transform duration-300',
      isVisible && 'translate-y-full bg-op-80 dark:bg-op-80',
      !isLeave && !isVisible && 'absolute top-0 left-0',
      isInPost && !isLeave && !isVisible && 'text-white',
    ]"
  >
    <div class="max-w-120ch m-auto flex justify-between items-center">
      <router-link class="font-600 pl-2" un-text="c-light hover:c-dark" to="/">
        <span text="lg">hi@zsh</span>
        <div i-fa6-solid:angle-right class="prompt inline-block" />
        <span class="blink">_</span>
      </router-link>

      <nav class="nav box-border p-8 flex items-center space-x-3">
        <router-link to="/posts" title="Blog" class="nav-item">
          <div i-majesticons:paper-fold-text-line class="md:hidden" />
          <span class="lt-md:hidden">Blog</span>
        </router-link>
        <router-link to="/links" title="Links" class="nav-item">
          <div i-ph:rocket-launch-duotone class="md:hidden" />
          <span class="lt-md:hidden">Links</span>
        </router-link>
        <span class="nav-divider" />

        <a :href="bilibili" target="_blank" title="Bilibili" rel="noreferrer">
          <div i-ri:bilibili-line />
        </a>
        <a :href="github" target="_blank" title="GitHub" rel="noreferrer">
          <div i-uil-github-alt />
        </a>
        <a :href="`${site}/feed.xml`" target="_blank" title="RSS">
          <div i-lucide:rss />
        </a>
        <span class="nav-divider" />

        <button title="Toggle Color Scheme" @click="toggleDark()">
          <div i="ri-sun-line dark:ri-moon-line" />
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav a,
.nav button{
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover,
.nav button:hover{
  opacity: 1;
  text-decoration-color: inherit;
}

.prompt {
  vertical-align: -0.2em;
  font-size: 0.85em;
}

.blink {
  animation: blinker 1s none infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
