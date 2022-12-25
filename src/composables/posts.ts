import dayjs from 'dayjs'
import type { ComputedRef } from 'vue'
import { formatDate } from '~/utils'
import type { PageMeta, PostRouterRecord } from '~build/node'

export const getBlogs = (routers: any[], tag?: string) =>
  routers
    .filter(page => page.meta.layout === 'post')
    .filter(page => tag ? page.meta.frontmatter.tag === tag : true)
    .map(
      (page: any): PostRouterRecord => {
        const meta: PageMeta = page.meta
        return {
          ...page,
          title: meta.frontmatter.title,
          subTitle: meta.frontmatter.subtitle,
          tag: meta.frontmatter.tag,
          headerImage: meta.frontmatter.headerImage,
          readingTimeText: `${String(meta.readingTime.minutes)} 分钟`,
          dateText: formatDate(meta.date),
        }
      },
    )
    .sort((a, b) => dayjs(b.meta.date).unix() - dayjs(a.meta.date).unix())

export const usePosts = (tag?: ComputedRef<string | undefined>) => {
  const router = useRouter()

  const posts = computed<PostRouterRecord[]>(() =>
    getBlogs(router.getRoutes(), tag?.value),
  )

  const blogYearMap = computed(() => {
    const map: Record<string, PostRouterRecord[]> = {}
    for (const post of posts.value) {
      const year = post.meta.date ? post.meta.date.substring(0, 4) : new Date().getFullYear()
      map[year] ? map[year].push(post) : (map[year] = [post])
    }

    return map
  })

  return { posts, blogYearMap }
}
