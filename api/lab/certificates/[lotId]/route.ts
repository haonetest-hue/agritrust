import { type NextRequest, NextResponse } from "next/server"
import { labAttestationService } from "@/lib/lab/attestation-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest, { params }: { params: { lotId: string } }) {
  try {
    const { lotId } = params
    const { searchParams } = new URL(request.url)
    const challenge = searchParams.get("challenge")

    if (!lotId) {
      return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
    }

    // Verify authentication for requester DID
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create quality certificate presentation
    const presentation = await labAttestationService.createQualityCertificatePresentation(
      lotId,
      authResult.user.did,
      challenge || undefined,
    )

    return NextResponse.json({
      success: true,
      presentation,
    })
  } catch (error) {
    console.error("Error creating quality certificate:", error)
    return NextResponse.json({ error: "Failed to create quality certificate" }, { status: 500 })
  }
}
