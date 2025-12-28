import Link from 'next/link'
import { getAllContents } from '@/lib/content'
import { Header } from '@/components/layout/Header'

export default async function HomePage() {
  const contents = await getAllContents()

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Articles</h1>

        <div className="grid gap-4">
          {contents.map((item) => (
            <Link
              key={item.slug}
              href={`/read/${item.slug}`}
              className="block p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {item.englishMeta.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.koreanMeta.title}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>{item.englishMeta.date}</span>
                  {item.englishMeta.company && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                      {item.englishMeta.company}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {contents.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">
            No articles found. Add markdown files to the contents folder.
          </p>
        )}
      </main>
    </>
  )
}
