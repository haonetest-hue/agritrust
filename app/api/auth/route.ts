import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-service"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const body = await request.json()

    switch (action) {
      case "login": {
        const { email, password } = body
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }
        const result = await authService.login({ email, password })
        return NextResponse.json({
          message: "Login successful",
          user: result.user,
          token: result.token,
        })
      }

      case "register": {
        const { name, email, password, type, location } = body
        if (!name || !email || !password || !type) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        const validTypes = ["farmer", "cooperative", "offtaker", "processor", "logistics", "auditor"]
        if (!validTypes.includes(type)) {
          return NextResponse.json({ error: "Invalid stakeholder type" }, { status: 400 })
        }
        const result = await authService.register({ name, email, password, type, location })
        return NextResponse.json({
          message: "User registered successfully",
          user: result.user,
          token: result.token,
          did: result.did,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}
