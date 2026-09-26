import { component$, useContext } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { domainOf, type StoryData } from '@repo/hn-core'
import { hide, markRead, PrefsContext } from '~/lib/prefs'
import { RelTime } from './rel-time'

interface Props {
  story: StoryData
  heading?: 'h1' | 'h2'
  showText?: boolean
  hideable?: boolean
}

export const Story = component$<Props>(({ story, heading, showText, hideable }) => {
  const prefs = useContext(PrefsContext)
  const Heading = heading ?? 'h2'
  const commentsHref = `/comments/${story.id}`
  const domain = domainOf(story.url)
  const comments = story.descendants ?? 0
  const title = <Heading class="story-title">{story.title}</Heading>

  return (
    <article class={['story', { 'story--read': prefs.read.includes(story.id) }]}>
      {story.url ? (
        <>
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick$={() => markRead(prefs, story.id)}
          >
            {title}
          </a>
          {domain && <span class="story-domain">({domain})</span>}
        </>
      ) : (
        <Link href={commentsHref} prefetch={false} onClick$={() => markRead(prefs, story.id)}>
          {title}
        </Link>
      )}

      <p class="subtitle">
        {story.type !== 'job' && (
          <>
            {story.score} points by{' '}
            <Link href={`/user/${story.by}`} prefetch={false}>
              <strong>{story.by}</strong>
            </Link>{' '}
          </>
        )}
        <RelTime unix={story.time} />
        {story.type !== 'job' && (
          <>
            {' | '}
            <Link href={commentsHref} prefetch={false} onClick$={() => markRead(prefs, story.id)}>
              {comments === 0 ? 'discuss' : `${comments} comment${comments === 1 ? '' : 's'}`}
            </Link>
          </>
        )}
        {hideable && (
          <>
            {' | '}
            <button class="link-button" type="button" onClick$={() => hide(prefs, story.id)}>
              hide<span class="visually-hidden"> story</span>
            </button>
          </>
        )}
      </p>

      {showText && story.text && <div class="item-text" dangerouslySetInnerHTML={story.text} />}
    </article>
  )
})
