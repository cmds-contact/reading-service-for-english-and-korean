import { notFound } from 'next/navigation'
import { getAllContentSlugs, getContentPair } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { ParallelReader } from '@/components/reader/ParallelReader'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getAllContentSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ReadPage({ params }: PageProps) {
  const slugs = getAllContentSlugs()

  if (!slugs.includes(params.slug)) {
    notFound()
  }

  const content = await getContentPair(params.slug)

  return (
    <>
      <Header title={content.english.meta.title} showLayoutToggle />
      <ParallelReader content={content} />
    </>
  )
}
