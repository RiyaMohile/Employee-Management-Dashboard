import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('empdesk_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simple validation
      if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        reject({ email: 'Please enter a valid email' })
        return
      }
      if (!password || password.length < 6) {
        reject({ password: 'Password must be at least 6 characters' })
        return
      }
      
      // Demo login - accept any email/password combo that passes validation
      const userData = {
        email,
        name: email.split('@')[0],
        avatar: email[0].toUpperCase()
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('empdesk_user', JSON.stringify(userData))
      resolve(userData)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('empdesk_user')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}