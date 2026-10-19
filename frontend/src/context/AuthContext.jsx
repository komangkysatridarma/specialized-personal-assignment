import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { AUTH_TOKEN_KEY, clearAuthToken, setAuthToken } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearAuthToken()
    setUser(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    setAuthToken(token)
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch {
      clearAuthToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    setAuthToken(response.data.token)
    setUser(response.data.user)
    return response.data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    setAuthToken(response.data.token)
    setUser(response.data.user)
    return response.data.user
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }
  return context
}
