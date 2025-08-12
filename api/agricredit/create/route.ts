import { type NextRequest, NextResponse } from "next/server"
import { AgriCreditService } from "@/lib/nft/agricredit-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { invoiceId, lotId, amount, currency, dueDate, qualityGrade, ipfsHash } = body

    // Validate required fields
    if (!invoiceId || !lotId || !amount || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const agriCreditService = new AgriCreditService()

    const metadata = {
      invoiceId,
      lotId,
      farmerDID: authResult.user.did,
      offtakerDID: body.offtakerDID,
      amount,
      currency: currency || "USDC",
      dueDate,
      qualityGrade: qualityGrade || 0,
      ipfsHash: ipfsHash || "",
    }

    const transactionId = await agriCreditService.mintAgriCredit(amount, metadata)

    return NextResponse.json({
      success: true,
      transactionId,
      agriCreditAmount: amount,
      metadata,
    })
  } catch (error) {
    console.error("Error creating AgriCredit:", error)
    return NextResponse.json({ error: "Failed to create AgriCredit tokens" }, { status: 500 })
  }
}
