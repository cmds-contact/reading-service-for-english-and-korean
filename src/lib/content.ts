import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { parseMarkdownBody } from './markdown'
import { ContentMeta, ContentPair, ContentListItem, LangCode } from '@/types/content'

const CONTENTS_DIR = path.join(process.cwd(), 'contents')

/**
 * 날짜 값을 문자열로 변환합니다
 */
function toDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  return String(value)
}

/**
 * meta.yaml 파일을 파싱합니다
 */
function parseMetaYaml(filePath: string): ContentMeta {
  const content = fs.readFileSync(filePath, 'utf-8')
  const raw = yaml.load(content) as Record<string, unknown>

  // 날짜 필드를 문자열로 변환
  const meta: ContentMeta = {
    id: String(raw.id),
    created: toDateString(raw.created),
    updated: toDateString(raw.updated),
    channel: String(raw.channel || ''),
    source: {
      url: String((raw.source as Record<string, unknown>)?.url || ''),
      published: toDateString((raw.source as Record<string, unknown>)?.published),
    },
    category: raw.category ? String(raw.category) : undefined,
    tags: raw.tags as string[] | undefined,
    languages: raw.languages as ContentMeta['languages'],
  }

  return meta
}

/**
 * 콘텐츠 경로 정보
 */
export interface ContentPath {
  channel: string
  slug: string
}

/**
 * 모든 콘텐츠 경로 목록을 반환합니다 (2레벨 폴더 구조)
 * contents/{channel}/{slug}/
 */
export function getAllContentPaths(): ContentPath[] {
  const paths: ContentPath[] = []

  // 채널 폴더 탐색
  const channelEntries = fs.readdirSync(CONTENTS_DIR, { withFileTypes: true })

  for (const channelEntry of channelEntries) {
    if (!channelEntry.isDirectory()) continue
    if (channelEntry.name.startsWith('.')) continue

    const channelDir = path.join(CONTENTS_DIR, channelEntry.name)

    // 슬러그 폴더 탐색
    const slugEntries = fs.readdirSync(channelDir, { withFileTypes: true })

    for (const slugEntry of slugEntries) {
      if (!slugEntry.isDirectory()) continue
      if (slugEntry.name.startsWith('.')) continue

      // meta.yaml이 있는 폴더만 콘텐츠로 인식
      const metaPath = path.join(channelDir, slugEntry.name, 'meta.yaml')
      if (fs.existsSync(metaPath)) {
        paths.push({
          channel: channelEntry.name,
          slug: slugEntry.name,
        })
      }
    }
  }

  return paths
}

/**
 * 특정 콘텐츠의 영어/한국어 페어를 반환합니다
 */
export async function getContentPair(channel: string, slug: string): Promise<ContentPair> {
  const contentDir = path.join(CONTENTS_DIR, channel, slug)
  const metaPath = path.join(contentDir, 'meta.yaml')
  const enPath = path.join(contentDir, 'en.md')
  const koPath = path.join(contentDir, 'ko.md')

  // 메타데이터 파싱
  const meta = parseMetaYaml(metaPath)

  // 언어별 마크다운 파싱
  const enContent = fs.readFileSync(enPath, 'utf-8')
  const koContent = fs.readFileSync(koPath, 'utf-8')

  const [enParagraphs, koParagraphs] = await Promise.all([
    parseMarkdownBody(enContent),
    parseMarkdownBody(koContent),
  ])

  return {
    channel,
    slug,
    meta,
    en: { paragraphs: enParagraphs },
    ko: { paragraphs: koParagraphs },
  }
}

/**
 * 모든 콘텐츠 목록을 반환합니다 (메타데이터만)
 */
export async function getAllContents(): Promise<ContentListItem[]> {
  const paths = getAllContentPaths()

  const contents = paths.map(({ channel, slug }) => {
    const metaPath = path.join(CONTENTS_DIR, channel, slug, 'meta.yaml')
    const meta = parseMetaYaml(metaPath)
    return { channel, slug, meta }
  })

  // 생성일 기준 내림차순 정렬
  return contents.sort(
    (a, b) => new Date(b.meta.created).getTime() - new Date(a.meta.created).getTime()
  )
}

/**
 * 특정 언어의 콘텐츠만 반환합니다
 */
export async function getContentByLang(channel: string, slug: string, lang: LangCode) {
  const contentDir = path.join(CONTENTS_DIR, channel, slug)
  const metaPath = path.join(contentDir, 'meta.yaml')
  const langPath = path.join(contentDir, `${lang}.md`)

  const meta = parseMetaYaml(metaPath)
  const content = fs.readFileSync(langPath, 'utf-8')
  const paragraphs = await parseMarkdownBody(content)

  return { meta, paragraphs }
}

/**
 * 모든 채널 목록을 반환합니다 (폴더 기반)
 */
export function getAllChannels(): string[] {
  const entries = fs.readdirSync(CONTENTS_DIR, { withFileTypes: true })

  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false
      if (entry.name.startsWith('.')) return false
      // 하위에 콘텐츠가 있는 폴더만
      const channelDir = path.join(CONTENTS_DIR, entry.name)
      const slugEntries = fs.readdirSync(channelDir, { withFileTypes: true })
      return slugEntries.some((slugEntry) => {
        if (!slugEntry.isDirectory()) return false
        const metaPath = path.join(channelDir, slugEntry.name, 'meta.yaml')
        return fs.existsSync(metaPath)
      })
    })
    .map((entry) => entry.name)
    .sort()
}

/**
 * 특정 채널의 콘텐츠 목록을 반환합니다
 */
export async function getContentsByChannel(channel: string): Promise<ContentListItem[]> {
  const allContents = await getAllContents()
  return allContents.filter((content) => content.channel === channel)
}
