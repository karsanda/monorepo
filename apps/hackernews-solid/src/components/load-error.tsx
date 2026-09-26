export function LoadError(props: { what: string; retry: () => void }) {
  return (
    <p class="status" role="alert">
      Couldn't load {props.what}. Hacker News may be slow right now;{' '}
      <button class="link-button" type="button" onClick={() => props.retry()}>
        try again
      </button>
      .
    </p>
  )
}
