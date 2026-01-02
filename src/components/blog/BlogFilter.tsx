'use client'

import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a'

interface FilterSection {
  title: string
  options: string[]
}

interface BlogFilterProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  availableCategories: string[]
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

export function BlogFilter({
  sortBy,
  onSortChange,
  selectedCategories,
  onCategoryChange,
  availableCategories,
}: BlogFilterProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'Alphabetically (A to Z)' },
    { value: 'z-a', label: 'Alphabetically (Z to A)' },
  ]

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const filterContent = (
    <div className="space-y-0">
      {/* Sort by */}
      <CollapsibleSection title="Sort by" defaultOpen>
        {sortOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value={option.value}
              checked={sortBy === option.value}
              onChange={() => onSortChange(option.value)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">{option.label}</span>
          </label>
        ))}
      </CollapsibleSection>

      {/* Category */}
      <CollapsibleSection title="Category" defaultOpen>
        {availableCategories.map((category) => (
          <label key={category} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">{category}</span>
          </label>
        ))}
      </CollapsibleSection>
    </div>
  )

  return (
    <>
      {/* 모바일 필터 버튼 */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-16 left-3 z-40 p-2 bg-white dark:bg-slate-900 rounded-md shadow-md border border-slate-200 dark:border-slate-700"
        aria-label="Open filters"
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* 데스크톱 필터 사이드바 */}
      <aside className="hidden lg:block w-56 flex-shrink-0 pr-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Filter and sort
        </h2>
        {filterContent}
      </aside>

      {/* 모바일 오버레이 필터 */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Filter and sort
              </h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </aside>
        </>
      )}
    </>
  )
}
