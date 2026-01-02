import { getContentsByChannel } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { BlogGrid } from '@/components/blog/BlogGrid'

export default async function BlogPage() {
  const posts = await getContentsByChannel('claude-blog')

  return (
    <div className="min-h-screen bg-[#F5F3EF] dark:bg-slate-950">
      <Header title="Blog" />
      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* 페이지 헤더 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Blog</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Product news and best practices for teams building with Claude.
          </p>
        </div>

        {/* 블로그 그리드 */}
        <BlogGrid posts={posts} />
      </main>
    </div>
  )
}
