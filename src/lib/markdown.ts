import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import { ParsedParagraph } from '@/types/content'

/**
 * 마크다운을 문단 단위로 분리합니다
 */
export function splitIntoParagraphs(markdown: string): string[] {
  return markdown
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

/**
 * 문단을 HTML로 변환합니다
 */
export async function paragraphToHtml(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(html, { sanitize: false }).process(markdown)
  return result.toString()
}

/**
 * 문단 타입을 감지합니다
 */
export function detectParagraphType(markdown: string): ParsedParagraph['type'] {
  if (markdown.startsWith('#')) return 'heading'
  if (markdown.startsWith('-') || markdown.startsWith('*') || /^\d+\./.test(markdown))
    return 'list'
  if (markdown.startsWith('>')) return 'blockquote'
  return 'paragraph'
}

/**
 * 헤딩 레벨을 반환합니다
 */
export function getHeadingLevel(markdown: string): number | undefined {
  const match = markdown.match(/^(#+)/)
  return match ? match[1].length : undefined
}

/**
 * 마크다운 본문을 파싱합니다 (frontmatter 없음)
 */
export async function parseMarkdownBody(content: string): Promise<ParsedParagraph[]> {
  const rawParagraphs = splitIntoParagraphs(content)

  const paragraphs = await Promise.all(
    rawParagraphs.map(async (raw, index) => ({
      id: `p-${index}`,
      type: detectParagraphType(raw),
      level: getHeadingLevel(raw),
      content: await paragraphToHtml(raw),
      rawContent: raw,
    }))
  )

  return paragraphs
}
