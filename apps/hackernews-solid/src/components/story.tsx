import { domainOf, type StoryData } from '@repo/hn-core'
import { Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { hidden, read } from '~/lib/prefs'
import { RelTime } from './rel-time'

interface Props {
  story: StoryData
  heading?: 'h1' | 'h2'
  showText?: boolean
  hideable?: boolean
}

export function Story(props: Props) {
  const commentsHref = () => `/comments/${props.story.id}`
  const comments = () => props.story.descendants ?? 0
  const markRead = () => read.add(props.story.id)
  const title = () => (
    <Dynamic component={props.heading ?? 'h2'} class="story-title">
      {props.story.title}
    </Dynamic>
  )

  return (
    <article class="story" classList={{ 'story--read': read.has(props.story.id) }}>
      <Show
        when={props.story.url}
        fallback={
          <a href={commentsHref()} onClick={markRead}>
            {title()}
          </a>
        }
      >
        {(url) => (
          <>
            <a href={url()} target="_blank" rel="noopener noreferrer" onClick={markRead}>
              {title()}
            </a>
            <Show when={domainOf(url())}>
              {(domain) => <span class="story-domain">({domain()})</span>}
            </Show>
          </>
        )}
      </Show>

      <p class="subtitle">
        <Show when={props.story.type !== 'job'}>
          {props.story.score} points by{' '}
          <a href={`/user/${props.story.by}`}>
            <strong>{props.story.by}</strong>
          </a>{' '}
        </Show>
        <RelTime unix={props.story.time} />
        <Show when={props.story.type !== 'job'}>
          {' | '}
          <a href={commentsHref()} onClick={markRead}>
            {comments() === 0 ? 'discuss' : `${comments()} comment${comments() === 1 ? '' : 's'}`}
          </a>
        </Show>
        <Show when={props.hideable}>
          {' | '}
          <button class="link-button" type="button" onClick={() => hidden.add(props.story.id)}>
            hide<span class="visually-hidden"> story</span>
          </button>
        </Show>
      </p>

      <Show when={props.showText && props.story.text}>
        {(text) => <div class="item-text" innerHTML={text()} />}
      </Show>
    </article>
  )
}
