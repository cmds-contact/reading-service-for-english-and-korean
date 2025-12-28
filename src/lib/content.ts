import fs from 'fs'
import path from 'path'
import { parseMarkdownContent } from './markdown'
import { ContentMeta, ContentPair } from '@/types/content'

const CONTENTS_DIR = path.join(process.cwd(), 'contents')

export function getAllContentSlugs(): string[] {
  const files = fs.readdirSync(CONTENTS_DIR)

  return files
    .filter((f) => f.endsWith('.md') && !f.endsWith('_kr.md'))
    .map((f) => f.replace('.md', ''))
}

export async function getContentPair(slug: string): Promise<ContentPair> {
  const englishPath = path.join(CONTENTS_DIR, `${slug}.md`)
  const koreanPath = path.join(CONTENTS_DIR, `${slug}_kr.md`)

  const englishContent = fs.readFileSync(englishPath, 'utf-8')
  const koreanContent = fs.readFileSync(koreanPath, 'utf-8')

  const [english, korean] = await Promise.all([
    parseMarkdownContent(englishContent),
    parseMarkdownContent(koreanContent),
  ])

  return { slug, english, korean }
}

export interface ContentListItem {
  slug: string
  englishMeta: ContentMeta
  koreanMeta: ContentMeta
}

export async function getAllContents(): Promise<ContentListItem[]> {
  const slugs = getAllContentSlugs()

  const contents = await Promise.all(
    slugs.map(async (slug) => {
      const pair = await getContentPair(slug)
      return {
        slug,
        englishMeta: pair.english.meta,
        koreanMeta: pair.korean.meta,
      }
    })
  )

  return contents.sort(
    (a, b) => new Date(b.englishMeta.date).getTime() - new Date(a.englishMeta.date).getTime()
  )
}
