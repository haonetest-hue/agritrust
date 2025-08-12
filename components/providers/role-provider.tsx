"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "supplier" | "buyer" | "investor" | "lab" | null

interface RoleContextType {
  currentRole: UserRole
  setRole: (role: UserRole) => void
  isLoading: boolean
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile | null) => void
}

interface UserProfile {
  id: string
  did?: string
  walletAddress?: string
  name: string
  email: string
  role: UserRole
  verified: boolean
  reputation?: number
  createdAt: Date
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("agritrust-role") as UserRole
    const savedProfile = localStorage.getItem("agritrust-profile")

    if (savedRole) {
      setCurrentRole(savedRole)
    }

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        setUserProfile(profile)
      } catch (error) {
        console.error("Error parsing saved profile:", error)
      }
    }

    setIsLoading(false)
  }, [])

  const setRole = (role: UserRole) => {
    setCurrentRole(role)
    if (role) {
      localStorage.setItem("agritrust-role", role)
    } else {
      localStorage.removeItem("agritrust-role")
      localStorage.removeItem("agritrust-profile")
      setUserProfile(null)
    }
  }

  const setUserProfileHandler = (profile: UserProfile | null) => {
    setUserProfile(profile)
    if (profile) {
      localStorage.setItem("agritrust-profile", JSON.stringify(profile))
      setCurrentRole(profile.role)
    } else {
      localStorage.removeItem("agritrust-profile")
    }
  }

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole,
        isLoading,
        userProfile,
        setUserProfile: setUserProfileHandler,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

// Role-based route protection
export function useRoleGuard(allowedRoles: UserRole[]) {
  const { currentRole, isLoading } = useRole()

  const hasAccess = currentRole && allowedRoles.includes(currentRole)

  return {
    hasAccess,
    isLoading,
    currentRole,
  }
}
