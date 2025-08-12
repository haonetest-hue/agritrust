import { type NextRequest, NextResponse } from "next/server"
import { didService } from "@/lib/identity/did-service"
import { authMiddleware, requireRole } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  // Apply auth middleware
  const authResult = await authMiddleware(request)
  if (authResult.status !== 200) return authResult

  // Require auditor role for issuing credentials
  const roleResult = await requireRole(["auditor"])(request)
  if (roleResult.status !== 200) return roleResult

  try {
    const body = await request.json()
    const { subjectDID, certificationType, metadata, validUntil } = body
    const issuerDID = request.headers.get("x-user-did")!

    // Validate required fields
    if (!subjectDID || !certificationType) {
      return NextResponse.json({ error: "Subject DID and certification type are required" }, { status: 400 })
    }

    // Issue credential
    const credential = await didService.issueCertificationCredential(
      issuerDID,
      subjectDID,
      certificationType,
      metadata || {},
      validUntil ? new Date(validUntil) : undefined,
    )

    return NextResponse.json({
      message: "Credential issued successfully",
      credential,
    })
  } catch (error: any) {
    console.error("Credential issuance error:", error)
    return NextResponse.json({ error: error.message || "Failed to issue credential" }, { status: 500 })
  }
}
