// Modified from: https://github.com/Renovamen/renovamen.github.io/blob/main/node/resolveTags.ts
import fs from 'fs-extra'
import fg from 'fast-glob'
import { resolve } from 'pathe'
import matter from 'gray-matter'
import { slugify } from '../markdown/slugify'

const __PREFIX = '/tags/'

export const resolveTags = (routes: any[]) => {
  const tagMap = {} as { [key: string]: { path: string; blogs: string[] } }

  routes
    .filter(item => item.meta?.layout === 'post')
    .forEach((item) => {
      const tag = item.meta.frontmatter.tag
      if (tag) {
        if (tag in tagMap) {
          tagMap[tag].blogs.push(item.path)
        }
        else {
          tagMap[tag] = {
            path: `${__PREFIX}${slugify(tag)}`,
            blogs: [item.path],
          }
        }
      }
    })

  return routes.map((item) => {
    if (item.path === '/posts' || item.path.startsWith(__PREFIX)) {
      if (!item.meta)
        item.meta = {}
      item.meta.tagMap = tagMap
    }
    return item
  })
}

export const getTagPathsFromFiles = async (
  sourceDir: string,
  exclude?: string[],
) => {
  sourceDir = resolve(__dirname, '../../', sourceDir)
  const files = await fg('**/*.md', { cwd: sourceDir, ignore: exclude })
  const tags: Set<string> = new Set()

  await Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(`${sourceDir}/${f}`)
      const { data } = matter(raw)
      if (data.tag)
        tags.add(`${__PREFIX}${slugify(data.tag)}`)
    }),
  )

  return [...tags]
}
