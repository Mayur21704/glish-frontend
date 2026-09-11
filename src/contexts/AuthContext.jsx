import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY_TOKEN = 'glish_auth_token'
const STORAGE_KEY_USER = 'glish_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Initialize session strictly from stored user token
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN)
      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER)

      if (savedToken && savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr)
          setToken(savedToken)
          setUser(parsedUser)

          // Verify with server in background
          fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          })
            .then(res => {
              if (res.ok) return res.json()
              throw new Error('Token expired')
            })
            .then(data => {
              if (data.user) {
                setUser(data.user)
                localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user))
              }
            })
            .catch(() => {
              // Token invalid/expired: clear state
              setToken(null)
              setUser(null)
              localStorage.removeItem(STORAGE_KEY_TOKEN)
              localStorage.removeItem(STORAGE_KEY_USER)
            })
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY_TOKEN)
          localStorage.removeItem(STORAGE_KEY_USER)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Login with real credentials
  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Invalid email or password')
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(STORAGE_KEY_TOKEN, data.token)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user))
    return data.user
  }, [])

  // Register new real account
  const register = useCallback(async (name, email, password, role = 'Learner') => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account')
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(STORAGE_KEY_TOKEN, data.token)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user))
    return data.user
  }, [])

  // Log out current session
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)
  }, [])

  // Authenticated fetch helper that automatically adds Bearer token
  const authFetch = useCallback((url, options = {}) => {
    const headers = new Headers(options.headers || {})
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
    return fetch(url, { ...options, headers })
  }, [token])

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), [])
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    authFetch,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
