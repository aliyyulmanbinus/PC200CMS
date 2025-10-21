"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_authenticated")
      setIsAuthenticated(stored === "true")
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    // Validate credentials
    if (email === "admin@gmail.com" && password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
