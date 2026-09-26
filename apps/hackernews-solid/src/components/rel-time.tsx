import { isoTime, timeAgo } from '@repo/hn-core'

/** Relative time. Hydration keeps the server's text if it has ticked over since. */
export function RelTime(props: { unix: number }) {
  return <time datetime={isoTime(props.unix)}>{timeAgo(props.unix)}</time>
}
