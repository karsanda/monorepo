export function Loading({ label, lines = 6 }: { label: string; lines?: number }) {
  return (
    <div className="status" role="status" aria-busy="true">
      <span className="visually-hidden">{label}</span>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="skeleton" style={{ width: `${60 + ((i * 37) % 35)}%` }} />
      ))}
    </div>
  )
}
