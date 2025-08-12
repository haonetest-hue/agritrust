import { type NextRequest, NextResponse } from "next/server"
import { didService } from "@/lib/identity/did-service"
import { authMiddleware } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  // Apply auth middleware
  const authResult = await authMiddleware(request)
  if (authResult.status !== 200) return authResult

  try {
    const body = await request.json()
    const { name, type, location } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 })
    }

    // Create DID
    const identity = await didService.createStakeholderDID(name, type, location)

    return NextResponse.json({
      message: "DID created successfully",
      identity,
    })
  } catch (error: any) {
    console.error("DID creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create DID" }, { status: 500 })
  }
}
