// ─────────────────────────────────────────────────────────────
//  ROUTE /u/<handle> — a student's profile, e.g. /u/arpan. "[handle]" is filled from the URL.
// ─────────────────────────────────────────────────────────────
import ProfileView from './ProfileView'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return <ProfileView />
}
