import * as mock from '../mock/data.js'
import { USE_MOCK, request, wait } from './client.js'

export async function login(email, password) {
  if (!USE_MOCK) return request('/auth/login', { method: 'POST', body: { email, password } })
  await wait()
  return { token: 'mock-token', user: mock.currentUser }
}

export async function signup({ name, email, password, department, year }) {
  if (!USE_MOCK) return request('/auth/signup', { method: 'POST', body: { name, email, password, department, year } })
  await wait()
  return { token: 'mock-token', user: { ...mock.currentUser, name, email, department, year } }
}
