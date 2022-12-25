interface TagMap {
  [key: string]: {
    path: string
    blogs: string[]
  }
}
export const useTags = () => {
  const router = useRouter()
  const path = computed(() => router.currentRoute.value.path)

  const tagMap = computed(() => router.currentRoute.value.meta?.tagMap as TagMap)
  const tags = computed(() =>
    Object.keys(tagMap.value || {}).sort(
      (a, b) => tagMap.value[b].blogs.length - tagMap.value[a].blogs.length,
    ),
  )
  const tag = computed(() => {
    const tagName = tags.value.find(t => tagMap.value[t].path === path.value)
    return tagName
  })

  return { tags, tagMap, tag }
}
