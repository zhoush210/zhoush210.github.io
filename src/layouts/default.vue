<script setup lang="ts">
const bg = ref<HTMLElement | null>(null)
onMounted(() => {
  const bgImg = new Image()
  bgImg.src = '/bg.webp'
  bgImg.onload = () => bg.value!.style.backgroundImage = 'url(/bg.webp)'
})
</script>

<template>
  <div min-h-100vh>
    <RouterView />
    <Footer class="max-w-content m-auto" />
    <span
      ref="bg"
      class="fixed top-0 bottom-0 right-0 left-0 z--1"
      bg="no-repeat right-top fixed"
    />
  </div>
</template>
