import { type NextRequest, NextResponse } from "next/server"
import { didService } from "@/lib/identity/did-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { credential } = body

    // Validate required fields
    if (!credential) {
      return NextResponse.json({ error: "Credential is required" }, { status: 400 })
    }

    // Verify credential
    const isValid = await didService.verifyCredential(credential)

    return NextResponse.json({
      message: "Credential verification completed",
      isValid,
    })
  } catch (error: any) {
    console.error("Credential verification error:", error)
    return NextResponse.json({ error: error.message || "Failed to verify credential" }, { status: 500 })
  }
}
