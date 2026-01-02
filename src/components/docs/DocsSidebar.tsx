'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, ChevronLeft, Menu, X, PanelLeftClose, PanelLeft } from 'lucide-react'
import { CLAUDE_DOCS_CATEGORIES, Category, Subsection } from '@/lib/categories'
import { ContentListItem } from '@/types/content'
import { cn } from '@/lib/utils'

interface DocsSidebarProps {
  currentSlug: string
  contents: ContentListItem[]
}

interface CategorySectionProps {
  category: Category
  currentSlug: string
  contents: ContentListItem[]
  isExpanded: boolean
  onToggle: () => void
}

function getDocTitle(slug: string, contents: ContentListItem[]): string {
  const doc = contents.find((c) => c.slug === slug)
  return doc?.meta.languages.en?.title || slug
}

function CategorySection({
  category,
  currentSlug,
  contents,
  isExpanded,
  onToggle,
}: CategorySectionProps) {
  const allCategoryItems = [
    ...category.items,
    ...(category.subsections?.flatMap((s) => s.items) || []),
  ]
  const isCurrentInCategory = allCategoryItems.includes(currentSlug)

  return (
    <div className="mb-2">
      {/* 카테고리 헤더 */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-left',
          'text-sm font-semibold text-slate-700 dark:text-slate-300',
          'hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors'
        )}
      >
        <span>{category.name}</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* 카테고리 아이템 목록 */}
      {isExpanded && (
        <div className="mt-1 ml-2">
          {/* 메인 아이템 */}
          {category.items.map((slug) => (
            <SidebarItem
              key={slug}
              slug={slug}
              title={getDocTitle(slug, contents)}
              currentSlug={currentSlug}
            />
          ))}

          {/* 서브섹션 */}
          {category.subsections?.map((subsection) => (
            <SubsectionGroup
              key={subsection.name}
              subsection={subsection}
              currentSlug={currentSlug}
              contents={contents}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface SubsectionGroupProps {
  subsection: Subsection
  currentSlug: string
  contents: ContentListItem[]
}

function SubsectionGroup({ subsection, currentSlug, contents }: SubsectionGroupProps) {
  const [isExpanded, setIsExpanded] = useState(subsection.items.includes(currentSlug))

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center gap-1 px-2 py-1.5 text-left',
          'text-xs font-medium text-slate-500 dark:text-slate-400',
          'hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
        )}
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        <span>{subsection.name}</span>
      </button>

      {isExpanded && (
        <div className="ml-3">
          {subsection.items.map((slug) => (
            <SidebarItem
              key={slug}
              slug={slug}
              title={getDocTitle(slug, contents)}
              currentSlug={currentSlug}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarItemProps {
  slug: string
  title: string
  currentSlug: string
}

function SidebarItem({ slug, title, currentSlug }: SidebarItemProps) {
  const isActive = slug === currentSlug

  return (
    <Link
      href={`/read/claude-docs/${slug}`}
      className={cn(
        'block px-3 py-1.5 text-sm rounded-md transition-colors',
        isActive
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      )}
    >
      {title}
    </Link>
  )
}

export function DocsSidebar({ currentSlug, contents }: DocsSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    // 현재 문서가 속한 카테고리를 기본으로 펼침
    const expanded = new Set<string>()
    for (const category of CLAUDE_DOCS_CATEGORIES) {
      const allItems = [
        ...category.items,
        ...(category.subsections?.flatMap((s) => s.items) || []),
      ]
      if (allItems.includes(currentSlug)) {
        expanded.add(category.slug)
        break
      }
    }
    return expanded
  })

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const sidebarContent = (
    <nav className="h-full overflow-y-auto py-4 px-2">
      {/* 홈 링크 */}
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 mb-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
      >
        <span>Claude Docs</span>
      </Link>

      {/* 카테고리 목록 */}
      {CLAUDE_DOCS_CATEGORIES.map((category) => (
        <CategorySection
          key={category.slug}
          category={category}
          currentSlug={currentSlug}
          contents={contents}
          isExpanded={expandedCategories.has(category.slug)}
          onToggle={() => toggleCategory(category.slug)}
        />
      ))}
    </nav>
  )

  return (
    <>
      {/* 모바일 햄버거 버튼 - Header 아래에 위치 */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-16 left-3 z-40 p-2 bg-white dark:bg-slate-900 rounded-md shadow-md border border-slate-200 dark:border-slate-700"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* 데스크톱 사이드바 */}
      <aside
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0 bg-stone-50 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transition-all duration-300',
          isCollapsed ? 'w-12' : 'w-64'
        )}
      >
        {/* 토글 버튼 */}
        <div className={cn('flex items-center p-2', isCollapsed ? 'justify-center' : 'justify-end')}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>
        {!isCollapsed && sidebarContent}
      </aside>

      {/* 모바일 오버레이 사이드바 */}
      {isMobileOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* 사이드바 패널 */}
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-50 dark:bg-slate-900 shadow-xl">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-3 right-3 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
