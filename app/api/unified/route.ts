import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-service"
import { usdcPaymentService } from "@/lib/payments/usdc-service"
import { eventService } from "@/lib/supply-chain/event-service"
import { labAttestationService } from "@/lib/lab/attestation-service"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const id = searchParams.get("id")

  try {
    switch (action) {
      case "usdc-balance":
        if (!id) return NextResponse.json({ error: "Account ID required" }, { status: 400 })
        const balance = await usdcPaymentService.getUSDCBalance(id)
        return NextResponse.json({ accountId: id, balance, currency: "USDC" })

      case "lot-events":
        if (!id) return NextResponse.json({ error: "Lot ID required" }, { status: 400 })
        const events = await eventService.getEventsForLot(id)
        return NextResponse.json({ events, count: events.length })

      case "event-details":
        if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 })
        const eventDetails = await eventService.getEventDetails(id)
        return NextResponse.json({ event: eventDetails })

      case "verify-event":
        if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 })
        const isValid = await eventService.verifyEvent(id)
        return NextResponse.json({ eventId: id, isValid })

      case "lot-attestations":
        if (!id) return NextResponse.json({ error: "Lot ID required" }, { status: 400 })
        const attestations = await labAttestationService.getAttestationsForLot(id)
        return NextResponse.json({
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

      case "verify-attestation":
        if (!id) return NextResponse.json({ error: "Attestation ID required" }, { status: 400 })
        const verification = await labAttestationService.verifyAttestation(id)
        return NextResponse.json({ verification })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Unified API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    const body = await request.json()

    switch (action) {
      case "login":
        const { email, password } = body
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password required" }, { status: 400 })
        }
        const loginResult = await authService.login({ email, password })
        return NextResponse.json({
          message: "Login successful",
          user: loginResult.user,
          token: loginResult.token,
        })

      case "register":
        const { name, email: regEmail, password: regPassword, type, location } = body
        if (!name || !regEmail || !regPassword || !type) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        const registerResult = await authService.register({
          name,
          email: regEmail,
          password: regPassword,
          type,
          location,
        })
        return NextResponse.json({
          message: "User registered successfully",
          user: registerResult.user,
          token: registerResult.token,
          did: registerResult.did,
        })

      case "transfer-usdc":
        const { fromAccountId, toAccountId, amount } = body
        if (!fromAccountId || !toAccountId || !amount) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        const transactionId = await usdcPaymentService.transferUSDC(fromAccountId, toAccountId, amount)
        return NextResponse.json({
          success: true,
          transactionId,
          amount,
          fromAccount: fromAccountId,
          toAccount: toAccountId,
        })

      case "create-event":
        const { type: eventType, lotId, location: eventLocation, metadata, documents, images } = body
        if (!eventType || !lotId) {
          return NextResponse.json({ error: "Type and lot ID required" }, { status: 400 })
        }
        const event = await eventService.createEvent({
          type: eventType,
          lotId,
          actor: "demo-user",
          location: eventLocation,
          metadata: metadata || {},
          documents,
          images,
        })
        return NextResponse.json({ message: "Event created successfully", event })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Unified API POST error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
