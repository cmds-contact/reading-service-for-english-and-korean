'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ContentListItem } from '@/types/content'

interface ArticleListProps {
  contents: ContentListItem[]
  channels: string[]
}

export function ArticleList({ contents, channels }: ArticleListProps) {
  const [currentChannel, setCurrentChannel] = useState('all')

  const filteredContents =
    currentChannel === 'all'
      ? contents
      : contents.filter((item) => item.meta.channel === currentChannel)

  return (
    <>
      {/* 채널 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCurrentChannel('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentChannel === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {channels.map((channel) => (
          <button
            key={channel}
            onClick={() => setCurrentChannel(channel)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentChannel === channel
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {channel}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredContents.map((item) => (
          <Link
            key={`${item.channel}/${item.slug}`}
            href={`/read/${item.channel}/${item.slug}`}
            className="block p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {item.meta.languages.en?.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {item.meta.languages.ko?.title}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>{item.meta.created}</span>
                {item.meta.channel && (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                    {item.meta.channel}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredContents.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-12">
          No articles found.
        </p>
      )}
    </>
  )
}
