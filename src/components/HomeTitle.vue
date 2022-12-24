<script setup lang="ts">
const avatar = ref<HTMLImageElement | null>(null)
</script>

<template>
  <div flex items-end justify-between lt-sm="flex-col-reverse items-start gap-3">
    <div>
      <h1 lt-sm="text-3xl!">
        <slot />
      </h1>
    </div>
    <div
      class="w-22 h-22 border border-c rounded-full overflow-hidden z-1"
      shadow="slate-200 dark:slate-800"
    >
      <img
        ref="avatar"
        alt="avatar"
        width="120" height="120"
        class="m-0! not-zoom avatar"
        src="/avatar.webp"
        @load="ref(avatar!.classList.add('loaded'))"
      >
    </div>
  </div>
</template>

<style scoped>
.avatar.loaded{
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

.avatar{
  opacity: 0;
  transform: scale(1.5);
  filter: blur(8px);
  transition: .8s ease;
  transition-property: filter,opacity,transform;
  will-change: filter,transform;
}
</style>
