import { Index } from 'solid-js'

export function Loading(props: { label: string; lines?: number }) {
  return (
    <div class="status" role="status" aria-busy="true">
      <span class="visually-hidden">{props.label}</span>
      <Index each={Array.from({ length: props.lines ?? 6 })}>
        {(_, i) => <span class="skeleton" style={{ width: `${60 + ((i * 37) % 35)}%` }} />}
      </Index>
    </div>
  )
}
