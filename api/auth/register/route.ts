import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, type, location } = body

    // Validate required fields
    if (!name || !email || !password || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate stakeholder type
    const validTypes = ["farmer", "cooperative", "offtaker", "processor", "logistics", "auditor"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid stakeholder type" }, { status: 400 })
    }

    // Register user
    const result = await authService.register({
      name,
      email,
      password,
      type,
      location,
    })

    return NextResponse.json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
      did: result.did,
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
