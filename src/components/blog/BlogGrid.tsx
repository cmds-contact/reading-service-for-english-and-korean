'use client'

import { useState, useMemo } from 'react'
import { Search, LayoutGrid, List } from 'lucide-react'
import { ContentListItem } from '@/types/content'
import { BlogCard } from './BlogCard'
import { BlogFilter, SortOption } from './BlogFilter'
import { cn } from '@/lib/utils'

interface BlogGridProps {
  posts: ContentListItem[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // 사용 가능한 카테고리 추출
  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    posts.forEach((post) => {
      if (post.meta.category) {
        categories.add(post.meta.category)
      }
    })
    return Array.from(categories).sort()
  }, [posts])

  // 필터링 및 정렬된 포스트
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.meta.languages.en?.title?.toLowerCase().includes(query) ||
          post.meta.languages.ko?.title?.toLowerCase().includes(query)
      )
    }

    // 카테고리 필터
    if (selectedCategories.length > 0) {
      result = result.filter((post) =>
        post.meta.category && selectedCategories.includes(post.meta.category)
      )
    }

    // 정렬
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.meta.created).getTime() - new Date(a.meta.created).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.meta.created).getTime() - new Date(b.meta.created).getTime())
        break
      case 'a-z':
        result.sort((a, b) =>
          (a.meta.languages.en?.title || '').localeCompare(b.meta.languages.en?.title || '')
        )
        break
      case 'z-a':
        result.sort((a, b) =>
          (b.meta.languages.en?.title || '').localeCompare(a.meta.languages.en?.title || '')
        )
        break
    }

    return result
  }, [posts, searchQuery, sortBy, selectedCategories])

  return (
    <div className="flex gap-8">
      {/* 좌측 필터 사이드바 */}
      <BlogFilter
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        availableCategories={availableCategories}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 min-w-0">
        {/* 상단 컨트롤: 검색 + 뷰 토글 */}
        <div className="flex items-center gap-4 mb-8">
          {/* 검색바 */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 뷰 모드 토글 */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* 결과 카운트 */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {filteredPosts.length} posts
        </p>

        {/* 포스트 그리드/리스트 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} viewMode="list" />
            ))}
          </div>
        )}

        {/* 결과 없음 */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
