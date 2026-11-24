import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi, profileApi } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!sessionStorage.getItem('token')) return null
      return JSON.parse(sessionStorage.getItem('user'))
    } catch { return null }
  })
  const [dietaryState, setDietaryState] = useState(null)

  useEffect(() => {
    if (!user) { setDietaryState(null); return }
    let active = true
    profileApi.get().then(({ data }) => {
      if (active) setDietaryState({ userId: user.userId, profile: data })
    }).catch(() => {
      if (active) setDietaryState({ userId: user.userId, error: true })
    })
    return () => { active = false }
  }, [user])

  const updateDietaryProfile = (profile) => setDietaryState({ userId: user.userId, profile })
  const currentDietaryState = dietaryState?.userId === user?.userId ? dietaryState : null

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password })
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData)
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin',
      dietaryProfile: currentDietaryState?.profile, dietaryProfileError: currentDietaryState?.error, updateDietaryProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
