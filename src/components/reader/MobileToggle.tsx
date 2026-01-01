'use client'

import { useReaderStore } from '@/stores/readerStore'
import { cn } from '@/lib/utils'

export function MobileToggle() {
  const { activeLanguage, setActiveLanguage } = useReaderStore()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1 bg-slate-800 dark:bg-slate-200 rounded-full shadow-lg">
        <button
          onClick={() => setActiveLanguage('en')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeLanguage === 'en'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-300 dark:text-slate-600'
          )}
        >
          English
        </button>
        <button
          onClick={() => setActiveLanguage('ko')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeLanguage === 'ko'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-300 dark:text-slate-600'
          )}
        >
          한국어
        </button>
      </div>
    </div>
  )
}
