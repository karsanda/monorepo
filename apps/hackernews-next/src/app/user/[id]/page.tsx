import { formatJoinDate } from '@repo/hn-core'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Submissions } from '@/components/submissions'
import { loadUser } from '@/lib/data'

export async function generateMetadata({ params }: PageProps<'/user/[id]'>): Promise<Metadata> {
  const data = await loadUser((await params).id)
  return data ? { title: `Profile: ${data.user.id}` } : {}
}

export default async function UserPage({ params }: PageProps<'/user/[id]'>) {
  const data = await loadUser((await params).id)
  if (!data) notFound()
  const { user, stories } = data

  return (
    <>
      <h1 className="visually-hidden">Profile: {user.id}</h1>

      <dl className="user-grid">
        <dt>User:</dt>
        <dd>{user.id}</dd>
        <dt>Karma:</dt>
        <dd>{user.karma}</dd>
        <dt>Created:</dt>
        <dd>{formatJoinDate(user.created)}</dd>
        {user.about && (
          <>
            <dt>About:</dt>
            <dd className="about" dangerouslySetInnerHTML={{ __html: user.about }} />
          </>
        )}
      </dl>

      <Submissions key={user.id} user={user.id} firstStories={stories} />
    </>
  )
}
