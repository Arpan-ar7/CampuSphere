'use client'

// ─────────────────────────────────────────────────────────────
//  Log in / sign up screen (route /login).
//  Already logged in? Sends you to the feed. Demo mode: any email + password works.
//  Uses: useAuth().login / signup → services/auth.ts
// ─────────────────────────────────────────────────────────────
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, MessagesSquare, Users, type LucideIcon } from 'lucide-react'
import { LIMITS, UNIVERSITY } from '@/config'
import { useAuth } from '@/context/AuthContext'
import CampusBackdrop from '@/components/layout/CampusBackdrop'
import Logo from '@/components/layout/Logo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Tape } from '@/components/ui/Decorations'
import { Field, Input, Select } from '@/components/ui/FormFields'
import Highlight from '@/components/ui/Highlight'
import FullPageLoader from '@/components/ui/FullPageLoader'
import TabChips from '@/components/ui/TabChips'
import { cn } from '@/utils/cn'
import { errorMessage } from '@/utils/errors'
import type { HighlightColor, SignupData } from '@/types'

type Mode = 'login' | 'signup'

const FEATURES: Array<{ icon: LucideIcon; title: string; text: string; color: HighlightColor; tilt: string }> = [
  { icon: BookOpen, title: 'Share notes', text: 'Swap notes and old papers with your batch.', color: 'yellow', tilt: '-rotate-2' },
  { icon: MessagesSquare, title: 'Post & chat', text: 'A campus feed and DMs, only for your university.', color: 'lilac', tilt: 'rotate-1' },
  { icon: Users, title: 'Find a team', text: 'Team up for hackathons, research and projects.', color: 'mint', tilt: '-rotate-1' },
]

export default function LoginView() {
  const { user, login, signup } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState<SignupData>({ name: '', email: '', password: '', department: '', year: 1 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (key: keyof SignupData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await signup(form)
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  // Already logged in (or just logged in) → go to the feed
  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  // Still checking the saved login, or already logged in → show the loader
  if (user !== null) return <FullPageLoader />

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-2">
      <CampusBackdrop full />

      <div>
        <Logo />
        <h1 className="mt-8 font-display text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
          Your whole campus, in <Highlight color="pink">one notebook.</Highlight>
        </h1>
        <p className="mt-4 font-hand text-3xl leading-none">made by students, for students ✏</p>
        <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text, color, tilt }) => (
            <Card key={title} color={color} className={cn('p-4', tilt)}>
              <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-card"><Icon className="h-[18px] w-[18px]" /></span>
              <p className="mt-3 font-display font-extrabold">{title}</p>
              <p className="mt-1 text-sm text-ink/75">{text}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="relative mx-auto w-full max-w-md p-6 sm:p-8">
        <Tape className="-top-2.5 left-10 -rotate-2" />
        <h2 className="font-display text-3xl font-extrabold">{mode === 'login' ? 'Welcome back' : 'Join your campus'}</h2>
        <p className="mt-1 text-sm text-ink/70">Use your {UNIVERSITY.name} email.</p>

        <TabChips
          label="Log in or sign up"
          tabs={[{ id: 'login', label: 'Log in' }, { id: 'signup', label: 'Sign up' }]}
          value={mode}
          onChange={setMode}
          className="mt-5"
        />

        <form onSubmit={submit} className="mt-5 space-y-4">
          {mode === 'signup' && (
            <Field label="Full name">
              <Input required maxLength={LIMITS.name} autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" />
            </Field>
          )}
          <Field label="University email">
            <Input required type="email" maxLength={LIMITS.email} autoComplete="email" value={form.email} onChange={set('email')} placeholder={UNIVERSITY.emailHint} />
          </Field>
          <Field label="Password">
            <Input required type="password" minLength={mode === 'signup' ? 8 : undefined} maxLength={LIMITS.password} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={set('password')} placeholder="••••••••" />
          </Field>
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department">
                <Input required maxLength={LIMITS.department} value={form.department} onChange={set('department')} placeholder="e.g. CSE" />
              </Field>
              <Field label="Year">
                <Select value={form.year} onChange={set('year')}>
                  {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </Select>
              </Field>
            </div>
          )}

          {error && <p className="rounded-xl border-2 border-ink bg-hl-pink px-3 py-2 text-sm font-bold">{error}</p>}

          <Button size="xl" color="yellow" disabled={loading} className="w-full">
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </Button>
        </form>
        <p className="mt-5 text-center font-hand text-xl text-ink/60">demo mode: any email + password works</p>
      </Card>
    </div>
  )
}
