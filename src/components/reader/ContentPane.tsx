'use client'

import { ParsedParagraph, Language } from '@/types/content'
import { useReaderStore } from '@/stores/readerStore'
import { Paragraph } from './Paragraph'
import { cn } from '@/lib/utils'

interface ContentPaneProps {
  paragraphs: ParsedParagraph[]
  language: Language
  className?: string
}

export function ContentPane({ paragraphs, language, className }: ContentPaneProps) {
  const { activeParagraphId, setActiveParagraph } = useReaderStore()

  const handleParagraphClick = (id: string) => {
    setActiveParagraph(activeParagraphId === id ? null : id)
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 py-2 px-4 border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {language === 'en' ? 'English' : '한국어'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {paragraphs.map((p) => (
          <Paragraph
            key={p.id}
            paragraph={p}
            isActive={activeParagraphId === p.id}
            onClick={() => handleParagraphClick(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
