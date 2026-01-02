import { getAllContents, getAllChannels } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { ArticleList } from '@/components/home/ArticleList'
import { CategoryCards } from '@/components/home/CategoryCards'

export default async function HomePage() {
  const contents = await getAllContents()
  const channels = getAllChannels()

  // 채널별 콘텐츠 수 계산 (claude-docs, claude-blog만 표시)
  const docsCount = contents.filter((c) => c.channel === 'claude-docs').length
  const blogCount = contents.filter((c) => c.channel === 'claude-blog').length

  // Google 등 기타 콘텐츠 필터링
  const filteredContents = contents.filter(
    (c) => c.channel === 'claude-docs' || c.channel === 'claude-blog'
  )
  const filteredChannels = channels.filter(
    (c) => c === 'claude-docs' || c === 'claude-blog'
  )

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Reading Service</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          영한 병렬 읽기 서비스 - English-Korean Parallel Reading
        </p>

        {/* 카테고리 카드 */}
        <CategoryCards docsCount={docsCount} blogCount={blogCount} />

        {/* 최근 문서 목록 */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">All Articles</h2>
        <ArticleList contents={filteredContents} channels={filteredChannels} />
      </main>
    </>
  )
}
