'use client'

import Link from 'next/link'
import { BookOpen, Newspaper, FileText } from 'lucide-react'

interface CategoryCardProps {
  title: string
  titleKo: string
  description: string
  href: string
  icon: React.ReactNode
  count?: number
}

function CategoryCard({ title, titleKo, description, href, icon, count }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{titleKo}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
          {count !== undefined && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
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
  otherCount: number
}

export function CategoryCards({ docsCount, blogCount, otherCount }: CategoryCardsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      <CategoryCard
        title="Claude Docs"
        titleKo="Claude Code 문서"
        description="Claude Code 공식 문서의 영한 병렬 번역"
        href="/read/claude-docs/overview"
        icon={<BookOpen size={24} />}
        count={docsCount}
      />
      <CategoryCard
        title="Claude Blog"
        titleKo="Claude 블로그"
        description="Anthropic 블로그 포스트 번역"
        href="/read/claude-blog/building-skills-for-claude-code"
        icon={<Newspaper size={24} />}
        count={blogCount}
      />
      {otherCount > 0 && (
        <CategoryCard
          title="Other Sources"
          titleKo="기타 자료"
          description="Google 등 기타 출처의 기술 문서"
          href="/read/google/meta-prompting-veo"
          icon={<FileText size={24} />}
          count={otherCount}
        />
      )}
    </div>
  )
}
