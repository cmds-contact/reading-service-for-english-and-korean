'use client'

import { useRef, useEffect } from 'react'
import { ParsedParagraph } from '@/types/content'
import { cn } from '@/lib/utils'

interface ParagraphProps {
  paragraph: ParsedParagraph
  isActive: boolean
  onClick: () => void
}

export function Paragraph({ paragraph, isActive, onClick }: ParagraphProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'p-3 rounded-lg cursor-pointer transition-all duration-200',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        isActive && 'bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400'
      )}
      dangerouslySetInnerHTML={{ __html: paragraph.content }}
    />
  )
}
