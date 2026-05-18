import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../utils/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken')

      if (!token) {
        setIsAuthLoading(false)
        return
      }

      try {
        const data = await getCurrentUser()
        setUser(data.user)
      } catch {
        localStorage.removeItem('authToken')
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    loadUser()
  }, [])

  const register = async (payload) => {
    const data = await registerUser(payload)
    localStorage.setItem('authToken', data.token)
    setUser(data.user)
    return data.user
  }

  const login = async (payload) => {
    const data = await loginUser(payload)
    localStorage.setItem('authToken', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      register,
      login,
      logout,
    }),
    [user, isAuthLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
