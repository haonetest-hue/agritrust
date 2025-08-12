import { type NextRequest, NextResponse } from "next/server"
import { didService } from "@/lib/identity/did-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const did = searchParams.get("did")
    const credentialId = searchParams.get("credentialId")

    switch (action) {
      case "identity":
        if (!did) {
          return NextResponse.json({ error: "DID is required" }, { status: 400 })
        }
        const identity = await didService.getIdentity(did)
        return NextResponse.json({
          message: "Identity retrieved successfully",
          identity,
        })

      case "credential":
        if (!credentialId) {
          return NextResponse.json({ error: "Credential ID is required" }, { status: 400 })
        }
        const credential = await didService.getCredential(credentialId)
        return NextResponse.json({
          message: "Credential retrieved successfully",
          credential,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Identity error:", error)
    return NextResponse.json({ error: error.message || "Identity operation failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const body = await request.json()

    switch (action) {
      case "create-did": {
        const { name, type, location } = body
        if (!name || !type) {
          return NextResponse.json({ error: "Name and type are required" }, { status: 400 })
        }
        const identity = await didService.createStakeholderDID(name, type, location)
        return NextResponse.json({
          message: "DID created successfully",
          identity,
        })
      }

      case "issue-credential": {
        if (authResult.user!.type !== "auditor") {
          return NextResponse.json({ error: "Only auditors can issue credentials" }, { status: 403 })
        }
        const { subjectDID, certificationType, metadata, validUntil } = body
        if (!subjectDID || !certificationType) {
          return NextResponse.json({ error: "Subject DID and certification type are required" }, { status: 400 })
        }
        const credential = await didService.issueCertificationCredential(
          authResult.user!.did || "",
          subjectDID,
          certificationType,
          metadata || {},
          validUntil ? new Date(validUntil) : undefined,
        )
        return NextResponse.json({
          message: "Credential issued successfully",
          credential,
        })
      }

      case "verify-credential": {
        const { credential } = body
        if (!credential) {
          return NextResponse.json({ error: "Credential is required" }, { status: 400 })
        }
        const isValid = await didService.verifyCredential(credential)
        return NextResponse.json({
          message: "Credential verification completed",
          isValid,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Identity error:", error)
    return NextResponse.json({ error: error.message || "Identity operation failed" }, { status: 500 })
  }
}
