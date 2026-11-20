// ─────────────────────────────────────────────────────────────
//  Turns anything that was thrown into a short message we can show to students.
//  (In TypeScript a caught error is `unknown`: it might not be an Error object.)
// ─────────────────────────────────────────────────────────────
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'string' && err) return err
  return fallback
}
