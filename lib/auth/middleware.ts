import { type NextRequest, NextResponse } from "next/server"
import { authService } from "./auth-service"

export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, error: "No token provided" }
    }

    const token = authHeader.substring(7)
    const user = await authService.verifyToken(token)

    if (!user) {
      return { success: false, error: "Invalid token" }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Authentication failed" }
  }
}

export async function authMiddleware(request: NextRequest) {
  const authResult = await verifyAuth(request)

  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  // Add user info to headers for downstream use
  request.headers.set("x-user-id", authResult.user!.id)
  request.headers.set("x-user-did", authResult.user!.did || "")
  request.headers.set("x-user-type", authResult.user!.type)

  return NextResponse.next()
}

export function requireRole(roles: string[]) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    if (!roles.includes(authResult.user!.type)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    return NextResponse.next()
  }
}
