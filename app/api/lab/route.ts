import { type NextRequest, NextResponse } from "next/server"
import { labAttestationService } from "@/lib/lab/attestation-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const lotId = searchParams.get("lotId")
    const attestationId = searchParams.get("attestationId")
    const challenge = searchParams.get("challenge")

    switch (action) {
      case "attestations":
        if (lotId) {
          const attestations = await labAttestationService.getAttestationsForLot(lotId)
          return NextResponse.json({
            success: true,
            attestations: attestations.map((a) => ({
              id: a.id,
              testId: a.testResult.testId,
              lotId: a.testResult.lotId,
              labName: a.testResult.labName,
              testType: a.testResult.testType,
              overallGrade: a.testResult.overallGrade,
              overallStatus: a.testResult.overallStatus,
              createdAt: a.createdAt,
              expiresAt: a.expiresAt,
            })),
          })
        }
        return NextResponse.json({ success: true, attestations: [] })

      case "verify":
        if (!attestationId) {
          return NextResponse.json({ error: "Attestation ID is required" }, { status: 400 })
        }
        const verification = await labAttestationService.verifyAttestation(attestationId)
        return NextResponse.json({
          success: true,
          verification,
        })

      case "certificate":
        if (!lotId) {
          return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
        }
        const authResult = await verifyAuth(request)
        if (!authResult.success) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const presentation = await labAttestationService.createQualityCertificatePresentation(
          lotId,
          authResult.user!.did || "",
          challenge || undefined,
        )
        return NextResponse.json({
          success: true,
          presentation,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Lab error:", error)
    return NextResponse.json({ error: error.message || "Lab operation failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (authResult.user!.type !== "auditor") {
      return NextResponse.json({ error: "Only lab auditors can create attestations" }, { status: 403 })
    }

    const body = await request.json()
    const {
      lotId,
      testId,
      testType,
      results,
      overallGrade,
      overallStatus,
      methodology,
      technician,
      notes,
      testDate,
      certifications = [],
      equipment = [],
      images = [],
      documents = [],
    } = body

    if (!lotId || !testId || !testType || !results || overallGrade === undefined || !overallStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const testResult = {
      lotId,
      testId,
      labDID: authResult.user!.did || "",
      labName: authResult.user!.name,
      testDate: new Date(testDate || Date.now()),
      testType,
      results,
      overallGrade,
      overallStatus,
      certifications,
      methodology: methodology || "Standard lab procedure",
      equipment,
      technician: technician || "Lab technician",
      notes,
      images,
      documents,
    }

    const attestation = await labAttestationService.createLabAttestation(
      authResult.user!.did || "",
      testResult,
      90, // 90 days expiration
    )

    return NextResponse.json({
      success: true,
      attestation: {
        id: attestation.id,
        testId: attestation.testResult.testId,
        lotId: attestation.testResult.lotId,
        overallGrade: attestation.testResult.overallGrade,
        overallStatus: attestation.testResult.overallStatus,
        ipfsHash: attestation.ipfsHash,
        hcsMessageId: attestation.hcsMessageId,
        createdAt: attestation.createdAt,
        expiresAt: attestation.expiresAt,
      },
    })
  } catch (error: any) {
    console.error("Lab attestation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create lab attestation" }, { status: 500 })
  }
}
