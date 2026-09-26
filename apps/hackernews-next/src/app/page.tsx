import type { Metadata } from 'next'
import { StoriesPage, storiesMetadata } from '@/components/stories-page'
import { APP_NAME } from '@/lib/meta'

export async function generateMetadata({ searchParams }: PageProps<'/'>): Promise<Metadata> {
  const { title } = await storiesMetadata('topstories', searchParams)
  // The layout's title template only applies to child segments, not to this page beside it.
  return { title: { absolute: `${title} | ${APP_NAME}` } }
}

export default function Home({ searchParams }: PageProps<'/'>) {
  return <StoriesPage type="topstories" searchParams={searchParams} />
}
