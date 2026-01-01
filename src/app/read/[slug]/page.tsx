import { notFound } from 'next/navigation'
import { getAllContentSlugs, getContentPair } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { ParallelReader } from '@/components/reader/ParallelReader'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ReadPage({ params }: PageProps) {
  const { slug } = await params
  const slugs = getAllContentSlugs()

  if (!slugs.includes(slug)) {
    notFound()
  }

  const content = await getContentPair(slug)

  return (
    <>
      <Header title={content.meta.languages.en?.title} showLayoutToggle />
      <ParallelReader content={content} />
    </>
  )
}
