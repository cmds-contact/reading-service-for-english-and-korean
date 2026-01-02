import { notFound } from 'next/navigation'
import { getAllContentPaths, getContentPair, getContentsByChannel } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { ParallelReader } from '@/components/reader/ParallelReader'
import { DocsLayout } from '@/components/docs/DocsLayout'
import { BlogLayout } from '@/components/blog/BlogLayout'

interface PageProps {
  params: Promise<{
    channel: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const paths = getAllContentPaths()
  return paths.map(({ channel, slug }) => ({ channel, slug }))
}

export default async function ReadPage({ params }: PageProps) {
  const { channel, slug } = await params
  const paths = getAllContentPaths()

  const exists = paths.some((p) => p.channel === channel && p.slug === slug)
  if (!exists) {
    notFound()
  }

  const content = await getContentPair(channel, slug)

  // claude-docs 채널은 사이드바가 있는 DocsLayout 사용
  if (channel === 'claude-docs') {
    const docsContents = await getContentsByChannel('claude-docs')
    return <DocsLayout content={content} contents={docsContents} />
  }

  // claude-blog 채널은 BlogLayout 사용
  if (channel === 'claude-blog') {
    const blogPosts = await getContentsByChannel('claude-blog')
    return <BlogLayout content={content} posts={blogPosts} />
  }

  // 다른 채널은 기존 레이아웃 사용
  return (
    <>
      <Header
        title={content.meta.languages.en?.title}
        showLayoutToggle
        sourceUrl={content.meta.source.url}
      />
      <ParallelReader content={content} />
    </>
  )
}
