import { component$ } from '@builder.io/qwik'
import { isoTime, timeAgo } from '@repo/hn-core'

/** Relative time, rendered on the server; Qwik resumes without re-rendering it. */
export const RelTime = component$<{ unix: number }>(({ unix }) => (
  <time dateTime={isoTime(unix)}>{timeAgo(unix)}</time>
))
