'use client'

import Link from 'next/link'
import { APP_NAME } from '@/lib/meta'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="status">
      <title>{`Something went wrong | ${APP_NAME}`}</title>
      <h1>Something went wrong</h1>
      <p>
        Hacker News may be slow right now.{' '}
        <button className="link-button" type="button" onClick={reset}>
          Try again
        </button>{' '}
        or <Link href="/">go back to top stories</Link>.
      </p>
    </div>
  )
}
