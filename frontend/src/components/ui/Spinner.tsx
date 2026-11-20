// ─────────────────────────────────────────────────────────────
//  Small spinning loader shown while a list is loading.
// ─────────────────────────────────────────────────────────────
export default function Spinner() {
  return (
    <div className="flex justify-center py-10" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink border-t-hl-yellow" />
    </div>
  )
}
