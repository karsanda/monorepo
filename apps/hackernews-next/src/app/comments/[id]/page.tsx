import type { ThreadComment } from '@repo/hn-core'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Comment } from '@/components/comment'
import { LoadError } from '@/components/load-error'
import { Loading } from '@/components/loading'
import { Story } from '@/components/story'
import { Time } from '@/components/time'
import { loadItem, loadThread } from '@/lib/data'

export async function generateMetadata({ params }: PageProps<'/comments/[id]'>): Promise<Metadata> {
  const item = await loadItem((await params).id)
  if (!item) return {}
  return { title: item.type === 'comment' ? `Comment by ${item.by}` : item.title }
}

export default async function CommentsPage({ params }: PageProps<'/comments/[id]'>) {
  const { id } = await params
  const item = await loadItem(id)
  if (!item) notFound()

  return (
    <>
      {item.type === 'comment' ? (
        <article className="comment">
          <h1 className="comment-header">
            <Link href={`/user/${item.by}`}>{item.by}</Link>
            &nbsp;
            <Time unix={item.time} />
            &nbsp;|&nbsp;<Link href={`/comments/${item.parent}`}>parent</Link>
          </h1>
          <div className="comment-content" dangerouslySetInnerHTML={{ __html: item.text }} />
        </article>
      ) : (
        <Story story={item} heading="h1" showText />
      )}

      <section className="comment-list" aria-label="Comments">
        <Suspense fallback={<Loading label="Loading comments" />}>
          <Thread thread={loadThread(id)} />
        </Suspense>
      </section>
    </>
  )
}

async function Thread({ thread }: { thread: Promise<ThreadComment[]> }) {
  const comments = await thread.catch(() => null)
  if (!comments) return <LoadError what="comments" />
  if (!comments.length) return <p className="status">No comments yet.</p>
  return comments.map((comment) => <Comment key={comment.id} comment={comment} />)
}
