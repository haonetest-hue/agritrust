import { type NextRequest, NextResponse } from "next/server"
import { labAttestationService } from "@/lib/lab/attestation-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and lab role
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (authResult.user.type !== "auditor") {
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

    // Validate required fields
    if (!lotId || !testId || !testType || !results || overallGrade === undefined || !overallStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create test result object
    const testResult = {
      lotId,
      testId,
      labDID: authResult.user.did,
      labName: authResult.user.name,
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

    // Create lab attestation with verifiable credential
    const attestation = await labAttestationService.createLabAttestation(
      authResult.user.did,
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
  } catch (error) {
    console.error("Error creating lab attestation:", error)
    return NextResponse.json({ error: "Failed to create lab attestation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lotId = searchParams.get("lotId")
    const labDID = searchParams.get("labDID")

    if (lotId) {
      // Get attestations for specific lot
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

    // Return all attestations (with pagination in production)
    return NextResponse.json({
      success: true,
      attestations: [],
    })
  } catch (error) {
    console.error("Error fetching lab attestations:", error)
    return NextResponse.json({ error: "Failed to fetch attestations" }, { status: 500 })
  }
}
