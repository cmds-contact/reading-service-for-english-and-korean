'use client'

import React from 'react'
import Link from 'next/link'
import { Bot, Megaphone, Building2, Code, Sparkles } from 'lucide-react'
import { ContentListItem } from '@/types/content'
import { cn } from '@/lib/utils'

// 카드 배경색 팔레트 (Claude Blog 스타일)
const CARD_COLORS = [
  'bg-[#7B9EBD]', // 블루
  'bg-[#C4856A]', // 테라코타
  'bg-[#D5CFC4]', // 베이지
  'bg-[#9EB3A7]', // 세이지 그린
  'bg-[#B8A5C7]', // 라벤더
  'bg-[#C9A87C]', // 골드
  'bg-[#8FA3BF]', // 스틸 블루
  'bg-[#C07D7D]', // 더스티 로즈
]

// 카테고리별 아이콘 매핑
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  agents: <Bot className="w-4 h-4" />,
  'product announcements': <Megaphone className="w-4 h-4" />,
  'enterprise ai': <Building2 className="w-4 h-4" />,
  coding: <Code className="w-4 h-4" />,
  default: <Sparkles className="w-4 h-4" />,
}

// 카드용 큰 아이콘 컴포넌트
function CardIcon({ category }: { category: string }) {
  const iconClass = 'w-16 h-16'
  switch (category) {
    case 'agents':
      return <Bot className={iconClass} />
    case 'product announcements':
      return <Megaphone className={iconClass} />
    case 'enterprise ai':
      return <Building2 className={iconClass} />
    case 'coding':
      return <Code className={iconClass} />
    default:
      return <Sparkles className={iconClass} />
  }
}

interface BlogCardProps {
  post: ContentListItem
  index: number
  viewMode: 'grid' | 'list'
}

export function BlogCard({ post, index, viewMode }: BlogCardProps) {
  const colorClass = CARD_COLORS[index % CARD_COLORS.length]
  const category = post.meta.category?.toLowerCase() || 'default'
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default
  const categoryLabel = post.meta.category || 'Article'

  if (viewMode === 'list') {
    return (
      <Link
        href={`/read/claude-blog/${post.slug}`}
        className="flex items-center gap-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group"
      >
        {/* 미니 썸네일 */}
        <div
          className={cn(
            'w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center',
            colorClass
          )}
        >
          <div className="w-10 h-10 text-black/20">
            {categoryIcon}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {post.meta.created}
          </p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {post.meta.languages.en?.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
            {post.meta.languages.ko?.title}
          </p>
        </div>

        {/* 카테고리 */}
        <div className="flex-shrink-0 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          {categoryIcon}
          <span>{categoryLabel}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/read/claude-blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all"
    >
      {/* 카드 상단 - 컬러 배경 영역 */}
      <div
        className={cn(
          'aspect-[4/3] flex items-center justify-center relative',
          colorClass
        )}
      >
        {/* 심플 아이콘/일러스트 */}
        <div className="w-24 h-24 text-black/20 group-hover:scale-110 transition-transform flex items-center justify-center">
          <CardIcon category={category} />
        </div>
      </div>

      {/* 카드 하단 - 정보 영역 */}
      <div className="p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {post.meta.created}
        </p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
          {post.meta.languages.en?.title}
        </h3>

        {/* 카테고리 태그 */}
        <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 dark:text-slate-400">
          {categoryIcon}
          <span>{categoryLabel}</span>
        </div>
      </div>
    </Link>
  )
}
