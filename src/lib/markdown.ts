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
  const trimmed = markdown.trim()

  // 이미지: ![...](...)
  if (/^!\[.*\]\(.*\)/.test(trimmed)) return 'image'

  // 비디오: <iframe...youtube/vimeo...> 또는 ::youtube[...]
  if (/<iframe[^>]*(youtube|vimeo)[^>]*>/i.test(trimmed)) return 'video'
  if (/^::youtube\[/.test(trimmed)) return 'video'

  // 기존 타입
  if (trimmed.startsWith('#')) return 'heading'
  if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) return 'list'
  if (trimmed.startsWith('>')) return 'blockquote'

  return 'paragraph'
}

/**
 * YouTube 커스텀 구문(::youtube[VIDEO_ID])을 iframe으로 변환합니다
 */
export function transformYouTubeEmbed(markdown: string): string {
  return markdown.replace(
    /::youtube\[([^\]]+)\]/g,
    (_, videoId) =>
      `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  )
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
    rawParagraphs.map(async (raw, index) => {
      // YouTube 커스텀 구문 변환
      const transformed = transformYouTubeEmbed(raw)
      return {
        id: `p-${index}`,
        type: detectParagraphType(raw),
        level: getHeadingLevel(raw),
        content: await paragraphToHtml(transformed),
        rawContent: raw,
      }
    })
  )

  return paragraphs
}
