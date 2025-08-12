import { type NextRequest, NextResponse } from "next/server"
import { labAttestationService } from "@/lib/lab/attestation-service"

export async function GET(request: NextRequest, { params }: { params: { attestationId: string } }) {
  try {
    const { attestationId } = params

    if (!attestationId) {
      return NextResponse.json({ error: "Attestation ID is required" }, { status: 400 })
    }

    // Verify the attestation
    const verification = await labAttestationService.verifyAttestation(attestationId)

    return NextResponse.json({
      success: true,
      verification,
    })
  } catch (error) {
    console.error("Error verifying attestation:", error)
    return NextResponse.json({ error: "Failed to verify attestation" }, { status: 500 })
  }
}
