'use client'

import Link from 'next/link'
import { Home, ExternalLink } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LayoutToggle } from '../reader/LayoutToggle'

interface HeaderProps {
  title?: string
  showLayoutToggle?: boolean
  sourceUrl?: string
}

export function Header({ title, showLayoutToggle = false, sourceUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="w-full px-4 h-14 flex items-center gap-2">
        {/* 홈 버튼 - 고정 크기 */}
        <Link
          href="/"
          className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Home"
        >
          <Home size={20} />
        </Link>

        {/* 제목 - 유연하게 줄어듦 */}
        {title && (
          <h1 className="flex-1 min-w-0 text-lg font-semibold truncate">{title}</h1>
        )}

        {/* 버튼 영역 - 고정 크기 */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <span className="hidden sm:inline">원문 보기</span>
              <ExternalLink size={16} />
            </a>
          )}
          {showLayoutToggle && <LayoutToggle />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
