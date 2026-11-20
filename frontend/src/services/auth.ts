// ─────────────────────────────────────────────────────────────
//  Log in and sign up.  POST /auth/login, POST /auth/signup  → { token, user }
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import { USE_MOCK, request, wait } from '@/services/client'
import type { Session, SignupData } from '@/types'

export async function login(email: string, password: string): Promise<Session> {
  if (!USE_MOCK) return request<Session>('/auth/login', { method: 'POST', body: { email, password } })
  await wait()
  return { token: 'mock-token', user: mock.currentUser }
}

export async function signup({ name, email, password, department, year }: SignupData): Promise<Session> {
  if (!USE_MOCK) return request<Session>('/auth/signup', { method: 'POST', body: { name, email, password, department, year } })
  await wait()
  return { token: 'mock-token', user: { ...mock.currentUser, name, email, department, year: Number(year) } }
}
