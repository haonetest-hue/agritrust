import { type NextRequest, NextResponse } from "next/server"
import { authService } from "./auth-service"

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return { success: false, error: "No token provided" }
  }

  const user = await authService.verifyToken(token)
  if (!user) {
    return { success: false, error: "Invalid token" }
  }

  return { success: true, user }
}

export async function verifyAuth(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return { success: false, error: "No token provided" }
  }

  try {
    const user = await authService.verifyToken(token)
    if (!user) {
      return { success: false, error: "Invalid token" }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Token verification failed" }
  }
}

// Role-based access control
export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest) => {
    const userType = request.headers.get("x-user-type")

    if (!userType || !allowedRoles.includes(userType)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    return NextResponse.next()
  }
}

// Verification requirement middleware
export function requireVerification(requiredCredentials: string[]) {
  return async (request: NextRequest) => {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const isVerified = await authService.verifyUserIdentity(userId, requiredCredentials)
    if (!isVerified) {
      return NextResponse.json({ error: "User not verified for this action" }, { status: 403 })
    }

    return NextResponse.next()
  }
}
