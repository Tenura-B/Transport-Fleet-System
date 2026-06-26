"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthUser, getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
        } else {
          setUser(currentUser)
        }
      } catch (err) {
        console.error("Failed to load user session", err)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center fleet-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) return null // Prevent rendering children if redirecting

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
