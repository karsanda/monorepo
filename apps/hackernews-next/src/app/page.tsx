import { StoriesPage, storiesMetadata } from '@/components/stories-page'

export const generateMetadata = ({ searchParams }: PageProps<'/'>) =>
  storiesMetadata('topstories', searchParams)

export default function Home({ searchParams }: PageProps<'/'>) {
  return <StoriesPage type="topstories" searchParams={searchParams} />
}
