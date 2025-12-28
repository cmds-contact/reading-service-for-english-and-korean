export interface ContentMeta {
  title: string
  date: string
  source: string
  company?: string
  category?: string
  translated?: boolean
  original_title?: string
}

export interface ParsedParagraph {
  id: string
  type: 'heading' | 'paragraph' | 'list' | 'blockquote'
  level?: number
  content: string
  rawContent: string
}

export interface ContentPair {
  slug: string
  english: {
    meta: ContentMeta
    paragraphs: ParsedParagraph[]
  }
  korean: {
    meta: ContentMeta
    paragraphs: ParsedParagraph[]
  }
}

export type LayoutMode = 'side-by-side' | 'top-bottom' | 'toggle'

export type Language = 'english' | 'korean'
