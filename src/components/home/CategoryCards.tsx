'use client'

import Link from 'next/link'
import { BookOpen, Newspaper } from 'lucide-react'

interface CategoryCardProps {
  title: string
  titleKo: string
  description: string
  href: string
  icon: React.ReactNode
  count?: number
  accentColor: 'amber' | 'orange'
}

function CategoryCard({ title, titleKo, description, href, icon, count, accentColor }: CategoryCardProps) {
  const colorClasses = {
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      bgHover: 'group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-600',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      bgHover: 'group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'hover:border-orange-300 dark:hover:border-orange-600',
    },
  }

  const colors = colorClasses[accentColor]

  return (
    <Link
      href={href}
      className={`group block p-6 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 ${colors.border} hover:shadow-lg transition-all`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-3 ${colors.bg} rounded-lg ${colors.text} ${colors.bgHover} transition-colors`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">{titleKo}</p>
          <p className="text-sm text-stone-600 dark:text-stone-300">{description}</p>
          {count !== undefined && (
            <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
              {count} documents
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

interface CategoryCardsProps {
  docsCount: number
  blogCount: number
}

export function CategoryCards({ docsCount, blogCount }: CategoryCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-10">
      <CategoryCard
        title="Claude Docs"
        titleKo="Claude Code 문서"
        description="Claude Code 공식 문서의 영한 병렬 번역"
        href="/read/claude-docs/overview"
        icon={<BookOpen size={24} />}
        count={docsCount}
        accentColor="amber"
      />
      <CategoryCard
        title="Claude Blog"
        titleKo="Claude 블로그"
        description="Anthropic 블로그 포스트 번역"
        href="/blog"
        icon={<Newspaper size={24} />}
        count={blogCount}
        accentColor="orange"
      />
    </div>
  )
}
