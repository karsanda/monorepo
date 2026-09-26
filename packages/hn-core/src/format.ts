import { format, formatDistance } from 'date-fns'

/** "3 hours ago" for a Unix timestamp in seconds. */
export function timeAgo(unixSeconds: number, now: Date = new Date()): string {
  return formatDistance(unixSeconds * 1000, now, { addSuffix: true })
}

/** "October 09, 2006" for a Unix timestamp in seconds, in local time. */
export function formatJoinDate(unixSeconds: number): string {
  return format(unixSeconds * 1000, 'MMMM dd, yyyy')
}

/** ISO string for `<time datetime>`. */
export function isoTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString()
}

/** Host of a story URL without a leading `www.`, or undefined for missing or invalid URLs. */
export function domainOf(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return undefined
  }
}
