import { isStoryType } from '@repo/hn-core'
import { notFound } from 'next/navigation'
import { StoriesPage, storiesMetadata } from '@/components/stories-page'

export async function generateMetadata({ params, searchParams }: PageProps<'/[type]'>) {
  const { type } = await params
  return isStoryType(type) ? storiesMetadata(type, searchParams) : {}
}

export default async function StoryTypePage({ params, searchParams }: PageProps<'/[type]'>) {
  const { type } = await params
  if (!isStoryType(type)) notFound()
  return <StoriesPage type={type} searchParams={searchParams} />
}
