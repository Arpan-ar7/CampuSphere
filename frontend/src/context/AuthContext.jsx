// Who is logged in. Use `const { user, login, logout } = useAuth()` anywhere.
import { createContext, useContext, useState } from 'react'
import { api } from '../api/index.js'

const AuthContext = createContext(null)

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const save = ({ token, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const login = async (email, password) => save(await api.login(email, password))
  const signup = async (data) => save(await api.signup(data))
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Hook to read this context (lives next to its provider on purpose)
// oxlint-disable-next-line react/only-export-components
export const useAuth = () => useContext(AuthContext)
