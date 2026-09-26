import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Not found' }

export default function NotFound() {
  return (
    <div className="status">
      <h1>Not found</h1>
      <p>
        That page, story or user doesn&apos;t exist. <Link href="/">Back to top stories</Link>
      </p>
    </div>
  )
}
