import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi, profileApi } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
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
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
