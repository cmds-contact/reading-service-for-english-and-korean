// 언어 코드 (ISO 639-1)
export type LangCode = 'en' | 'ko'

// 언어별 메타 정보
export interface LanguageMeta {
  title: string
  type: 'original' | 'translation'
  translator?: 'human' | 'ai' | 'hybrid'
}

// meta.yaml 스키마
export interface ContentMeta {
  id: string
  created: string
  updated: string
  source: {
    url: string
    company: string
    published: string
  }
  category?: string
  tags?: string[]
  languages: {
    [key in LangCode]?: LanguageMeta
  }
}

// 파싱된 문단
export interface ParsedParagraph {
  id: string
  type: 'heading' | 'paragraph' | 'list' | 'blockquote'
  level?: number
  content: string
  rawContent: string
}

// 파싱된 언어별 콘텐츠
export interface ParsedLanguageContent {
  paragraphs: ParsedParagraph[]
}

// 콘텐츠 페어 (영어 + 한국어)
export interface ContentPair {
  slug: string
  meta: ContentMeta
  en: ParsedLanguageContent
  ko: ParsedLanguageContent
}

// 콘텐츠 목록 아이템
export interface ContentListItem {
  slug: string
  meta: ContentMeta
}

// UI 레이아웃 모드
export type LayoutMode = 'side-by-side' | 'top-bottom' | 'toggle'

// UI 언어 선택
export type Language = 'en' | 'ko'
