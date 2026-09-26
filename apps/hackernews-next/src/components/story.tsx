'use client'

import { domainOf, type StoryData } from '@repo/hn-core'
import Link from 'next/link'
import { hidden, read, useIds } from '@/lib/prefs'
import { Time } from './time'

interface Props {
  story: StoryData
  heading?: 'h1' | 'h2'
  showText?: boolean
  hideable?: boolean
}

export function Story({
  story,
  heading: Heading = 'h2',
  showText = false,
  hideable = false,
}: Props) {
  const isRead = useIds(read).has(story.id)
  const commentsHref = `/comments/${story.id}`
  const domain = domainOf(story.url)
  const comments = story.descendants ?? 0
  const markRead = () => read.add(story.id)
  const title = <Heading className="story-title">{story.title}</Heading>

  return (
    <article className={isRead ? 'story story--read' : 'story'}>
      {story.url ? (
        <>
          <a href={story.url} target="_blank" rel="noopener noreferrer" onClick={markRead}>
            {title}
          </a>
          {domain && <span className="story-domain">({domain})</span>}
        </>
      ) : (
        <Link href={commentsHref} prefetch={false} onClick={markRead}>
          {title}
        </Link>
      )}

      <p className="subtitle">
        {story.type !== 'job' && (
          <>
            {story.score} points by{' '}
            <Link href={`/user/${story.by}`} prefetch={false}>
              <strong>{story.by}</strong>
            </Link>{' '}
          </>
        )}
        <Time unix={story.time} />
        {story.type !== 'job' && (
          <>
            {' | '}
            <Link href={commentsHref} prefetch={false} onClick={markRead}>
              {comments === 0 ? 'discuss' : `${comments} comment${comments === 1 ? '' : 's'}`}
            </Link>
          </>
        )}
        {hideable && (
          <>
            {' | '}
            <button className="link-button" type="button" onClick={() => hidden.add(story.id)}>
              hide<span className="visually-hidden"> story</span>
            </button>
          </>
        )}
      </p>

      {showText && story.text && (
        <div className="item-text" dangerouslySetInnerHTML={{ __html: story.text }} />
      )}
    </article>
  )
}
