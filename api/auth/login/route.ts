import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login user
    const result = await authService.login({ email, password })

    return NextResponse.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}
