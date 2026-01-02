'use client'

import { ContentPair } from '@/types/content'
import { useReaderStore } from '@/stores/readerStore'
import { ContentPane } from './ContentPane'
import { MobileToggle } from './MobileToggle'
import { cn } from '@/lib/utils'

interface ParallelReaderProps {
  content: ContentPair
  /** DocsLayout 등에서 사용 시 true로 설정하여 h-full 사용 */
  fullHeight?: boolean
}

export function ParallelReader({ content, fullHeight = false }: ParallelReaderProps) {
  const { layoutMode, activeLanguage } = useReaderStore()

  const heightClass = fullHeight ? 'h-full' : 'h-[calc(100vh-3.5rem)]'

  return (
    <div
      className={cn(
        layoutMode === 'side-by-side' && `${heightClass} flex flex-col`,
        layoutMode === 'top-bottom' && `${heightClass} flex flex-col`
      )}
    >
      <main
        className={cn(
          'flex-1 min-h-0 px-2',
          layoutMode === 'side-by-side' && 'flex flex-row gap-2 py-2',
          layoutMode === 'top-bottom' && 'flex flex-col gap-2 py-2',
          layoutMode === 'toggle' && 'container mx-auto px-4 py-8 block'
        )}
      >
        <ContentPane
          paragraphs={content.en.paragraphs}
          language="en"
          className={cn(
            layoutMode === 'side-by-side' && 'w-1/2 min-w-0 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg',
            layoutMode === 'top-bottom' && 'flex-1 min-h-0 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg',
            layoutMode === 'toggle' && activeLanguage !== 'en' && 'hidden'
          )}
        />

        <ContentPane
          paragraphs={content.ko.paragraphs}
          language="ko"
          className={cn(
            layoutMode === 'side-by-side' && 'w-1/2 min-w-0 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg',
            layoutMode === 'top-bottom' && 'flex-1 min-h-0 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg',
            layoutMode === 'toggle' && activeLanguage !== 'ko' && 'hidden'
          )}
        />
      </main>

      {layoutMode === 'toggle' && <MobileToggle />}
    </div>
  )
}
