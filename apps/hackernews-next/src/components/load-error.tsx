'use client'

export function LoadError({ what }: { what: string }) {
  return (
    <p className="status" role="alert">
      Couldn&apos;t load {what}. Hacker News may be slow right now;{' '}
      <button className="link-button" type="button" onClick={() => location.reload()}>
        try again
      </button>
      .
    </p>
  )
}
