// Shared helpers for every API file.
//
// While USE_MOCK is true, the api/*.js files answer from src/mock/data.js.
// When the backend is ready, create frontend/.env with:
//   VITE_USE_MOCK=false
//   VITE_API_URL=http://localhost:5000/api
// (endpoints and JSON shapes are in API_CONTRACT.md)

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Calls the real backend. Sends the login token and turns errors into readable messages.
export async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Request failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}

// Mock-only helpers
export const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms))
export const uid = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`
export const now = () => new Date().toISOString()
export const newestFirst = (key) => (a, b) => new Date(b[key]) - new Date(a[key])
