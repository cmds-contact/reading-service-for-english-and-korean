'use client'

import { Columns2, Rows2, ToggleLeft } from 'lucide-react'
import { useReaderStore } from '@/stores/readerStore'
import { LayoutMode } from '@/types/content'
import { cn } from '@/lib/utils'

const layoutOptions: { mode: LayoutMode; icon: typeof Columns2; label: string }[] = [
  { mode: 'side-by-side', icon: Columns2, label: '좌우 분할' },
  { mode: 'top-bottom', icon: Rows2, label: '상하 분할' },
  { mode: 'toggle', icon: ToggleLeft, label: '토글' },
]

export function LayoutToggle() {
  const { layoutMode, setLayoutMode } = useReaderStore()

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {layoutOptions.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setLayoutMode(mode)}
          className={cn(
            'p-2 rounded-md transition-colors',
            layoutMode === mode
              ? 'bg-white dark:bg-slate-700 shadow-sm'
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
          title={label}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}
