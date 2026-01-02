'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Calendar, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react'
import { ContentListItem } from '@/types/content'
import { cn } from '@/lib/utils'

interface BlogSidebarProps {
  currentSlug: string
  posts: ContentListItem[]
}

interface PostItemProps {
  post: ContentListItem
  isActive: boolean
}

function PostItem({ post, isActive }: PostItemProps) {
  return (
    <Link
      href={`/read/claude-blog/${post.slug}`}
      className={cn(
        'block p-3 rounded-lg transition-all group',
        isActive
          ? 'bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
      )}
    >
      <h3
        className={cn(
          'text-sm font-medium line-clamp-2 mb-1',
          isActive
            ? 'text-amber-900 dark:text-amber-100'
            : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'
        )}
      >
        {post.meta.languages.en?.title}
      </h3>
      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Calendar className="w-3 h-3" />
        <span>{post.meta.created}</span>
      </div>
    </Link>
  )
}

export function BlogSidebar({ currentSlug, posts }: BlogSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 날짜순 정렬 (최신순)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.meta.created).getTime() - new Date(a.meta.created).getTime()
  )

  const sidebarContent = (
    <nav className="h-full overflow-y-auto py-4 px-3">
      {/* 헤더 */}
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        <span className="text-lg">Claude Blog</span>
      </Link>

      {/* 포스트 목록 */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Recent Posts
        </div>
        {sortedPosts.map((post) => (
          <PostItem key={post.slug} post={post} isActive={post.slug === currentSlug} />
        ))}
      </div>

      {/* 홈으로 돌아가기 */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back to Home</span>
        </Link>
      </div>
    </nav>
  )

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
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
          isCollapsed ? 'w-12' : 'w-72'
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
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-slate-50 dark:bg-slate-900 shadow-xl">
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
