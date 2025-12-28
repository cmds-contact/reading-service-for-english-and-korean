import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import { ContentMeta, ParsedParagraph } from '@/types/content'

export function parseFrontmatter(content: string): { meta: ContentMeta; body: string } {
  const { data, content: body } = matter(content)

  // gray-matter converts dates to Date objects, convert back to string
  const meta = { ...data } as ContentMeta
  if (data.date instanceof Date) {
    meta.date = data.date.toISOString().split('T')[0]
  }

  return { meta, body }
}

export function splitIntoParagraphs(markdown: string): string[] {
  return markdown
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

export async function paragraphToHtml(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(html, { sanitize: false }).process(markdown)
  return result.toString()
}

export function detectParagraphType(markdown: string): ParsedParagraph['type'] {
  if (markdown.startsWith('#')) return 'heading'
  if (markdown.startsWith('-') || markdown.startsWith('*') || /^\d+\./.test(markdown))
    return 'list'
  if (markdown.startsWith('>')) return 'blockquote'
  return 'paragraph'
}

export function getHeadingLevel(markdown: string): number | undefined {
  const match = markdown.match(/^(#+)/)
  return match ? match[1].length : undefined
}

export async function parseMarkdownContent(content: string): Promise<{
  meta: ContentMeta
  paragraphs: ParsedParagraph[]
}> {
  const { meta, body } = parseFrontmatter(content)
  const rawParagraphs = splitIntoParagraphs(body)

  const paragraphs = await Promise.all(
    rawParagraphs.map(async (raw, index) => ({
      id: `p-${index}`,
      type: detectParagraphType(raw),
      level: getHeadingLevel(raw),
      content: await paragraphToHtml(raw),
      rawContent: raw,
    }))
  )

  return { meta, paragraphs }
}
