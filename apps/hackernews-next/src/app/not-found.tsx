import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME } from '@/lib/meta'

// Beside the root layout, so its title template doesn't apply here.
export const metadata: Metadata = { title: { absolute: `Not found | ${APP_NAME}` } }

export default function NotFound() {
  return (
    <div className="status">
      <h1>Not found</h1>
      <p>
        That page, story or user doesn&apos;t exist. <Link href="/">Back to the front page</Link>
      </p>
    </div>
  )
}
