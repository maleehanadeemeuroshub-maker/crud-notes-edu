/** Slow, blurred gradient blobs fixed behind all page content. Pure CSS animation — cheap and reduced-motion safe. */
export function AmbientBackground() {
  return (
    <div className="ambient-layer no-print" aria-hidden="true">
      <div className="ambient-blob ambient-blob-a" />
      <div className="ambient-blob ambient-blob-b" />
      <div className="ambient-blob ambient-blob-c" />
    </div>
  )
}
