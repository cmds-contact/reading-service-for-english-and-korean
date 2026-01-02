'use client'

import { ContentPair, ContentListItem } from '@/types/content'
import { Header } from '@/components/layout/Header'
import { ParallelReader } from '@/components/reader/ParallelReader'
import { DocsSidebar } from './DocsSidebar'

interface DocsLayoutProps {
  content: ContentPair
  contents: ContentListItem[]
}

export function DocsLayout({ content, contents }: DocsLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 좌측 사이드바 */}
      <DocsSidebar currentSlug={content.slug} contents={contents} />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={content.meta.languages.en?.title}
          showLayoutToggle
          sourceUrl={content.meta.source.url}
        />
        <div className="flex-1 overflow-hidden">
          <ParallelReader content={content} fullHeight />
        </div>
      </div>
    </div>
  )
}
