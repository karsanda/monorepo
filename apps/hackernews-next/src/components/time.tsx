import { isoTime, timeAgo } from '@repo/hn-core'

/** Relative time. The text can tick over between the server render and hydration. */
export function Time({ unix }: { unix: number }) {
  return (
    <time dateTime={isoTime(unix)} suppressHydrationWarning>
      {timeAgo(unix)}
    </time>
  )
}
